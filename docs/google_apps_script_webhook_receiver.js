/**
 * GOOGLE APPS SCRIPT — WEBHOOK RECEIVER (Lead Sheet Writer)
 * ----------------------------------------------------------
 * This script is deployed as a Web App and receives POST/GET
 * requests from your Vercel /api/capi server whenever a Lead
 * event fires. It writes one row per lead into your Sheet.
 *
 * DEPLOY INSTRUCTIONS:
 * 1. Go to Extensions → Apps Script in your Google Sheet.
 * 2. Paste this entire script (keep the Purchase script in a
 *    separate file tab, or paste both together).
 * 3. Click Deploy → New Deployment → Web App.
 * 4. Set "Execute as" = Me, "Who has access" = Anyone.
 * 5. Copy the Web App URL and paste it into Vercel as:
 *    LEADS_SHEET_WEBHOOK = <your web app url>
 *
 * SHEET COLUMN ORDER (matches your sheet exactly):
 * Timestamp | Name | EventID | Phone | City | URL | Traffic Type | fbc | Payment Verified | Pixel Status
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

    // Parse both JSON body and URL params (server sends both formats)
    let data = {};
    if (e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (_) {}
    }
    // Merge URL params (they override JSON for safety)
    if (e.parameter) {
      Object.assign(data, e.parameter);
    }

    // ── Extract fields (handle both capitalized and lowercase keys) ──
    const timestamp   = data['Timestamp']    || data['timestamp']    || new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
    const name        = data['Name']         || data['name']         || 'N/A';
    const phone       = data['Phone']        || data['phone']        || 'N/A';
    const city        = data['City']         || data['city']         || 'N/A';
    const url         = data['URL']          || data['url']          || 'N/A';
    const traffic     = data['Traffic Type'] || data['traffic']      || 'organic';
    // ── Attribution: this is what ties the lead back to the ad click ──
    const fbc         = data['fbc']          || data['Fbc']          || '';
    const eventId     = data['Event ID']     || data['event_id']     || '';

    // ── Write the row ──
    // Matches your sheet column order exactly:
    // A:Timestamp | B:Name | C:EventID | D:Phone | E:City | F:URL | G:Traffic Type | H:fbc | I:Payment Verified | J:Pixel Status
    sheet.appendRow([
      timestamp,  // A — Timestamp
      name,       // B — Name
      eventId,    // C — EventID
      phone,      // D — Phone
      city,       // E — City
      url,        // F — URL
      traffic,    // G — Traffic Type
      fbc,        // H — fbc ← Meta attribution click ID
      false,      // I — Payment Verified (checkbox, unchecked by default)
      ''          // J — Pixel Status (filled by Purchase script)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, fbc_received: !!fbc }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
