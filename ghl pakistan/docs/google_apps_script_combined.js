// ─── CONFIGURATION FOR GHL PAKISTAN ──────────────────────────────────────────
// Custom configuration mapped exclusively to the GHL Pakistan Pixel & Token.
var META_PIXEL_ID     = '27827343320205049';
var META_ACCESS_TOKEN = 'EAAVEgSnZBQVcBRx3zyAiTbZCNVJ5Rt1ZAy2R5PObEH5DPO6XteqZCwZBVgdLZCVIZANPBnSS8DHLpZCnvZAcEru8IHGPZAy2GOC7T1XCbXbcymDjOWcN7kuQv3KZBJZCGC5JciKjaNW6HcPMdYEV8McZAZAnmaKm2ACPmZAOQ7pJZCobHC7v8UPRMyU6HcnN1c2FEvnypgZDZD';
// ──────────────────────────────────────────────────────────────────────────────

/**
 * GHL WEBHOOK RECEIVER & META CAPI MANAGER — STANDALONE INTEGRATION
 * Paste this entire script into your GHL Google Sheet's Apps Script Editor (Extensions > Apps Script).
 */

// ─── 1. WEBHOOK RECEIVER (doPost) ─────────────────────────────────────────────
// Receives lead data from the checkout page and logs it.
function doPost(e) {
  try {
    var clientIp = '';
    try {
      clientIp = e.parameter ? (e.parameter.ip || '') : '';
    } catch(ipErr) { /* ignore */ }

    var data;
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Leads");

    // Define GHL column structure
    const defaultHeaders = [
      "Conversion Time", "Order ID", "Name", "Phone", "City", 
      "Order Bump", "Total Price", "fbc", "fbp", "IP", "UA", 
      "Google Click ID", "ttclid", "Payment Verified", "CAPI Status"
    ];

    // Create "Leads" sheet with headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet("Leads");
      sheet.appendRow(defaultHeaders);
      // Set "Payment Verified" column (Column 14) as checkbox
      const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
      sheet.getRange(2, 14, 1000, 1).setDataValidation(rule);
    }

    // Get current headers from Row 1
    const lastCol = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // Map incoming lead parameters to sheet columns
    const newRow = headers.map(function(header) {
      const h = header.toString().trim().toLowerCase();
      if (h === "payment verified") return false;
      if (h === "capi status") return "Lead CAPI Firing...";
      
      switch(h) {
        case "conversion time":
          return data.timestamp ? new Date(data.timestamp).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }) : new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
        case "order id":
          return data.orderId || "";
        case "name":
          return data.name || "";
        case "phone":
          return data.whatsapp || "";
        case "city":
          return data.city || "";
        case "order bump":
          return data.orderBump || "No";
        case "total price":
          return data.totalPrice || "";
        case "fbc":
          return data.fbc || "";
        case "fbp":
          return data.fbp || "";
        case "ip":
          return data.ip || e.parameter.ip || "";
        case "ua":
          return data.ua || "";
        case "google click id":
          return data.gclid || "";
        case "ttclid":
          return data.ttclid || "";
        default:
          const dataKey = Object.keys(data).find(key => key.toLowerCase() === h);
          return dataKey ? data[dataKey] : "";
      }
    });

    // Find first empty row in Column A
    let targetRow = 2;
    const lastRowVal = sheet.getLastRow();
    if (lastRowVal > 1) {
      const colAValues = sheet.getRange(1, 1, lastRowVal, 1).getValues();
      for (let i = 1; i < colAValues.length; i++) {
        if (colAValues[i][0] === "") {
          targetRow = i + 1;
          break;
        }
        if (i === colAValues.length - 1) {
          targetRow = colAValues.length + 1;
        }
      }
    }

    // Write row values directly to the target empty row
    sheet.getRange(targetRow, 1, 1, newRow.length).setValues([newRow]);

    // Apply checkbox data validation to the specific cell to keep UI clean
    const pvColIdx = findColumnIndex(headers, "Payment Verified");
    if (pvColIdx > 0) {
      const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
      sheet.getRange(targetRow, pvColIdx).setDataValidation(rule).setValue(false);
    }

    // Fire Meta CAPI 'Lead' event server-side for redundant tracking
    var capiStatus = "Lead logged";
    if (META_ACCESS_TOKEN && META_PIXEL_ID) {
      try {
        const leadUser = {
          name: data.name || "",
          phone: data.whatsapp || "",
          eventId: data.orderId || "",
          city: data.city || "",
          value: data.totalPrice || 1999,
          fbc: data.fbc || "",
          fbp: data.fbp || "",
          ip: data.ip || clientIp || "",
          ua: data.ua || "",
          url: data.url || "https://ghl-pakistan.vercel.app"
        };
        Logger.log('Data:');
        Logger.log(JSON.stringify(leadUser));
        const capiResp = sendEventToMeta('Lead', leadUser);
        const code = capiResp.getResponseCode();
        const body = JSON.parse(capiResp.getContentText());
        if (code === 200 && !body.error) {
          capiStatus = "Lead Logged & CAPI Sent ✅";
        } else {
          capiStatus = "Lead Logged, CAPI Error: " + (body.error ? body.error.message : "Code " + code);
        }
      } catch (capiErr) {
        capiStatus = "Lead Logged, CAPI Failed: " + capiErr.toString().substring(0, 50);
      }
    } else {
      capiStatus = "Lead logged (CAPI offline: Add Access Token)";
    }

    // Write final status to the cell
    const statusColIdx = findColumnIndex(headers, "CAPI Status");
    if (statusColIdx > 0) {
      sheet.getRange(targetRow, statusColIdx).setValue(capiStatus);
    }

    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": capiStatus,
      "row": targetRow
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("doPost Error: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── 2. CAPI TRIGGER ON CHECKBOX EDIT (onEditTrigger) ────────────────────────
// Fires a server-side Meta Purchase event when the Payment Verified checkbox is ticked.
function onEditTrigger(e) {
  if (!e) return;
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "Leads") return;
  const range    = e.range;
  const colIndex = range.getColumn();
  const rowIndex = range.getRow();

  // Skip header row
  if (rowIndex === 1) return;

  // Map columns from headers dynamically
  const headers      = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const metaBoxIdx   = findColumnIndex(headers, 'Payment Verified');
  const statusColIdx = findColumnIndex(headers, 'CAPI Status');

  // Only fire when the Payment Verified checkbox is ticked TRUE
  if (colIndex !== metaBoxIdx || range.getValue() !== true) return;

  // DEDUPLICATION LOCK: Prevent double-firing
  if (statusColIdx > 0) {
    const currentStatus = sheet.getRange(rowIndex, statusColIdx).getValue().toString();
    if (currentStatus.indexOf('Purchase Sent ✅') !== -1) {
      Logger.log('Row ' + rowIndex + ' already purchased. Skipping.');
      range.setValue(false); // Reset checkbox to off
      return;
    }
    sheet.getRange(rowIndex, statusColIdx).setValue('Firing Purchase CAPI...');
  }

  Logger.log('🚀 Processing row: ' + rowIndex);

  // Extract data from sheet row
  const u = {
    name:    getVal(sheet, rowIndex, headers, 'Name'),
    phone:   getVal(sheet, rowIndex, headers, 'Phone'),
    eventId: getVal(sheet, rowIndex, headers, 'Order ID'),
    city:    getVal(sheet, rowIndex, headers, 'City'),
    value:   getVal(sheet, rowIndex, headers, 'Total Price'),
    fbc:     getVal(sheet, rowIndex, headers, 'fbc'),
    fbp:     getVal(sheet, rowIndex, headers, 'fbp'),
    ip:      getVal(sheet, rowIndex, headers, 'IP'),
    ua:      getVal(sheet, rowIndex, headers, 'UA'),
    url:     getVal(sheet, rowIndex, headers, 'URL')
  };

  if (!u.name || !u.phone) {
    if (statusColIdx > 0) sheet.getRange(rowIndex, statusColIdx).setValue('Error: Missing Name or Phone');
    range.setValue(false);
    return;
  }

  Logger.log('Data:');
  Logger.log(JSON.stringify(u));

  try {
    const response  = sendEventToMeta('Purchase', u);
    const respCode  = response.getResponseCode();
    const respBody  = response.getContentText();
    const result    = JSON.parse(respBody);

    Logger.log('Meta HTTP Code: ' + respCode);
    Logger.log('Meta Response:  ' + respBody);

    // Uncheck the checkbox after processing so it behaves like an action button
    range.setValue(false);

    if (statusColIdx > 0) {
      if (respCode === 200 && !result.error) {
        sheet.getRange(rowIndex, statusColIdx).setValue(
          'Purchase Sent ✅ (' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ')'
        );
      } else {
        const msg = result.error ? result.error.message : 'Unknown Meta Error';
        sheet.getRange(rowIndex, statusColIdx).setValue('CAPI Error: ' + msg.substring(0, 60));
      }
    }
  } catch (err) {
    Logger.log('Script Error: ' + err.toString());
    if (statusColIdx > 0) {
      sheet.getRange(rowIndex, statusColIdx).setValue('Script Error: ' + err.toString().substring(0, 60));
    }
    range.setValue(false);
  }
}

