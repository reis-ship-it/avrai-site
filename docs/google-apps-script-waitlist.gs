const SHEET_NAME = "Waitlist";
const HEADERS = [
  "Timestamp",
  "Name",
  "Email",
  "City",
  "Interest",
  "Notes",
  "Source",
  "User Agent",
];

function doGet() {
  return jsonResponse({ ok: true, service: "avrai-waitlist" });
}

function doPost(e) {
  const params = e && e.parameter ? e.parameter : {};
  const honeypot = String(params._honey || "").trim();

  if (honeypot) {
    return jsonResponse({ ok: true, ignored: true });
  }

  const sheet = getWaitlistSheet();

  sheet.appendRow([
    new Date(),
    String(params.name || ""),
    String(params.email || "").trim().toLowerCase(),
    String(params.city || ""),
    String(params.interest || ""),
    String(params.notes || ""),
    String(params.source || "avrai.org"),
    String(params.userAgent || ""),
  ]);

  return jsonResponse({ ok: true });
}

function getWaitlistSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
