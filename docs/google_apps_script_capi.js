/**
 * GOOGLE SHEETS TO META CAPI - PURCHASE EVENT SCRIPT
 * --------------------------------------------------
 * Instructions:
 * 1. In your Google Sheet, go to Extensions -> Apps Script.
 * 2. Delete any code there and paste this entire script.
 * 3. Replace the PIXEL_ID and ACCESS_TOKEN variables below with your real Meta credentials.
 * 4. Save the script (Ctrl+S).
 * 5. Your Sheet columns should include: Name | Phone | fbc | Payment Verified
 *    - "fbc" is auto-populated by the server from the checkout form submission.
 *    - "Payment Verified" column must use Checkboxes (Insert -> Checkbox).
 * 6. Set up an "On Edit" trigger in Apps Script for this to run automatically:
 *    - Click the Alarm Clock icon (Triggers) on the left sidebar.
 *    - Click "Add Trigger" (bottom right).
 *    - Choose function to run: `onEditTrigger`
 *    - Select event type: `On edit`
 *    - Save and grant permissions.
 */

const PIXEL_ID = '993205486461512'; // Your Meta Pixel ID
const ACCESS_TOKEN = 'EAARXc2Dz9wIBRb8bqV59EFhl7sllEZCNG454oJWJYL0ZCZBPFgTt25gWKXm9sYDe7lyQJsXGGZAEFgye78uqJl43UEGt7MgTbwcq2XPu3h2shvZASZBuemOmzO8yAZB4VwZB295KacQUP2ZA3Fc3q3ZASHkYcCU5EtK7c3jk17h1bZB0TmVP4IJzzKeDfEXnJBsrAZDZD'; // Generate this in Meta Events Manager -> Settings -> Generate Access Token

// This function runs every time a cell is edited in the sheet
function onEditTrigger(e) {
  if (!e) return;
  
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const colIndex = range.getColumn();
  const rowIndex = range.getRow();
  
  // Skip headers
  if (rowIndex === 1) return;
  
  // Get all headers to find which column is what
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const checkboxColIdx = headers.indexOf('Payment Verified') + 1;
  const nameColIdx = headers.indexOf('Name') + 1;
  const phoneColIdx = headers.indexOf('Phone') + 1;
  const fbcColIdx = headers.indexOf('fbc') + 1; // Attribution: Meta click ID
  
  // Check if the edited cell was the "Payment Verified" checkbox AND it was checked (true)
  if (colIndex === checkboxColIdx && range.getValue() === true) {
    const name = sheet.getRange(rowIndex, nameColIdx).getValue().toString();
    const phone = sheet.getRange(rowIndex, phoneColIdx).getValue().toString();
    // Read fbc if the column exists (will be empty string if missing, which is fine)
    const fbc = fbcColIdx > 0 ? sheet.getRange(rowIndex, fbcColIdx).getValue().toString() : '';
    
    // Fire the purchase event
    if (name && phone) {
      sendPurchaseToMeta(name, phone, fbc);
      // Optional: Prevent firing twice by unchecking or changing text
      range.setValue(false); 
      sheet.getRange(rowIndex, checkboxColIdx + 1).setValue("Pixel Fired ✓");
    }
  }
}

function sendPurchaseToMeta(name, phone, fbc) {
  // Clean phone number (remove +, spaces, leading 0s, ensure country code)
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) { cleanPhone = '92' + cleanPhone.substring(1); }
  else if (!cleanPhone.startsWith('92') && cleanPhone.length === 10) { cleanPhone = '92' + cleanPhone; }
  
  // Clean Name
  const cleanName = name.toLowerCase().trim();

  // Meta Requires SHA256 Hashing for PII
  const hashedPhone = hashSHA256(cleanPhone);
  const hashedName = hashSHA256(cleanName);
  
  // Create a unique event ID so it never duplicates
  const eventId = 'buy_' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000);

  // Build user_data — fbc is NOT hashed (it's a click ID, not PII)
  const userData = {
    ph: [hashedPhone],
    fn: [hashedName]
  };
  // Only attach fbc if it exists — this is what attributes the purchase to a campaign
  if (fbc && fbc.trim() !== '') {
    userData.fbc = fbc.trim();
    console.log('Attribution fbc attached: ' + fbc.trim());
  } else {
    console.warn('No fbc found — purchase will not be attributed to a specific ad campaign.');
  }

  const payload = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(new Date().getTime() / 1000),
        action_source: 'system_generated',
        event_id: eventId,
        user_data: userData,
        custom_data: {
          currency: 'PKR',
          value: 1499
        }
      }
    ]
  };

  const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    console.log('Meta Response: ' + response.getContentText());
  } catch (error) {
    console.error('Error sending to Meta: ' + error);
  }
}

// Helper: Convert string to SHA256 Hash string
function hashSHA256(input) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  let txtHash = '';
  for (let i = 0; i < rawHash.length; i++) {
    let hashVal = rawHash[i];
    if (hashVal < 0) { hashVal += 256; }
    if (hashVal.toString(16).length == 1) { txtHash += '0'; }
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}
