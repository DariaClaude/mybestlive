// ═══════════════════════════════════════════════════════════
// РМ Групп — War Room Data API
// Вставь этот скрипт в любую из таблиц:
//   Расширения → Apps Script → вставить код → Сохранить
//   Запустить → Развернуть → Новое развёртывание → Тип: Веб-приложение
//   Кто имеет доступ: Все → Развернуть → скопировать URL
//   Вставить URL в war-room.html в переменную SCRIPT_URL
// ═══════════════════════════════════════════════════════════

var AVITO_ID   = '1D_sbEPzHKgEpiZwQwJv6cE7Ug7rcrL5RUZNS9I6ukhA';
var SOCIAL_ID  = '1fZPv3IkPtYVIZENX9Xn3SIwyML_JDNH6CUHFJNREWN4';
var BUY_ID     = '1bSk7zWUTzApkDIvOkeEGuj31NTAdHcGtHuVkyIk-QKk';
var VKYULA_ID  = '1Bmn-LhC_QFnRW_84O1vexJkgMlRm1uQV7wNTJ-WD9Mo';

function doGet(e) {
  var result = {};
  try { result.avito  = getAvitoData();  } catch(ex) { result.avito_err  = ex.message; }
  try { result.social = getSocialData(); } catch(ex) { result.social_err = ex.message; }
  try { result.vkyula = getVKYulaData(); } catch(ex) { result.vkyula_err = ex.message; }
  try { result.buy    = getBuyData();    } catch(ex) { result.buy_err    = ex.message; }
  result.updated = Utilities.formatDate(new Date(), 'Europe/Moscow', 'dd.MM.yyyy HH:mm');
  var out = ContentService.createTextOutput(JSON.stringify(result));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}

// ── АВИТО ────────────────────────────────────────────────────────────
function getAvitoData() {
  var ss = SpreadsheetApp.openById(AVITO_ID);
  var sheets = ss.getSheets();
  var data = { weeks: [], urban_diksi: null };

  for (var s = 0; s < sheets.length; s++) {
    var sheet = sheets[s];
    var vals = sheet.getDataRange().getValues();

    for (var r = 0; r < vals.length; r++) {
      var row = vals[r];
      // Ищем заголовок таблицы с "Лиды с"
      if (row[1] && String(row[1]).indexOf('Лиды с') === 0 && String(row[2]).indexOf('Лиды с') === 0) {
        var label1 = String(row[1]); // "Лиды с X по Y/План"
        var label2 = String(row[2]); // "Лиды с X по Y/Факт"
        var weekLabel = label1.replace('Лиды с ', '').replace('/План', '').trim();
        var projects_done = [], projects_lag = [];
        var totalLeads = 0, totalBudget = 0, cplSum = 0, cplCount = 0;

        // Читаем строки проектов
        for (var pr = r + 1; pr < vals.length && pr < r + 25; pr++) {
          var prow = vals[pr];
          if (!prow[0] || String(prow[0]).trim() === '') break;
          var name = String(prow[0]).trim();
          if (name === 'Регион') continue;
          var plan = parseNum(prow[1]);
          var fact = parseNum(prow[2]);
          var cpl  = parseNum(prow[5]);
          var bud  = parseNum(prow[8]);
          if (fact > 0) {
            totalLeads  += fact;
            totalBudget += bud;
            if (cpl > 0) { cplSum += cpl; cplCount++; }
            var pct = plan > 0 ? Math.round(fact / plan * 100) : 100;
            var proj = { name: name, fact: fact, plan: plan, cpl: cpl, budget: bud, pct: pct };
            if (plan > 0 && pct < 100) projects_lag.push(proj);
            else projects_done.push(proj);
          }
        }

        if (totalLeads > 0) {
          data.weeks.push({
            label: weekLabel,
            leads: totalLeads,
            budget: Math.round(totalBudget),
            cpl: cplCount > 0 ? Math.round(cplSum / cplCount) : 0,
            done: projects_done,
            lag: projects_lag
          });
        }
      }

      // Ищем УРБАН ДИКСИ
      if (row[0] && String(row[0]).indexOf('УРБАН ДИКСИ') >= 0 && parseNum(row[1]) > 0) {
        data.urban_diksi = {
          leads: parseNum(row[1]),
          cpl: parseNum(row[2]),
          budget: parseNum(row[3]),
          adapted: parseNum(row[4]),
          conversion: parseNum(row[5])
        };
      }
    }
  }

  // Берём последние 3 недели
  data.weeks = data.weeks.slice(-3);
  return data;
}

