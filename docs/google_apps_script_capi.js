// ─── CONFIG ───────────────────────────────────────────────────────────────────
var META_PIXEL_ID    = '1622955485439618';
var META_ACCESS_TOKEN = 'EAAVEgSnZBQVcBRoSoiLR0qzwZBkPHn4cfkgzHRT0TnhFZBfwpiSV7oGVBSm2I9mXCNKOYwVHUHD72eSukvWL7ZCtBUS97Tuw2d2duakEGKUsddzlzB5FNRkENF9vjtBbjZBwe1NXhlnP5rjLPE45ywo2vpUwZB8spZCClVU3opYqMkGNpuqLcWqt2hkiE2ZABgZDZD';
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CAPI TRIGGER — GOD LEVEL FINAL VERSION
 * code.gs — Fires Meta Purchase CAPI when "Payment Verified" checkbox is ticked.
 * Features: deduplication lock, full response logging, clean payload, E.164 phone.
 */
function onEditTrigger(e) {
  if (!e) return;

  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "Leads") return;

  const range    = e.range;
  const colIndex = range.getColumn();
  const rowIndex = range.getRow();

  // Skip header row
  if (rowIndex === 1) return;

  // Map columns from headers
  const headers     = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const metaBoxIdx  = headers.indexOf('Payment Verified') + 1;
  let   statusColIdx = headers.indexOf('Pixel Status') + 1;
  if (statusColIdx === 0) statusColIdx = headers.indexOf('CAPI Status') + 1;

  // Only fire when the Payment Verified checkbox is ticked TRUE
  if (colIndex !== metaBoxIdx || range.getValue() !== true) return;

  // ── DEDUPLICATION LOCK ──────────────────────────────────────────────────────
  // Prevent double-firing if checkbox is ticked multiple times rapidly
  if (statusColIdx > 0) {
    const currentStatus = sheet.getRange(rowIndex, statusColIdx).getValue().toString();
    if (currentStatus.indexOf('Meta Sent ✅') !== -1) {
      Logger.log('Row ' + rowIndex + ' already sent to Meta. Skipping.');
      range.setValue(false);
      return;
    }
    // Mark as "Processing" immediately to prevent race condition
    sheet.getRange(rowIndex, statusColIdx).setValue('Processing...');
  }
  // ────────────────────────────────────────────────────────────────────────────

  Logger.log('🚀 Processing row: ' + rowIndex);

  // Extract data from row
  const u = {
    name:    getVal(sheet, rowIndex, headers, 'Name'),
    phone:   getVal(sheet, rowIndex, headers, 'Phone'),
    eventId: getVal(sheet, rowIndex, headers, 'Event ID'),
    fbc:     getVal(sheet, rowIndex, headers, 'fbc'),
    fbp:     getVal(sheet, rowIndex, headers, 'fbp'),
    ip:      getVal(sheet, rowIndex, headers, 'IP'),
    ua:      getVal(sheet, rowIndex, headers, 'UA'),
    city:    getVal(sheet, rowIndex, headers, 'City'),
    url:     getVal(sheet, rowIndex, headers, 'URL'),
    value:   getVal(sheet, rowIndex, headers, 'Value'),
    gclid:   getVal(sheet, rowIndex, headers, 'Google Click ID')
  };

  Logger.log('Data: ' + JSON.stringify(u));

  // Validate required fields
  if (!u.name || !u.phone) {
    if (statusColIdx > 0) sheet.getRange(rowIndex, statusColIdx).setValue('Error: Missing Name/Phone');
    range.setValue(false);
    return;
  }

  try {
    const response  = sendPurchaseToMeta(u);
    const respCode  = response.getResponseCode();
    const respBody  = response.getContentText();
    const result    = JSON.parse(respBody);

    Logger.log('Meta HTTP Code: ' + respCode);
    Logger.log('Meta Response:  ' + respBody);

    // Uncheck the box after processing
    range.setValue(false);

    if (statusColIdx > 0) {
      if (respCode === 200 && !result.error) {
        const received = result.events_received || 0;
        sheet.getRange(rowIndex, statusColIdx).setValue(
          'Meta Sent ✅ events_received:' + received + ' (' + new Date().toLocaleTimeString() + ')'
        );
      } else {
        const msg = result.error ? result.error.message : 'Unknown Meta Error';
        Logger.log('Meta Error: ' + msg);
        sheet.getRange(rowIndex, statusColIdx).setValue('Meta Error: ' + msg.substring(0, 120));
      }
    }

    // ── GOOGLE ADS OFFLINE CONVERSION UPLOAD ───────────────────────────────
    // Write "Verified Purchase" row to GoogleAds_Upload tab so Google Ads
    // can import it on its next scheduled scan of this sheet.
    if (u.gclid) {
      try {
        var gadsSheet = e.source.getSheetByName('GoogleAds_Upload');
        if (gadsSheet) {
          var now = new Date();
          var pad = function(n) { return n < 10 ? '0' + n : n; };
          var convTime = now.getFullYear() + '-' + pad(now.getMonth()+1) + '-' + pad(now.getDate()) + ' ' +
                         pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + ' +0500';
          var convValue = Number(u.value) || 1999;
          gadsSheet.appendRow([u.gclid, convTime, 'Verified Purchase', convValue, 'PKR']);
          Logger.log('Google Ads Upload: Verified Purchase row added for gclid: ' + u.gclid.substring(0, 30) + '...');
        } else {
          Logger.log('Google Ads Upload: GoogleAds_Upload sheet not found');
        }
      } catch (gadsErr) {
        Logger.log('Google Ads Upload Error: ' + gadsErr.toString());
      }
    } else {
      Logger.log('Google Ads Upload: No gclid found for row ' + rowIndex + ', skipping.');
    }
    // ──────────────────────────────────────────────────────────────────────

  } catch (err) {
    Logger.log('Script Error: ' + err.toString());
    if (statusColIdx > 0) {
      sheet.getRange(rowIndex, statusColIdx).setValue('Script Error: ' + err.toString().substring(0, 120));
    }
    range.setValue(false);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

function sendPurchaseToMeta(u) {
  // Normalize phone to Pakistan E.164 format
  let phone = u.phone.replace(/\D/g, '');
  if (phone.startsWith('0'))      phone = '92' + phone.substring(1);
  else if (phone.length === 10)   phone = '92' + phone;
  // If already has country code (e.g. 923001234567), keep it as is

  const hashedPhone = hashSHA256(phone);
  const hashedName  = hashSHA256(u.name.split(' ')[0]);
  const hashedCity  = hashSHA256(u.city);

  // Build user_data — Meta v19 expects arrays for ph, fn, ct
  const userData = {};
  if (hashedPhone) userData.ph           = [hashedPhone];
  if (hashedName)  userData.fn           = [hashedName];
  if (hashedCity)  userData.ct           = [hashedCity];
  if (u.fbc)       userData.fbc          = u.fbc;
  if (u.fbp)       userData.fbp          = u.fbp;
  if (u.ip  && u.ip  !== 'N/A') userData.client_ip_address  = u.ip;
  if (u.ua  && u.ua  !== 'N/A') userData.client_user_agent  = u.ua;
  if (hashedPhone) userData.external_id  = hashedPhone;

  const payload = {
    data: [{
      event_name:        'Purchase',
      event_time:        Math.floor(Date.now() / 1000),
      event_id:          u.eventId || ('man_' + Date.now()),
      event_source_url:  u.url || 'https://aivideobootcamp.online/checkout',
      action_source:     'website',
      user_data:         userData,
      custom_data: {
        currency:     'PKR',
        value:        Number(u.value) || 1999,
        content_name: Number(u.value) > 1999 ? 'AI Video Bootcamp + AI Creator Vault' : 'AI Video Masterclass',
        content_ids:  ['avb_001'],
        content_type: 'product'
      }
    }]
  };

  const endpoint = 'https://graph.facebook.com/v19.0/' + META_PIXEL_ID +
                   '/events?access_token=' + META_ACCESS_TOKEN;

  return UrlFetchApp.fetch(endpoint, {
    method:           'post',
    contentType:      'application/json',
    payload:          JSON.stringify(payload),
    muteHttpExceptions: true
  });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getVal(sheet, row, headers, name) {
  const idx = headers.indexOf(name);
  if (idx === -1) return '';
  const val = sheet.getRange(row, idx + 1).getValue().toString().trim();
  return (val === 'N/A' || val === 'undefined' || val === '0') ? '' : val;
}

function hashSHA256(input) {
  if (!input || input === 'N/A') return '';
  const raw = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    input.toString().toLowerCase().trim()
  );
  return raw.map(function(b) {
    const hex = (b < 0 ? b + 256 : b).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// ─── TEST FUNCTION ───────────────────────────────────────────────────────────
// Run this manually to verify Meta connection is working
function testMeta() {
  const result = sendPurchaseToMeta({
    name:    'Test User Ahmed',
    phone:   '03180000000',
    eventId: 'test_man_' + Date.now(),
    city:    'Lahore',
    fbc:     'fb.1.12345.67890',
    fbp:     'fb.1.98765.43210',
    ip:      '1.2.3.4',
    ua:      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    url:     'https://aivideobootcamp.online/checkout'
  });
  Logger.log('Test Result: ' + result.getContentText());
}
