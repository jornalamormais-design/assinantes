/**
 * API para o site de gestão de assinantes.
 * Liga-se à folha "Assinantes" desta Google Sheet.
 */

var COLS = {
  ano2025: 3, ano2026: 4, ano2027: 5, carimbo: 6, numero: 7, nome: 8,
  morada: 9, localidade: 10, codigoPostal: 11, nascimento: 12, contacto: 13,
  email: 14, nif: 15, termo: 16, dataPagamento: 17, modo: 18, notas: 19, ativo: 20,
  modo2025: 21, modo2026: 22, modo2027: 23
};
var FIRST_DATA_ROW = 3;
var NUM_COLS = 21; // colunas 3 a 23 (23 - 3 + 1)

function doGet(e) {
  return respond_({ ok: true, subscribers: listSubscribers_() });
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var result;
    if (action === 'update') {
      result = updateSubscriber_(payload.rowIndex, payload.data);
    } else if (action === 'add') {
      result = addSubscriber_(payload.data);
    } else {
      throw new Error('Ação desconhecida: ' + action);
    }
    return respond_({ ok: true, subscriber: result });
  } catch (err) {
    return respond_({ ok: false, error: err.message });
  }
}

function respond_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Assinantes') || ss.getSheets()[0];
  ensureAtivoHeader_(sheet);
  return sheet;
}

function ensureAtivoHeader_(sheet) {
  var header = sheet.getRange(1, COLS.ativo).getValue();
  if (!header) {
    sheet.getRange(1, COLS.ativo).setValue('Ativo');
  }
  var modoHeaders = { modo2025: 'Método 2025', modo2026: 'Método 2026', modo2027: 'Método 2027' };
  Object.keys(modoHeaders).forEach(function (key) {
    var cell = sheet.getRange(1, COLS[key]);
    if (!cell.getValue()) cell.setValue(modoHeaders[key]);
  });
}

function listSubscribers_() {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < FIRST_DATA_ROW) return [];
  var numRows = lastRow - FIRST_DATA_ROW + 1;
  var values = sheet.getRange(FIRST_DATA_ROW, 3, numRows, NUM_COLS).getValues();
  var list = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var numero = row[COLS.numero - 3];
    var nome = row[COLS.nome - 3];
    if (!numero && !nome) continue;
    var obj = { rowIndex: FIRST_DATA_ROW + i };
    Object.keys(COLS).forEach(function (key) {
      var v = row[COLS[key] - 3];
      obj[key] = (v instanceof Date) ? Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd') : v;
    });
    list.push(obj);
  }
  return list;
}

function updateSubscriber_(rowIndex, data) {
  var sheet = getSheet_();
  rowIndex = parseInt(rowIndex, 10);
  Object.keys(data).forEach(function (key) {
    if (COLS[key]) {
      sheet.getRange(rowIndex, COLS[key]).setValue(data[key]);
    }
  });
  return listOne_(sheet, rowIndex);
}

function addSubscriber_(data) {
  var sheet = getSheet_();
  var newRow = sheet.getLastRow() + 1;
  sheet.getRange(newRow, COLS.carimbo).setValue(new Date());
  Object.keys(data).forEach(function (key) {
    if (COLS[key]) {
      sheet.getRange(newRow, COLS[key]).setValue(data[key]);
    }
  });
  return listOne_(sheet, newRow);
}

function listOne_(sheet, rowIndex) {
  var range = sheet.getRange(rowIndex, 3, 1, NUM_COLS).getValues()[0];
  var obj = { rowIndex: rowIndex };
  Object.keys(COLS).forEach(function (key) {
    var v = range[COLS[key] - 3];
    obj[key] = (v instanceof Date) ? Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd') : v;
  });
  return obj;
}
