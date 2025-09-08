function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.sheet;
    const row = data.row;

    const ss = SpreadsheetApp.openById("1RW7HE717IvzKgbPNzRtxZKnB6ZsUqPgM9pCOFV1g-rg");
    const sheet = ss.getSheetByName(sheetName);
    sheet.appendRow(row);

    // Update summary after adding the row
    updateSummary(ss);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateSummary(ss) {
  const sessionsSheet = ss.getSheetByName("Sessions");
  const shuttleSheet = ss.getSheetByName("Shuttles");
  const summarySheet = ss.getSheetByName("Summary");

  // Clear old summary but keep headers
  const lastRow = summarySheet.getLastRow();
  if (lastRow > 1) {
    summarySheet.getRange(2, 1, lastRow - 1, 8).clearContent(); // now 8 columns
  }

  const players = ["Anil", "Viswa", "Venkat", "Ravi", "Yaswanth", "Abyson", "Satya Vinay", "Manoj", "Rohit", "Suresh", "Sailesh", "Chandra", "Abhishek", "Naveen", "Akshay", "Satya", "Puneeth","Uchit","Mazar","Rajesh", "Satish", "Pavan", "Prasad","Praveen"];

  const summary = {};
  players.forEach(p => {
    summary[p] = {
      sessionsAttended: 0,
      sessionsPaid: 0,
      shuttlePaid: 0,
      totalPaid: 0,
      totalShare: 0,
      shuttlesShare: 0,
      balance: 0
    };
  });

  // --- Process Sessions (for court fee + attendance + shuttleshare base) ---
  const sessionsData = sessionsSheet.getDataRange().getValues();
  for (let i = 1; i < sessionsData.length; i++) {
    const row = sessionsData[i];
    const courts = Number(row[1]) || 0;
    const bookingFee = Number(row[2]) || 0;
    const paidBy = row[3];
    const attendees = row[4] ? row[4].split(",").map(s => s.trim()) : [];

    if (attendees.length === 0) continue;

    const splitFee = bookingFee / attendees.length;

    // session fee paid by payer
    if (summary[paidBy]) summary[paidBy].sessionsPaid += bookingFee;

    attendees.forEach(player => {
      if (summary[player]) {
        summary[player].totalShare += splitFee;
        summary[player].sessionsAttended += 1;

        // 🚀 add shuttle share: £2 × courts / attendees
        const shuttleExtra = (2 * courts) / attendees.length;
        summary[player].shuttlesShare += shuttleExtra;
      }
    });
  }

  // --- Process Shuttle expenses (only track who paid, no splitting now) ---
  const shuttleData = shuttleSheet.getDataRange().getValues();
  for (let i = 1; i < shuttleData.length; i++) {
    const row = shuttleData[i];
    const amount = Number(row[1]) || 0;
    const paidBy = row[2];

    if (summary[paidBy]) summary[paidBy].shuttlePaid += amount;
  }

  // --- Final calculations ---
  players.forEach(player => {
    const s = summary[player];
    s.totalPaid = s.sessionsPaid + s.shuttlePaid;
    s.balance = s.totalPaid - s.totalShare - s.shuttlesShare;
  });

  // --- Write back to Summary sheet ---
  let output = [];
  players.forEach(player => {
    const s = summary[player];
    output.push([
      player,
      s.sessionsAttended,
      s.sessionsPaid.toFixed(2),
      s.shuttlePaid.toFixed(2),
      s.totalPaid.toFixed(2),
      s.totalShare.toFixed(2),
      s.shuttlesShare.toFixed(2),   // ✅ new column
      s.balance.toFixed(2),
    ]);
  });

  summarySheet.getRange(2, 1, output.length, 8).setValues(output); // now 8 columns
}

function doGet(e) {
  var ss = SpreadsheetApp.openById("1RW7HE717IvzKgbPNzRtxZKnB6ZsUqPgM9pCOFV1g-rg");
  var sheetName = e.parameter.sheet;
  var sheet = ss.getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();

  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ data: data }));
  return output;
}