// ─── 3. SEND EVENTS TO META API ────────────────────────────────────────────────
// Hashes parameters and issues a POST to Meta Conversions API
function sendEventToMeta(eventName, u) {
  // Clean phone: replace symbols and make sure it has Pakistan code 92
  let phone = u.phone.toString().replace(/\D/g, '');
  if (phone.startsWith('0')) {
    phone = '92' + phone.substring(1);
  } else if (phone.length === 10) {
    phone = '92' + phone;
  }

  const hashedPhone = hashSHA256(phone);
  const hashedName  = hashSHA256(u.name.toString().split(' ')[0]);
  const hashedCity  = hashSHA256(u.city);

  const userData = {};
  if (hashedPhone) userData.ph           = [hashedPhone];
  if (hashedName)  userData.fn           = [hashedName];
  if (hashedCity)  userData.ct           = [hashedCity];
  if (u.fbc)       userData.fbc          = u.fbc;
  if (u.fbp)       userData.fbp          = u.fbp;
  if (u.ip && u.ip !== 'N/A')   userData.client_ip_address = u.ip;
  if (u.ua && u.ua !== 'N/A')   userData.client_user_agent = u.ua;
  if (hashedPhone) userData.external_id  = hashedPhone;

  // Custom data logic adjusted specifically for GHL Pakistan pricing and name
  const valAmt = Number(u.value) || 1999;
  const contentName = valAmt > 1999 ? 'GHL Masterclass + Facebook Ads Upgrade' : 'GHL AI Marketing Masterclass';

  const payload = {
    data: [{
      event_name:        eventName,
      event_time:        Math.floor(Date.now() / 1000),
      event_id:          u.eventId || ('man_' + Date.now()),
      event_source_url:  u.url || 'https://ghl-pakistan.vercel.app',
      action_source:     'website',
      user_data:         userData,
      custom_data: {
        currency:     'PKR',
        value:        valAmt,
        content_name: contentName,
        content_category: 'Online Course',
        content_ids:  ['ghl_001'],
        content_type: 'product'
      }
    }]
  };

  const endpoint = 'https://graph.facebook.com/v19.0/' + META_PIXEL_ID +
                   '/events?access_token=' + META_ACCESS_TOKEN;

  return UrlFetchApp.fetch(endpoint, {
    method:             'post',
    contentType:        'application/json',
    payload:            JSON.stringify(payload),
    muteHttpExceptions: true
  });
}

