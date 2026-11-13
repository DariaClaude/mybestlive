/**
 * Приём заявок с лендингов вакансий → таблица «Отклики с лендингов вакансий», вкладка «Отклики».
 * Резервный канал к Vercel (vercel.app из части сетей РФ недоступен). Формат строки — тот же.
 *
 * Установка (2 минуты):
 * 1. Открыть таблицу https://docs.google.com/spreadsheets/d/1ZY6AIfS0ahW0IWrOIDr0pLlOA3aAgYgUeg4cwr27Wxo
 *    → Расширения → Apps Script → удалить содержимое, вставить этот файл целиком → сохранить (значок дискеты).
 * 2. Развернуть → Новое развёртывание → тип «Веб-приложение»:
 *    Выполнять от имени: «Я»; У кого есть доступ: «Все» → Развернуть → разрешить доступ → скопировать URL вида
 *    https://script.google.com/macros/s/AKfycb.../exec
 * 3. Прислать URL — он встанет первым каналом отправки на всех лендингах.
 * Проверка: открыть URL в браузере → {"ok":true,"sheet":"Отклики"}.
 */
var SHEET_NAME = 'Отклики';

function doGet(e) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  return json_({ ok: !!sh, sheet: SHEET_NAME });
}

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true });
    var phone = normalizePhone_(p.phone || '');
    if (phone.length !== 11) return json_({ ok: false, error: 'bad_phone' });
    var lock = LockService.getScriptLock(); lock.waitLock(10000);
    try {
      var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      if (!sh) return json_({ ok: false, error: 'no_sheet' });
      sh.appendRow([
        Utilities.formatDate(new Date(), 'Europe/Moscow', 'dd.MM.yyyy HH:mm'),
        clean_(p.region, 40) || '—',
        clean_(p.name, 80) || '—',
        formatPhone_(phone),
        clean_(p.vacancy, 120) || '—',
        clean_(p.page, 200),
        'Сайт',
        clean_(p.utm, 300),
        '', ''
      ]);
    } finally { lock.releaseLock(); }
    return json_({ ok: true });
  } catch (err) { return json_({ ok: false, error: String(err) }); }
}

function normalizePhone_(s) { var d = String(s).replace(/\D/g, ''); if (d.length === 10) d = '7' + d; if (d.length === 11 && d.charAt(0) === '8') d = '7' + d.slice(1); return d; }
function formatPhone_(d) { return d.charAt(0) + ' ' + d.substr(1, 3) + ' ' + d.substr(4, 3) + '-' + d.substr(7, 2) + '-' + d.substr(9, 2); }
function clean_(s, max) { return String(s || '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max); }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
