/**
 * GOOGLE APPS SCRIPT — WEBHOOK RECEIVER (Lead Sheet Writer)
 * ----------------------------------------------------------
 * Matches your sheet column order exactly:
 * A:Timestamp | B:Name | C:EventID | D:Phone | E:City | F:URL | G:Traffic Type | H:fbc | I:Payment Verified | J:Pixel Status | K:Google Click ID | L:Hashed Phone
 */

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse both JSON body and URL params
    let data = {};
    if (e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (_) { }
    }
    if (e.parameter) {
      Object.assign(data, e.parameter);
    }

    // ── Extract fields ──
    const timestamp = data['Timestamp'] || data['timestamp'] || new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
    const name = data['Name'] || data['name'] || 'N/A';
    const phone = data['Phone'] || data['phone'] || 'N/A';
    const city = data['City'] || data['city'] || 'N/A';
    const url = data['URL'] || data['url'] || 'N/A';
    const traffic = data['Traffic Type'] || data['traffic'] || 'organic';
    
    // ── Attribution ──
    const fbc = data['fbc'] || data['Fbc'] || '';
    const gclid = data['gclid'] || ''; 
    const eventId = data['Event ID'] || data['event_id'] || '';

    // ── Google Ads: Hash Phone Number (SHA256) for Column L ──
    const cleanPhone = phone.replace(/\+/g, '').replace(/\s+/g, '').replace(/-/g, '');
    const hashedPhone = (cleanPhone && cleanPhone !== 'N/A') 
      ? Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, cleanPhone.toLowerCase())
          .map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('')
      : '';

    // ── Write the row ──
    sheet.appendRow([
      timestamp,    // A — Timestamp
      name,         // B — Name
      eventId,      // C — EventID
      phone,        // D — Phone
      city,         // E — City
      url,          // F — URL
      traffic,      // G — Traffic Type
      fbc,          // H — fbc
      false,        // I — Payment Verified (checkbox)
      '',           // J — Pixel Status
      gclid,        // K — Google Click ID
      hashedPhone   // L — Hashed Phone
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, fbc_received: !!fbc, gclid_received: !!gclid }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