// ── СОЦСЕТИ ─────────────────────────────────────────────────────────
function getSocialData() {
  var ss = SpreadsheetApp.openById(SOCIAL_ID);
  var sheet = ss.getSheets()[0];
  var vals = sheet.getDataRange().getValues();
  var result = { weeks: [] };

  for (var r = 0; r < vals.length; r++) {
    var row = vals[r];
    // Ищем строку "Подписчики на начало"
    if (String(row[0]).indexOf('Подписчики на начало') >= 0) {
      // Заголовки в предыдущей строке
      var headers = r > 0 ? vals[r - 1] : [];
      var weeks = [];
      for (var c = 1; c < headers.length; c++) {
        if (headers[c] && String(headers[c]).indexOf('/') > 0) {
          weeks.push({ period: String(headers[c]), col: c });
        }
      }

      // Читаем метрики для каждой платформы
      var metrics = {};
      for (var mr = r; mr < Math.min(r + 10, vals.length); mr++) {
        var mrow = vals[mr];
        var metricName = String(mrow[0]).trim();
        for (var w = 0; w < weeks.length; w++) {
          var col = weeks[w].col;
          if (!metrics[weeks[w].period]) metrics[weeks[w].period] = {};
          metrics[weeks[w].period][metricName] = mrow[col];
        }
      }

      // Форматируем
      for (var wp in metrics) {
        var m = metrics[wp];
        result.weeks.push({
          period: wp,
          vk_start:  parseNum(m['Подписчики на начало месяца/недели'] || m['Подписчики на начало недели']),
          vk_end:    parseNum(m['Подписчики на конец месяца/недели']  || m['Подписчики на конец недели']),
          reach:     parseNum(m['Охват']),
          impressions: parseNum(m['Показы']),
          er:        parseNum(m['Вовлеченность'])
        });
      }
      break;
    }
  }
  return result;
}

// ── ВК + ЮЛА ─────────────────────────────────────────────────────────
function getVKYulaData() {
  var ss = SpreadsheetApp.openById(VKYULA_ID);
  var sheet = ss.getSheets()[0];
  var vals = sheet.getDataRange().getValues();

  // Считаем лиды по каналам за последние 14 дней
  var now = new Date();
  var cutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  var vk = 0, yula = 0, other = 0;

  for (var r = 0; r < vals.length; r++) {
    var row = vals[r];
    // Ищем дату в одной из колонок
    var dateCell = null;
    for (var c = 0; c < row.length; c++) {
      if (row[c] instanceof Date) { dateCell = row[c]; break; }
      if (typeof row[c] === 'string') {
        var m = row[c].match(/(\d{2})\.(\d{2})\.(\d{2,4})/);
        if (m) {
          var yr = parseInt(m[3]); if (yr < 100) yr += 2000;
          dateCell = new Date(yr, parseInt(m[2])-1, parseInt(m[1]));
          break;
        }
      }
    }
    if (!dateCell || dateCell < cutoff) continue;

    // Определяем канал
    var rowStr = row.join(' ');
    if (rowStr.indexOf('ВК') >= 0) vk++;
    else if (rowStr.toLowerCase().indexOf('юла') >= 0) yula++;
  }

  return { vk: vk, yula: yula, total: vk + yula, period: '14 дней' };
}

// ── ЗАКУП ────────────────────────────────────────────────────────────
function getBuyData() {
  var ss = SpreadsheetApp.openById(BUY_ID);
  var sheet = ss.getSheets()[0];
  var vals = sheet.getDataRange().getValues();
  var channels = [];
  var totalTracked = 0;

  for (var r = 1; r < vals.length; r++) {
    var row = vals[r];
    if (!row[0] || String(row[0]).trim() === '') continue;
    var leads = 0;
    // Ищем числовые значения в последних колонках (лиды)
    for (var c = vals[0].length - 1; c >= vals[0].length - 5 && c >= 0; c--) {
      var v = parseNum(row[c]);
      if (v > 0) { leads += v; break; }
    }
    if (leads > 0) {
      var name = String(row[2] || row[0]).replace(/https?:\/\/[^\s]+/g, '').trim();
      if (name.length > 40) name = name.substring(0, 40) + '…';
      channels.push({ name: name, leads: leads, date: String(row[1] || '') });
      totalTracked += leads;
    }
  }

  return { channels: channels.slice(-10), total: totalTracked };
}

// ── HELPER ──────────────────────────────────────────────────────────
function parseNum(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return isNaN(v) ? 0 : Math.round(v);
  var s = String(v).replace(/[^\d.,]/g, '').replace(',', '.');
  var n = parseFloat(s);
  return isNaN(n) ? 0 : Math.round(n);
}
