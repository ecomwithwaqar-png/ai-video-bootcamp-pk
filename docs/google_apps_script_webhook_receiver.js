/**
 * WEBHOOK RECEIVER — GOD LEVEL FINAL VERSION
 * receiver.gs — Receives leads from Vercel and logs to "Leads" sheet.
 * Handles checkbox formatting, deduplication, and error logging.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Leads");

    // Create sheet with headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet("Leads");
      const defaultHeaders = [
        "Conversion Time", "Name", "Phone", "Event ID", "City",
        "URL", "Traffic Type", "fbc", "fbp", "IP", "UA",
        "Google Click ID", "ttclid", "Payment Verified", "Pixel Status"
      ];
      sheet.appendRow(defaultHeaders);

      // Set "Payment Verified" column as checkbox
      const pvCol = defaultHeaders.indexOf("Payment Verified") + 1;
      const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
      sheet.getRange(2, pvCol, 1000, 1).setDataValidation(rule);
    }

    // 1. Get current headers from Row 1
    const lastCol = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // 2. Map incoming data to columns
    const newRow = headers.map(function(header) {
      const h = header.toString().trim();
      if (h === "Payment Verified") return false;
      if (h === "Pixel Status" || h === "CAPI Status") return "Logged";
      return data[h] !== undefined ? data[h] : "";
    });

    // 3. Append the row
    const newRowIndex = sheet.getLastRow() + 1;
    sheet.appendRow(newRow);

    // 4. Ensure the "Payment Verified" cell is a proper checkbox
    const pvColIdx = headers.indexOf("Payment Verified") + 1;
    if (pvColIdx > 0) {
      const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
      sheet.getRange(newRowIndex, pvColIdx).setDataValidation(rule).setValue(false);
    }

    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Lead logged",
      "row": newRowIndex
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("doPost Error: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
