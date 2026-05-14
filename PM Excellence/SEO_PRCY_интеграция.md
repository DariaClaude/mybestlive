# SEO Позиции — Интеграция с PR-CY
_Последнее обновление: май 2026_

---

## Ключевые параметры

- **Google Таблица ID:** `1h0RHyamALd-giPKQOynaWreiFcv4EVFvpb3XEAFsmo8`
- **PR-CY Project ID:** `98356`
- **PR-CY Search Options ID:** `66917` (регион: Москва, Яндекс)
- **Email уведомлений:** aleksclaude@proton.me
- **Формат вкладок:** `Март(26)`, `Апрель(26)` — без пробела, год в скобках
- **Формат позиций:** `6(-3)` = позиция 6, улучшение на 3; нет в топ-100 = `100+`

---

## Конкуренты (ID в PR-CY → колонка в таблице)

| projectCompetitorId | Домен | Название в таблице |
|---------------------|-------|-------------------|
| 42494 | base-line.ru | BaseLine |
| 31803 | bim-info.ru | Айбим |
| 31804 | ibcon.ru | IBCON |
| 31633 | pmpractice.ru | Проектная практика |
| 31615 | www.pmsoft.ru | PM Soft |

---

## PR-CY API — критичные детали

**Endpoint:**
```
GET https://a.pr-cy.ru/api/v3.1.0/keywords/extended
  ?filter[projectId]=98356
  &filter[searchOptionsIds]=66917
  &filter[dateFrom]=ГГГГ-ММ-ДД  (25-е число предыдущего месяца)
  &filter[dateTo]=ГГГГ-ММ-ДД    (сегодня)
```

**Авторизация:** сессионная Cookie + заголовок `X-Csr: 1`. Cookie истекает, обновлять ежемесячно через DevTools → Network → запрос `extended` → Copy as cURL.

**Структура ответа** (критично для парсинга):
```json
{
  "keywords": [
    {
      "keyword": "управление проектами",
      "position": -1,
      "positions": [{ "date": "2026-04-29", "position": 6 }],
      "competitorsPositions": [
        { "projectCompetitorId": "42494", "position": 12 }
      ]
    }
  ]
}
```
⚠️ `item.position` всегда `-1` — не использовать. Позиция PMExcellence берётся из массива `item.positions`, последний элемент.
⚠️ ID конкурентов — поле `projectCompetitorId` (не `competitorId` и не `id`).

---

## Что делает скрипт

1. 6-го числа в 13:00 МСК — email-напоминание обновить cookie
2. После запуска `createMonthlyTab()`:
   - Создаёт новую вкладку (копия предыдущего месяца) — **первой** в списке
   - Тянет позиции из PR-CY по 44 ключам × 6 доменам
   - Считает дельты относительно предыдущего месяца
   - Отправляет письмо `✅ вкладка создана`

---

## Что делать каждый месяц (6-е число)

1. Получила письмо на aleksclaude@proton.me
2. Открыть `a.pr-cy.ru/keywords/competitors/pmexcellence.com/` → `Cmd+Option+I` → Network → запрос **extended** → **Copy as cURL**
3. В таблице: **Extensions → Apps Script** → строка `PR_CY_COOKIE:` → вставить новое значение cookie → `Cmd+S`
4. Выбрать функцию `createMonthlyTab` → **Run**
5. Вручную добавить: **Яндекс ИКС** и **Посещения за месяц**

---

## Код Apps Script

