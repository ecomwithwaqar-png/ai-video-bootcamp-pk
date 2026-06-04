function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return handleRequest(data);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * HEADER-AWARE RECEIVER (AUTO-EXPANDING)
 * This script finds your columns and AUTO-ADDS missing Meta headers (IP, UA, fbp).
 */
function handleRequest(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Leads");
  if (!sheet) sheet = ss.insertSheet("Leads");

  // 1. AUTO-ADD missing "God-tier" columns if missing
  ensureHeaders(sheet, ["fbp", "IP", "UA"]);

  // 2. Get current headers
  const headerRange = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1));
  const headers = headerRange.getValues()[0];
  
  // 3. Define the data mapping
  // Left side: Exactly what is in your Sheet Row 1
  // Right side: Exactly what the Vercel API sends in JSON
  const rowData = {
    "Conversion Time": data.conversion_time || new Date(),
    "Name": data.name || "N/A",
    "Event ID": data.event_id || "evt_" + Date.now(),
    "Phone": data.phone || "N/A",
    "City": data.city || "N/A",
    "URL": data.url || "N/A",
    "Traffic Type": data.traffic_type || "paid",
    "fbc": data.fbc || "N/A",
    "fbp": data.fbp || "N/A",
    "IP": data.ip || "N/A",
    "UA": data.ua || "N/A",
    "Google Click ID": data.gclid || "N/A",
    "ttclid": data.ttclid || "N/A",
    "Payment Verified": false,
    "Pixel Status": "Logged"
  };

  // 4. Map data to your sheet's actual column order
  const newRow = [];
  headers.forEach(header => {
    const cleanHeader = header.toString().trim();
    if (rowData.hasOwnProperty(cleanHeader)) {
      newRow.push(rowData[cleanHeader]);
    } else {
      newRow.push(""); 
    }
  });

  // 5. Append the row
  sheet.appendRow(newRow);

  return ContentService.createTextOutput(JSON.stringify({
    "status": "success",
    "message": "Lead logged successfully",
    "event_id": rowData["Event ID"]
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Automatically checks for missing headers and appends them to the end of Row 1.
 */
function ensureHeaders(sheet, requiredHeaders) {
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders]);
    return;
  }
  
  const currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => h.toString().trim());
  const missing = requiredHeaders.filter(h => currentHeaders.indexOf(h) === -1);
  
  if (missing.length > 0) {
    sheet.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]);
  }
}
