/**
 * ГРАДЕНТА — выгрузка данных из Яндекс Метрики в Google Таблицу.
 * Таблица служит источником для публичного дашборда gradenta-dashboard.html.
 *
 * ── КАК ЗАПУСТИТЬ (один раз) ─────────────────────────────────────────────
 *   1. Откройте script.google.com → «Новый проект» → вставьте этот код целиком.
 *   2. Настройки проекта (шестерёнка) → Часовой пояс: (GMT+03:00) Москва.
 *   3. Сверху выберите функцию  setup  → нажмите «Выполнить» → выдайте доступы.
 *   4. Меню «Просмотр → Логи выполнения»: там появится ID и ссылка на таблицу.
 *      Этот ID вставьте в дашборд (константа SHEET_ID) ИЛИ откройте дашборд
 *      как  gradenta-dashboard.html?id=<ID>.
 *
 * Дальше скрипт сам обновляет данные каждый день в 08:00 по Москве.
 * Токен хранится только здесь, на стороне Google, и в дашборд не попадает.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ═══════════════════ НАСТРОЙКИ ═══════════════════
const OAUTH_TOKEN = 'y0__wgBEPvRtdoIGIaNQCDhhJiaGDCF0rXaCInAZegq2oZUmiuzGKlA5nLX3hYi';
const COUNTER_ID  = 109163509;
const SITE_NAME   = 'gradenta.info';

const HISTORY_DAYS  = 90;   // глубина истории для вкладок «Обзор» и «Источники»
const REFERRAL_DAYS = 30;   // окно для вкладки «Сайты» (рефералы)
const REFRESH_HOUR  = 8;    // час ежедневного обновления (по часовому поясу проекта)

// Цели счётчика (автоцели Метрики). Порядок = порядок колонок на вкладке «Обзор».
const GOALS = [
  { id: 560293712, name: 'Отправка формы' },
  { id: 560293714, name: 'Скачивание файла' },
  { id: 560293713, name: 'Контактные данные' },
  { id: 560293715, name: 'Отправил контактные' },
  { id: 560550192, name: 'Клик по телефону' },
];

// ═══════════════════ СЛУЖЕБНЫЕ КОНСТАНТЫ ═══════════════════
const SHEET_TITLE = 'Градента — данные Метрики';
const PROP_KEY = 'GRADENTA_SPREADSHEET_ID';
const TZ = 'Europe/Moscow';
const DAY_MS = 86400000;

// Перевод типов источников Метрики на русский
const SOURCE_RU = {
  'Direct traffic': 'Прямые заходы',
  'Search engine traffic': 'Поиск',
  'Link traffic': 'Переходы по ссылкам',
  'Internal traffic': 'Внутренние переходы',
  'Ad traffic': 'Реклама',
  'Social network traffic': 'Соцсети',
  'Messenger traffic': 'Мессенджеры',
  'Recommendation system traffic': 'Рекомендательные системы',
  'Saved page traffic': 'Сохранённые страницы',
  'Cached page traffic': 'Из кэша',
};

// ═══════════════════ ЗАПУСК ═══════════════════
function setup() {
  const ss = getOrCreateSpreadsheet_();
  refresh();
  installTrigger_();
  const id = ss.getId();
  Logger.log('══════════════════════════════════════════════════');
  Logger.log('Готово. Таблица создана, заполнена, обновление раз в сутки включено.');
  Logger.log('ID таблицы:  ' + id);
  Logger.log('Ссылка:      ' + ss.getUrl());
  Logger.log('--------------------------------------------------');
  Logger.log('Вставьте ID в дашборд (SHEET_ID) или откройте так:');
  Logger.log('gradenta-dashboard.html?id=' + id);
  Logger.log('══════════════════════════════════════════════════');
}

function getOrCreateSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty(PROP_KEY);
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) { /* пересоздадим ниже */ }
  }
  const ss = SpreadsheetApp.create(SHEET_TITLE);
  props.setProperty(PROP_KEY, ss.getId());
  // Публичный доступ на чтение — чтобы дашборд читал таблицу без авторизации.
  try {
    DriveApp.getFileById(ss.getId())
      .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {
    Logger.log('Внимание: не удалось выставить публичный доступ автоматически (' + e +
               '). Откройте таблицу и вручную: «Настройки доступа → Все, у кого есть ссылка → Читатель».');
  }
  return ss;
}

function installTrigger_() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'refresh') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('refresh').timeBased().everyDays(1).atHour(REFRESH_HOUR).create();
}

// ═══════════════════ ОБНОВЛЕНИЕ ДАННЫХ ═══════════════════
function refresh() {
  const ss = getOrCreateSpreadsheet_();
  const today = new Date();
  const dateFrom = new Date(today.getTime() - HISTORY_DAYS * DAY_MS);

  writeOverview_(ss, dateFrom, today);
  writeSources_(ss, fmt_(dateFrom), fmt_(today));
  writeReferrals_(ss);
  writeMeta_(ss);
  removeDefaultSheet_(ss);
}