```javascript
const CFG = {
  SHEET_ID:          '1h0RHyamALd-giPKQOynaWreiFcv4EVFvpb3XEAFsmo8',
  PROJECT_ID:        '98356',
  SEARCH_OPTIONS_ID: '66917',
  NOTIFY_EMAIL:      'aleksclaude@proton.me',
  COMPETITORS: {
    '42494': 'BaseLine',
    '31803': 'Айбим',
    '31804': 'IBCON',
    '31633': 'Проектная практика',
    '31615': 'PM Soft'
  },
  // ⚠️ ОБНОВЛЯТЬ ЕЖЕМЕСЯЧНО
  PR_CY_COOKIE: 'вставить_сюда_cookie',
  PR_CY_CSRF:   '1'
};

const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                   'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

function setupTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('monthlyReminder')
    .timeBased()
    .onMonthDay(6)
    .atHour(10)
    .create();
  Logger.log('✅ Триггер установлен: 6-е число каждого месяца в 13:00 МСК');
}

function monthlyReminder() {
  const today = new Date();
  const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const tabName = MONTHS_RU[prevMonth.getMonth()] + '(' + String(prevMonth.getFullYear()).slice(-2) + ')';
  const subject = 'SEO позиции — создать вкладку "' + tabName + '"';
  const body = 'Дарья, сегодня 6-е число — время обновить SEO-позиции.\n\n' +
    '1. Открыть Apps Script таблицы (Extensions → Apps Script)\n' +
    '2. Обновить PR_CY_COOKIE:\n' +
    '   - Открыть a.pr-cy.ru/keywords/competitors/pmexcellence.com/\n' +
    '   - Cmd+Option+I → Network → запрос "extended" → Copy as cURL\n' +
    '   - Скопировать значение Cookie из cURL\n' +
    '3. Запустить функцию createMonthlyTab()';
  GmailApp.sendEmail(CFG.NOTIFY_EMAIL, subject, body);
}

function createMonthlyTab() {
  const ss = SpreadsheetApp.openById(CFG.SHEET_ID);
  const today = new Date();

  const prevMonth  = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const prev2Month = new Date(today.getFullYear(), today.getMonth() - 2, 1);

  const newTabName  = MONTHS_RU[prevMonth.getMonth()]  + '(' + String(prevMonth.getFullYear()).slice(-2) + ')';
  const prevTabName = MONTHS_RU[prev2Month.getMonth()] + '(' + String(prev2Month.getFullYear()).slice(-2) + ')';

  const prevSheet = ss.getSheetByName(prevTabName);
  if (!prevSheet) {
    GmailApp.sendEmail(CFG.NOTIFY_EMAIL, '❌ SEO скрипт: ошибка',
      'Не найдена вкладка "' + prevTabName + '". Проверь названия вкладок в таблице.');
    return;
  }

  const existing = ss.getSheetByName(newTabName);
  if (existing) ss.deleteSheet(existing);

  const newSheet = prevSheet.copyTo(ss);
  newSheet.setName(newTabName);
  ss.setActiveSheet(newSheet);
  ss.moveActiveSheet(1);

  const positions = fetchPrcyPositions(prevMonth, today);
  if (!positions) {
    GmailApp.sendEmail(CFG.NOTIFY_EMAIL, '❌ SEO скрипт: ошибка PR-CY',
      'Не удалось получить данные. Обнови PR_CY_COOKIE и запусти заново.');
    return;
  }

  const data = newSheet.getDataRange().getValues();

  for (let i = 0; i < data.length; i++) {
    const rowStr = data[i].join('|').toLowerCase();
    if (!rowStr.includes('ключевые слова') || !rowStr.includes('pmexcellence')) continue;

    const cols = detectColumns(data[i]);
    let updated = 0;

    for (let r = i + 1; r < data.length; r++) {
      const kw = String(data[r][cols.keyword] || '').trim().toLowerCase();
      if (!kw || kw.includes('яндекс') || kw.includes('посещени')) continue;

      const pos = positions[kw];
      if (!pos) continue;

      const prevRow = data[r];
      const sheetRow = r + 1;

      updateCell(newSheet, sheetRow, cols.pmexcellence, pos.pmexcellence, parsePrev(prevRow[cols.pmexcellence]));
      updateCell(newSheet, sheetRow, cols.baseline,     pos.baseline,     parsePrev(prevRow[cols.baseline]));
      updateCell(newSheet, sheetRow, cols.aibim,        pos.aibim,        parsePrev(prevRow[cols.aibim]));
      updateCell(newSheet, sheetRow, cols.ibcon,        pos.ibcon,        parsePrev(prevRow[cols.ibcon]));
      updateCell(newSheet, sheetRow, cols.pmpractice,   pos.pmpractice,   parsePrev(prevRow[cols.pmpractice]));
      updateCell(newSheet, sheetRow, cols.pmsoft,       pos.pmsoft,       parsePrev(prevRow[cols.pmsoft]));
      updated++;
    }
    Logger.log('✅ Обновлено строк: ' + updated);
  }

  SpreadsheetApp.flush();
  GmailApp.sendEmail(CFG.NOTIFY_EMAIL,
    '✅ SEO: вкладка "' + newTabName + '" создана',
    'Позиции загружены, дельты рассчитаны относительно "' + prevTabName + '".\n\nДобавь вручную:\n— Яндекс ИКС\n— Посещения за месяц');
}

function detectColumns(headerRow) {
  const cols = { keyword: 0, pmexcellence: -1, baseline: -1, aibim: -1, ibcon: -1, pmpractice: -1, pmsoft: -1 };
  headerRow.forEach((cell, c) => {
    const v = String(cell).toLowerCase();
    if (v.includes('ключев'))       cols.keyword      = c;
    if (v.includes('pmexcellence')) cols.pmexcellence = c;
    if (v.includes('baseline') || (v.includes('base') && v.includes('line'))) cols.baseline = c;
    if (v.includes('айбим'))        cols.aibim        = c;
    if (v.includes('ibcon'))        cols.ibcon        = c;
    if (v.includes('практика'))     cols.pmpractice   = c;
    if (v.includes('pm soft') || v.includes('pmsoft')) cols.pmsoft = c;
  });
  return cols;
}

function parsePrev(cell) {
  const s = String(cell || '').trim();
  if (!s || s === '-') return null;
  if (s.includes('100+') || s === '100') return 101;
  const m = s.match(/^(\d+)/);
  return m ? parseInt(m[1]) : null;
}

function updateCell(sheet, row, colIndex, pos, prevPos) {
  if (colIndex < 0) return;
  sheet.getRange(row, colIndex + 1).setValue(formatPos(pos, prevPos));
}

function formatPos(pos, prev) {
  if (pos === null || pos === undefined) return '100+';
  const display = pos > 100 ? '100+' : String(pos);
  if (prev !== null && prev !== undefined) {
    const prevNum = prev > 100 ? 101 : prev;
    const delta = pos - prevNum;
    if (delta !== 0) return display + '(' + (delta > 0 ? '+' : '') + delta + ')';
  }
  return display;
}

function fetchPrcyPositions(fromMonth, toDate) {
  try {
    const dateFrom = Utilities.formatDate(
      new Date(fromMonth.getFullYear(), fromMonth.getMonth(), 25),
      'Europe/Moscow', 'yyyy-MM-dd'
    );
    const dateTo = Utilities.formatDate(toDate, 'Europe/Moscow', 'yyyy-MM-dd');

    const url = 'https://a.pr-cy.ru/api/v3.1.0/keywords/extended' +
      '?filter%5BprojectId%5D=' + CFG.PROJECT_ID +
      '&filter%5BsearchOptionsIds%5D=' + CFG.SEARCH_OPTIONS_ID +
      '&filter%5BdateFrom%5D=' + dateFrom +
      '&filter%5BdateTo%5D=' + dateTo;

    const resp = UrlFetchApp.fetch(url, {
      headers: {
        'Cookie': CFG.PR_CY_COOKIE,
        'X-Csr':  CFG.PR_CY_CSRF,
        'Accept': 'application/vnd.api+json'
      },
      muteHttpExceptions: true
    });

    const code = resp.getResponseCode();
    const raw = resp.getContentText();
    if (code !== 200 || raw.trim().startsWith('<')) return null;

    return parsePrcyResponse(JSON.parse(raw));

  } catch(e) {
    Logger.log('Fetch error: ' + e.message);
    return null;
  }
}

function parsePrcyResponse(json) {
  const COMP_MAP = {
    '42494': 'baseline',
    '31803': 'aibim',
    '31804': 'ibcon',
    '31633': 'pmpractice',
    '31615': 'pmsoft'
  };

  const result = {};
  const items = json.keywords || json.data || [];

  items.forEach(item => {
    const kw = (item.keyword || '').trim().toLowerCase();
    if (!kw) return;

    let ownPos = null;
    if (Array.isArray(item.positions) && item.positions.length > 0) {
      const last = item.positions[item.positions.length - 1];
      ownPos = (last.position && last.position > 0) ? last.position : null;
    } else if (item.position > 0) {
      ownPos = item.position;
    }

    const entry = { pmexcellence: ownPos, baseline: null, aibim: null, ibcon: null, pmpractice: null, pmsoft: null };

    (item.competitorsPositions || []).forEach(c => {
      const key = COMP_MAP[String(c.projectCompetitorId || '')];
      if (key) entry[key] = (c.position > 0) ? c.position : null;
    });

    result[kw] = entry;
  });

  return Object.keys(result).length > 0 ? result : null;
}
```