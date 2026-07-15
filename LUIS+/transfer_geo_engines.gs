/**
 * Перенос РЕАЛЬНЫХ per-engine GEO-позиций из вкладки "GEO" в основную таблицу.
 * Лист "Июнь 2026" gid=75367906. Источник: вкладка GEO (ручной раздельный замер
 * ChatGPT/Gemini/Perplexity), правый блок "Июнь 2026". Перенесено 11 ключей,
 * по которым есть совпадение с основной таблицей И есть данные.
 *
 * Целевые колонки (6 брендов: LUIS+ Луис+ LTV LPA ЛПТ ЛКД на движок):
 *   ChatGPT    K-P  (11-16)
 *   Gemini     R-W  (18-23)
 *   Perplexity Y-AD (25-30)
 * Заменяет GEO-блок этих 11 строк реальными значениями (с разбросом по движкам).
 * Числа — светло-зелёная заливка; "-" очищает фон. Запуск: ▶ transferGeo.
 */

var SPREADSHEET_ID = '16GXxvAtU4JnG9OxYRpTXkYxSKgwGbp1chMH87rHx8YA';
var SHEET_GID      = 75367906;
var GREEN          = '#d9ead3';

var CG = 11;  // K — ChatGPT LUIS+
var GM = 18;  // R — Gemini  LUIS+
var PP = 25;  // Y — Perplexity LUIS+

// row -> {cg:[6], gm:[6], pp:[6]}  порядок брендов: LUIS+,Луис+,LTV,LPA,ЛПТ,ЛКД
var DATA = {
  6: {cg:["-",2,"-","-","-","-"], gm:["-","-","-","-","-","-"], pp:["-","-","-","-","-","-"]},
  27: {cg:["-","-","-","-","-","-"], gm:[4,"-","-","-","-","-"], pp:["-","-","-","-","-","-"]},
  44: {cg:[3,"-","-","-","-","-"], gm:[3,"-","-","-","-","-"], pp:["-","-","-","-","-","-"]},
  45: {cg:[5,4,"-","-","-","-"], gm:[4,"-","-","-","-","-"], pp:["-","-","-","-","-","-"]},
  52: {cg:["-","-","-","-","-","-"], gm:[2,"-","-","-","-","-"], pp:["-","-","-","-","-","-"]},
  59: {cg:[3,"-","-","-","-","-"], gm:[3,"-","-","-","-","-"], pp:["-","-","-","-","-","-"]},
  118: {cg:["-","-","-","-","-","-"], gm:[4,"-","-","-","-","-"], pp:["-","-","-","-","-","-"]},
  126: {cg:["-","-","-","-","-","-"], gm:[5,"-","-","-","-","-"], pp:["-","-","-","-","-","-"]},
  132: {cg:["-","-","-","-","-","-"], gm:[3,"-","-","-","-","-"], pp:["-","-","-","-","-","-"]},
  173: {cg:[4,"-","-","-","-","-"], gm:[3,"-","-","-","-","-"], pp:["-","-","-","-","-","-"]},
  185: {cg:[5,"-","-","-","-","-"], gm:["-","-","-","-","-","-"], pp:["-","-","-","-","-","-"]}
};

function transferGeo() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheets().filter(function (s) { return s.getSheetId() == SHEET_GID; })[0];
  if (!sheet) { Logger.log('Лист не найден'); return; }

  var green = function (v) { return (typeof v === 'number') ? GREEN : null; };
  var put = function (row, col, vals) {
    var rng = sheet.getRange(row, col, 1, 6);
    rng.setValues([vals]);
    rng.setBackgrounds([vals.map(green)]);
  };

  var n = 0, pos = 0;
  Object.keys(DATA).forEach(function (r) {
    var row = parseInt(r, 10), d = DATA[r];
    put(row, CG, d.cg);
    put(row, GM, d.gm);
    put(row, PP, d.pp);
    n++;
    [d.cg, d.gm, d.pp].forEach(function (a) { a.forEach(function (v) { if (typeof v === 'number') pos++; }); });
  });

  SpreadsheetApp.flush();
  Logger.log('=== Перенос готов. Строк: ' + n + ' | числовых позиций: ' + pos + ' ===');
}