function writeOverview_(ss, dateFrom, dateTo) {
  const goalMetrics = GOALS.map(function (g) { return 'ym:s:goal' + g.id + 'reaches'; });
  const metrics = [
    'ym:s:visits', 'ym:s:users', 'ym:s:pageviews',
    'ym:s:bounceRate', 'ym:s:pageDepth', 'ym:s:avgVisitDurationSeconds'
  ].concat(goalMetrics);

  const data = fetchMetrika_({
    dimensions: 'ym:s:date',
    metrics: metrics.join(','),
    date1: fmt_(dateFrom), date2: fmt_(dateTo),
    sort: 'ym:s:date', limit: 100000
  });

  const byDate = {};
  (data.data || []).forEach(function (r) { byDate[r.dimensions[0].name] = r.metrics; });

  const header = ['Дата', 'Визиты', 'Посетители', 'Просмотры', 'Отказы %', 'Глубина', 'Время, сек']
    .concat(GOALS.map(function (g) { return g.name; }));
  const rows = [header];

  // Полный непрерывный ряд дат (нулевые дни тоже пишем — чтобы график был сплошным).
  for (var t = dateFrom.getTime(); t <= dateTo.getTime(); t += DAY_MS) {
    var ds = fmt_(new Date(t));
    var m = byDate[ds];
    if (m) {
      rows.push([ds, r0(m[0]), r0(m[1]), r0(m[2]), r1(m[3]), r2(m[4]), r0(m[5])]
        .concat(GOALS.map(function (g, i) { return r0(m[6 + i]); })));
    } else {
      rows.push([ds, 0, 0, 0, 0, 0, 0].concat(GOALS.map(function () { return 0; })));
    }
  }
  writeSheet_(ss, 'Обзор', rows, 1);
}

function writeSources_(ss, d1, d2) {
  const data = fetchMetrika_({
    dimensions: 'ym:s:date,ym:s:lastsignTrafficSource',
    metrics: 'ym:s:visits,ym:s:users,ym:s:goal' + GOALS[0].id + 'reaches',
    date1: d1, date2: d2, sort: 'ym:s:date', limit: 100000
  });

  const rows = [['Дата', 'Источник', 'Визиты', 'Посетители', 'Формы']];
  (data.data || []).forEach(function (r) {
    var srcEn = r.dimensions[1].name;
    var srcRu = SOURCE_RU[srcEn] || srcEn;
    rows.push([r.dimensions[0].name, srcRu, r0(r.metrics[0]), r0(r.metrics[1]), r0(r.metrics[2])]);
  });
  writeSheet_(ss, 'Источники', rows, 1);
}

function writeReferrals_(ss) {
  const today = new Date();
  const data = fetchMetrika_({
    preset: 'sources_sites',
    date1: fmt_(new Date(today.getTime() - REFERRAL_DAYS * DAY_MS)),
    date2: fmt_(today),
    sort: '-ym:s:visits', limit: 50
  });

  const rows = [['Сайт', 'Визиты']];
  (data.data || []).forEach(function (r) {
    rows.push([r.dimensions[0].name, r0(r.metrics[0])]);
  });
  if (rows.length === 1) rows.push(['— нет реферального трафика за период —', 0]);
  writeSheet_(ss, 'Сайты', rows, 0);
}

function writeMeta_(ss) {
  const now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm');
  const rows = [
    ['Ключ', 'Значение'],
    ['Обновлено', now + ' МСК'],
    ['Счётчик', String(COUNTER_ID)],
    ['Сайт', SITE_NAME],
    ['История, дней', String(HISTORY_DAYS)],
    ['Окно рефералов, дней', String(REFERRAL_DAYS)],
  ];
  writeSheet_(ss, 'Мета', rows, 0);
}

// ═══════════════════ УТИЛИТЫ ═══════════════════
function writeSheet_(ss, name, rows, textColCount) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  sh.clear();

  var numRows = rows.length, numCols = rows[0].length;
  // Первые textColCount колонок — как текст (чтобы даты не превращались в числа-даты).
  if (textColCount > 0) sh.getRange(1, 1, numRows, textColCount).setNumberFormat('@');
  sh.getRange(1, 1, numRows, numCols).setValues(rows);
  sh.getRange(1, 1, 1, numCols).setFontWeight('bold');
  sh.setFrozenRows(1);
}

function removeDefaultSheet_(ss) {
  var defaults = ['Sheet1', 'Лист1', 'Лист 1'];
  ss.getSheets().forEach(function (sh) {
    if (defaults.indexOf(sh.getName()) !== -1 && ss.getSheets().length > 1) {
      ss.deleteSheet(sh);
    }
  });
}

function fetchMetrika_(params) {
  var url = 'https://api-metrika.yandex.net/stat/v1/data?ids=' + COUNTER_ID + '&accuracy=full';
  Object.keys(params).forEach(function (k) {
    url += '&' + k + '=' + encodeURIComponent(params[k]);
  });
  var resp = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { 'Authorization': 'OAuth ' + OAUTH_TOKEN },
    muteHttpExceptions: true
  });
  var code = resp.getResponseCode();
  var text = resp.getContentText();
  if (code !== 200) throw new Error('Метрика API вернула ' + code + ': ' + text);
  return JSON.parse(text);
}

function fmt_(d) { return Utilities.formatDate(d, TZ, 'yyyy-MM-dd'); }
function r0(x) { return Math.round(Number(x) || 0); }
function r1(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function r2(x) { return Math.round((Number(x) || 0) * 100) / 100; }
