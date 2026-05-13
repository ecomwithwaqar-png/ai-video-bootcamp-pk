// CONFIGURATION
const META_PIXEL_ID = '993205486461512'; 
const META_ACCESS_TOKEN = 'EAARXc2Dz9wIBRb8bqV59EFhl7sllEZCNG454oJWJYL0ZCZBPFgTt25gWKXm9sYDe7lyQJsXGGZAEFgye78uqJl43UEGt7MgTbwcq2XPu3h2shvZASZBuemOmzO8yAZB4VwZB295KacQUP2ZA3Fc3q3ZASHkYcCU5EtK7c3jk17h1bZB0TmVP4IJzzKeDfEXnJBsrAZDZD';

const TIKTOK_PIXEL_ID = 'D825I1JC77U9B8E8SBI0';
const TIKTOK_ACCESS_TOKEN = '327195e4af09873436e1ea59242ae28c1ae4bcec';

/**
 * Automatically fires Meta or TikTok CAPI when you tick a checkbox.
 */
function onEditTrigger(e) {
  if (!e) return;
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const colIndex = range.getColumn();
  const rowIndex = range.getRow();
  
  // Ignore header row
  if (rowIndex === 1) return;
  
  // Get all headers to find columns by name
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // 1. MAP COLUMNS
  const metaBoxIdx = headers.indexOf('Payment Verified') + 1;
  const tiktokBoxIdx = headers.indexOf('TikTok Verified') + 1;
  const nameColIdx = headers.indexOf('Name') + 1;
  const phoneColIdx = headers.indexOf('Phone') + 1;
  const ttclidColIdx = headers.indexOf('ttclid') + 1;
  const statusColIdx = headers.indexOf('CAPI Status') + 1;

  // 2. GET USER DATA
  const name = nameColIdx > 0 ? sheet.getRange(rowIndex, nameColIdx).getValue().toString() : '';
  const phone = phoneColIdx > 0 ? sheet.getRange(rowIndex, phoneColIdx).getValue().toString() : '';

  // 3. META TRIGGER (Payment Verified)
  if (colIndex === metaBoxIdx && range.getValue() === true) {
    if (name && phone) {
      sendPurchaseToMeta(name, phone);
      range.setValue(false); // Uncheck automatically
      if (statusColIdx > 0) sheet.getRange(rowIndex, statusColIdx).setValue("Meta CAPI Sent ✅");
    }
  }

  // 4. TIKTOK TRIGGER (TikTok Verified)
  if (colIndex === tiktokBoxIdx && range.getValue() === true) {
    if (name && phone) {
      const ttclid = ttclidColIdx > 0 ? sheet.getRange(rowIndex, ttclidColIdx).getValue().toString() : '';
      const response = sendPurchaseToTikTok(phone, ttclid);
      range.setValue(false); // Uncheck automatically
      if (statusColIdx > 0) {
        if (response.getResponseCode() === 200) {
          const now = new Date().toLocaleTimeString();
          sheet.getRange(rowIndex, statusColIdx).setValue("TikTok CAPI Sent ✅ (" + now + ")");
        } else {
          sheet.getRange(rowIndex, statusColIdx).setValue("TikTok Error: " + response.getContentText().substring(0, 50));
        }
      }
    }
  }
}

/**
 * Sends a Purchase event to Meta CAPI
 */
function sendPurchaseToMeta(name, phone) {
  const hashedPhone = hashSHA256(phone.replace(/\D/g, ''));
  const firstName = name.split(' ')[0].toLowerCase();
  const hashedFirstName = hashSHA256(firstName);

  const payload = {
    "data": [{
      "event_name": "Purchase",
      "event_time": Math.floor(Date.now() / 1000),
      "action_source": "system_generated",
      "user_data": {
        "ph": [hashedPhone],
        "fn": [hashedFirstName]
      },
      "custom_data": {
        "currency": "PKR",
        "value": 1499
      }
    }]
  };

  const url = "https://graph.facebook.com/v17.0/" + META_PIXEL_ID + "/events?access_token=" + META_ACCESS_TOKEN;
  UrlFetchApp.fetch(url, {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  });
}

/**
 * Sends a CompletePayment event to TikTok Events API
 */
function sendPurchaseToTikTok(phone, ttclid) {
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) { cleanPhone = '92' + cleanPhone.substring(1); }
  // TikTok requires the + prefix for E.164 format before hashing
  const hashedPhone = hashSHA256('+' + cleanPhone);

  const payload = {
    "event_source": "web",
    "event_source_id": TIKTOK_PIXEL_ID,
    "data": [{
      "event": "CompletePayment",
      "event_id": "tt_" + Math.floor(Date.now() / 1000) + "_" + Math.floor(Math.random() * 1000),
      "event_time": Math.floor(Date.now() / 1000),
      "user": {
        "phone_number": hashedPhone,
        "email": hashSHA256("test@example.com"),
        "external_id": hashedPhone,
        "ip_address": "1.1.1.1",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      "properties": {
        "currency": "PKR",
        "value": 1499,
        "content_id": "aibootcamp_course",
        "contents": [{
          "content_id": "aibootcamp_course",
          "content_name": "AI Video Bootcamp",
          "content_type": "product",
          "quantity": 1,
          "price": 1499
        }]
      }
    }]
  };

  // Only add ttclid if it exists
  if (ttclid && ttclid.trim() !== "") {
    payload.data[0].user.ttclid = ttclid.trim();
  }

  const url = "https://business-api.tiktok.com/open_api/v1.3/event/track/";
  return UrlFetchApp.fetch(url, {
    "method": "post",
    "contentType": "application/json",
    "headers": { "Access-Token": TIKTOK_ACCESS_TOKEN },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  });
}

/**
 * Helper: SHA256 Hashing
 */
function hashSHA256(input) {
  if (!input) return "";
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input.toString().trim().toLowerCase());
  let txtHash = "";
  for (let i = 0; i < rawHash.length; i++) {
    let hashVal = rawHash[i];
    if (hashVal < 0) hashVal += 256;
    if (hashVal.toString(16).length == 1) txtHash += "0";
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}
