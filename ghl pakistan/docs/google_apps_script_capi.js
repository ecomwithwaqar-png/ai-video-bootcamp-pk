// ─── CONFIGURATION FOR GHL PAKISTAN ──────────────────────────────────────────
var META_PIXEL_ID    = '27827343320205049';
var META_ACCESS_TOKEN = 'EAAVEgSnZBQVcBRx3zyAiTbZCNVJ5Rt1ZAy2R5PObEH5DPO6XteqZCwZBVgdLZCVIZANPBnSS8DHLpZCnvZAcEru8IHGPZAy2GOC7T1XCbXbcymDjOWcN7kuQv3KZBJZCGC5JciKjaNW6HcPMdYEV8McZAZAnmaKm2ACPmZAOQ7pJZCobHC7v8UPRMyU6HcnN1c2FEvnypgZDZD';
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GHL CAPI TRIGGER
 * code.gs — Fires Meta Purchase CAPI when "Payment Verified" checkbox is ticked.
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

  // Prevent duplicate submissions
  if (statusColIdx > 0) {
    const currentStatus = sheet.getRange(rowIndex, statusColIdx).getValue().toString();
    if (currentStatus.indexOf('Meta Sent ✅') !== -1) {
      Logger.log('Row ' + rowIndex + ' already sent to Meta. Skipping.');
      range.setValue(false);
      return;
    }
    sheet.getRange(rowIndex, statusColIdx).setValue('Processing...');
  }

  Logger.log('🚀 Processing row: ' + rowIndex);

  // Extract lead variables
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
    value:   getVal(sheet, rowIndex, headers, 'Value')
  };

  Logger.log('Data: ' + JSON.stringify(u));

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

    // Uncheck the box after processing completes
    range.setValue(false);

    if (statusColIdx > 0) {
      if (respCode === 200 && !result.error) {
        const received = result.events_received || 0;
        sheet.getRange(rowIndex, statusColIdx).setValue(
          'Meta Sent ✅ (' + new Date().toLocaleTimeString() + ')'
        );
      } else {
        const msg = result.error ? result.error.message : 'Unknown Meta Error';
        Logger.log('Meta Error: ' + msg);
        sheet.getRange(rowIndex, statusColIdx).setValue('Meta Error: ' + msg.substring(0, 120));
      }
    }

  } catch (err) {
    Logger.log('Script Error: ' + err.toString());
    if (statusColIdx > 0) {
      sheet.getRange(rowIndex, statusColIdx).setValue('Script Error: ' + err.toString().substring(0, 120));
    }
    range.setValue(false);
  }
}

function sendPurchaseToMeta(u) {
  // Normalize phone to Pakistan E.164 format
  let phone = u.phone.replace(/\D/g, '');
  if (phone.startsWith('0'))      phone = '92' + phone.substring(1);
  else if (phone.length === 10)   phone = '92' + phone;

  const hashedPhone = hashSHA256(phone);
  const hashedName  = hashSHA256(u.name.split(' ')[0]);
  const hashedCity  = hashSHA256(u.city);

  const userData = {};
  if (hashedPhone) userData.ph           = [hashedPhone];
  if (hashedName)  userData.fn           = [hashedName];
  if (hashedCity)  userData.ct           = [hashedCity];
  if (u.fbc)       userData.fbc          = u.fbc;
  if (u.fbp)       userData.fbp          = u.fbp;
  if (u.ip  && u.ip  !== 'N/A') userData.client_ip_address  = u.ip;
  if (u.ua  && u.ua  !== 'N/A') userData.client_user_agent  = u.ua;
  if (hashedPhone) userData.external_id  = hashedPhone;

  // Custom data logic for GHL pricing
  const orderTotal = Number(u.value) || 2499;
  const contentName = orderTotal > 2499 ? 'GHL Masterclass + Facebook Ads Upgrade' : 'GHL AI Marketing Masterclass';

  const payload = {
    data: [{
      event_name:        'Purchase',
      event_time:        Math.floor(Date.now() / 1000),
      event_id:          u.eventId || ('man_' + Date.now()),
      event_source_url:  u.url || 'https://ghl-pakistan.vercel.app',
      action_source:     'website',
      user_data:         userData,
      custom_data: {
        currency:     'PKR',
        value:        orderTotal,
        content_name: contentName,
        content_ids:  ['ghl_001'],
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

// Manual Test Function
function testMeta() {
  const result = sendPurchaseToMeta({
    name:    'Test GHL Student',
    phone:   '03001234567',
    eventId: 'test_ghl_' + Date.now(),
    city:    'Lahore',
    fbc:     'fb.1.12345.67890',
    fbp:     'fb.1.98765.43210',
    ip:      '1.1.1.1',
    ua:      'Mozilla/5.0 Chrome/120.0',
    url:     'https://ghl-pakistan.vercel.app',
    value:   2499
  });
  Logger.log('GHL Test Result: ' + result.getContentText());
}