// ─── 4. UTILITIES ─────────────────────────────────────────────────────────────
// Get cell value dynamically by column header name
function getVal(sheet, row, headers, name) {
  const colIdx = findColumnIndex(headers, name);
  if (colIdx === 0) return '';
  const val = sheet.getRange(row, colIdx).getValue().toString().trim();
  return (val === 'N/A' || val === 'undefined' || val === '0') ? '' : val;
}

// Helper function to find column index (1-based) by matching column name case-insensitively and trimmed
function findColumnIndex(headers, name) {
  if (!headers || !name) return 0;
  const target = name.toString().trim().toLowerCase();
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].toString().trim().toLowerCase() === target) {
      return i + 1;
    }
  }
  return 0;
}

// Computes SHA-256 hashes of values (lowercased and trimmed) for privacy compliance
function hashSHA256(input) {
  if (!input || input === 'N/A' || input === 'undefined') return '';
  const raw = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    input.toString().toLowerCase().trim()
  );
  return raw.map(function(b) {
    const hex = (b < 0 ? b + 256 : b).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// ─── 5. TEST CONNECTION ────────────────────────────────────────────────────────
// Run this function manually in Apps Script to verify configuration
function testMetaConnection() {
  const result = sendEventToMeta('Lead', {
    name:    'Test GHL Marketer',
    phone:   '03001234567',
    eventId: 'test_ghl_lead_' + Date.now(),
    city:    'Karachi',
    fbc:     'fb.1.123456.789012',
    fbp:     'fb.1.987654.321098',
    ip:      '192.168.1.1',
    ua:      'Mozilla/5.0',
    url:     'https://ghl-pakistan.vercel.app'
  });
  Logger.log('Response Code: ' + result.getResponseCode());
  Logger.log('Response Body: ' + result.getContentText());
}
