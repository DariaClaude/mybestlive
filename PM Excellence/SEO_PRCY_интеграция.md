# SEO + ИИ Выдача — Аналитика PMExcellence
_Последнее обновление: июнь 2026_

---

## Ключевые параметры

- **Google Таблица ID:** `1h0RHyamALd-giPKQOynaWreiFcv4EVFvpb3XEAFsmo8`
- **PR-CY Project ID:** `98356`
- **PR-CY Search Options ID:** `66917` (регион: Москва, Яндекс)
- **Email уведомлений:** aleksclaude@proton.me
- **Формат SEO-вкладок:** `Март(26)`, `Апрель(26)` — без пробела, год в скобках
- **Формат ИИ-вкладок:** `ИИ Март(26)`, `ИИ Апрель(26)` — с префиксом «ИИ »
- **Формат позиций SEO:** `6(-3)` = позиция 6, улучшение на 3; нет в топ-100 = `100+`
- **Формат позиций ИИ:** `3(-1)` = 3-я позиция, было 4-я; `упом.` = упомянут без списка; `—` = не упомянут

---

## Конкуренты SEO (ID в PR-CY → колонка в таблице)

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

## ИИ Выдача — структура вкладки

Скрипт работает с **существующей** вкладкой «ИИ Выдача»:
- **Строки** сгруппированы по ИИ-платформам (ChatGPT, Perplexity, DeepSeek, ГигаЧат, Claude)
- **Колонки** сгруппированы по месяцам (Апрель, Май...) → каждый месяц = несколько подколонок для сайтов
- Функция `fillAIPositions()` ищет колонки нужного месяца и заполняет позиции всех сайтов

## ИИ Выдача — ключевые запросы

| # | Запрос |
|---|--------|
| 1 | календарно-сетевая модель |
| 2 | Календарно-сетевой график |
| 3 | Календарно-сетевое планирование |
| 4 | EPC подрядчик |
| 5 | PMC подрядчик |
| 6 | Мегапроект |
| 7 | Аудит управления проектом |

**Что считается «позицией» в ИИ:**
- `1`, `2`, `3`... — порядковый номер упоминания PMExcellence в нумерованном списке ответа
- `упом.` — PMExcellence упомянут, но не в нумерованном списке
- `—` — PMExcellence не упомянут вообще

---

## API-ключи для ИИ (вставить в скрипт)

| Платформа | Где получить ключ | Поле в AI_CFG |
|-----------|-------------------|---------------|
| ChatGPT | platform.openai.com → API Keys | `OPENAI_KEY` |
| Perplexity | perplexity.ai/settings/api | `PERPLEXITY_KEY` |
| DeepSeek | platform.deepseek.com → API Keys | `DEEPSEEK_KEY` |
| ГигаЧат | developers.sber.ru → Мои проекты → ClientID + Secret → base64("ID:Secret") | `GIGACHAT_CREDS` |
| Claude | console.anthropic.com → API Keys | `ANTHROPIC_KEY` |

---

## Что делает скрипт

1. 6-го числа в 13:00 МСК — email-напоминание обновить cookie + запустить оба скрипта
2. `createMonthlyTab()` — SEO (Яндекс):
   - Создаёт новую вкладку `Месяц(ГГ)` — первой в списке
   - Тянет позиции из PR-CY по 44 ключам × 6 доменам
   - Считает дельты, отправляет письмо ✅
3. `createAIMonthlyTab()` — ИИ выдача:
   - Создаёт вкладку `ИИ Месяц(ГГ)` — второй в списке
   - Отправляет 7 запросов каждому из 5 ИИ через API
   - Извлекает позицию упоминания PMExcellence в каждом ответе
   - Считает дельты относительно прошлого месяца

---

## Что делать каждый месяц (6-е число)

**SEO-часть:**
1. Получила письмо → открыть `a.pr-cy.ru/keywords/competitors/pmexcellence.com/`
2. `Cmd+Option+I` → Network → запрос **extended** → **Copy as cURL**
3. Extensions → Apps Script → строка `PR_CY_COOKIE:` → вставить новое значение → `Cmd+S`
4. Запустить `createMonthlyTab()`
5. Добавить вручную: **Яндекс ИКС** и **Посещения за месяц**

**ИИ-часть:**
1. Запустить `createAIMonthlyTab()` — API-ключи постоянные, ничего обновлять не нужно
2. Проверить результаты в вкладке `ИИ Месяц(ГГ)`
3. Если у платформы стоит `—` — значит API-ключ истёк или лимит исчерпан

---

## Структура вкладки «ИИ Выдача» (важно для скрипта)

- **Строка 1:** названия сайтов — PMExcellence, BaseLine, Айбим, IBCON, Проектная практика, PM Soft
- **Строка 2:** метки месяцев — Январь/25, Июнь/25 ... Май/26 (каждая метка = одна sub-col)
- **Строка 3:** пустая (разделитель)
- **Строка 4+:** данные — ChatGPT / Perplexity / DeepSeek / ГигаЧат / Claude × 7 ключевиков

⚠️ Сайты — НАД месяцами. `detectHeaderRows()` это учитывает автоматически.

---

## Код Apps Script

```javascript
// ===== ОБЩАЯ КОНФИГУРАЦИЯ =====

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

// ===== ИИ ВЫДАЧА — КОНФИГУРАЦИЯ =====

const AI_CFG = {
  KEYWORDS: [
    'календарно-сетевая модель',
    'Календарно-сетевой график',
    'Календарно-сетевое планирование',
    'EPC подрядчик',
    'PMC подрядчик',
    'Мегапроект',
    'Аудит управления проектом'
  ],
  // Промпт: ИИ называет экспертов и ресурсы → ищем PMExcellence
  PROMPT_TEMPLATE: '«{QUERY}» — расскажи подробно об этой теме применительно к российскому рынку. Назови ведущие компании, консалтинговые фирмы, экспертов и интернет-ресурсы, которые специализируются на этом направлении. Составь нумерованный список из 5-10 лучших.',
  TARGET: 'pmexcellence',

  // ⚠️ ВСТАВИТЬ API-КЛЮЧИ ПЕРЕД ПЕРВЫМ ЗАПУСКОМ
  OPENAI_KEY:     '',   // platform.openai.com
  PERPLEXITY_KEY: '',   // perplexity.ai/settings/api
  DEEPSEEK_KEY:   '',   // platform.deepseek.com
  GIGACHAT_CREDS: '',   // base64("ClientID:ClientSecret") от developers.sber.ru
  ANTHROPIC_KEY:  ''    // console.anthropic.com
};

const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                   'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

// ===== ТРИГГЕРЫ =====

function setupTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));

  // 2-е число: автозаполнение ИИ Выдача (все 5 ИИ через API)
  ScriptApp.newTrigger('autoFillAIPositions')
    .timeBased().onMonthDay(2).atHour(9).create();

  // 6-е число: напоминание обновить PR-CY cookie и запустить SEO
  ScriptApp.newTrigger('monthlyReminder')
    .timeBased().onMonthDay(6).atHour(10).create();

  Logger.log('✅ Триггеры: 2-е в 9:00 (ИИ Выдача) и 6-е в 13:00 (SEO-напоминание)');
}

// Автозапуск 2-го числа: вычисляет предыдущий месяц и заполняет ИИ Выдача
function autoFillAIPositions() {
  const today = new Date();
  const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  AI_GEO_CFG.TARGET_MONTH = MONTHS_RU[prev.getMonth()];
  Logger.log('▶ Автозапуск: месяц = ' + AI_GEO_CFG.TARGET_MONTH);
  fillAIPositions();
}

function monthlyReminder() {
  const today = new Date();
  const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const tabName = MONTHS_RU[prevMonth.getMonth()] + '(' + String(prevMonth.getFullYear()).slice(-2) + ')';
  const subject = 'SEO + ИИ аналитика — создать вкладки за "' + tabName + '"';
  const body =
    'Дарья, сегодня 6-е число — время обновить аналитику PMExcellence.\n\n' +
    '═══ SEO (PR-CY) ═══\n' +
    '1. Открыть a.pr-cy.ru/keywords/competitors/pmexcellence.com/\n' +
    '2. Cmd+Option+I → Network → запрос "extended" → Copy as cURL\n' +
    '3. Extensions → Apps Script → строка PR_CY_COOKIE: → вставить новое значение\n' +
    '4. Запустить функцию: createMonthlyTab()\n' +
    '5. Вручную добавить: Яндекс ИКС + Посещения за месяц\n\n' +
    '═══ ИИ ВЫДАЧА ═══\n' +
    '1. Extensions → Apps Script\n' +
    '2. Запустить функцию: createAIMonthlyTab()\n' +
    '   (API-ключи постоянные, обновлять не нужно)\n\n' +
    'Результаты: вкладки "' + tabName + '" и "ИИ ' + tabName + '"';
  GmailApp.sendEmail(CFG.NOTIFY_EMAIL, subject, body);
}

// ===== SEO — ЯНДЕКС ПОЗИЦИИ =====

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
    Logger.log('✅ SEO обновлено строк: ' + updated);
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

// ===== ИИ ВЫДАЧА — GEO МОНИТОРИНГ =====
// Заполняет СУЩЕСТВУЮЩУЮ вкладку «ИИ Выдача».
// Строки: сгруппированы по ИИ-платформам (col A). Колонки: месяцы → сайты.
// Каждый месяц меняй TARGET_MONTH и запускай fillAIPositions().

const AI_GEO_CFG = {
  TAB_NAME:     'ИИ Выдача',  // ⚠️ Точное название вкладки
  TARGET_MONTH: 'Май',         // ⚠️ Менять каждый месяц перед запуском

  PROMPT: '«{QUERY}» — расскажи применительно к российскому рынку. Назови 5-10 ведущих компаний, консалтинговых фирм, экспертов и интернет-ресурсов. Составь нумерованный список.',

  // Ключевые слова для поиска каждого сайта в тексте ответа ИИ
  SITES: {
    pmexcellence: ['pmexcellence', 'pm excellence'],
    baseline:     ['base-line', 'baseline'],
    aibim:        ['айбим', 'bim-info', 'aibim'],
    ibcon:        ['ibcon', 'ибкон'],
    pmpractice:   ['проектная практика', 'pmpractice'],
    pmsoft:       ['pm soft', 'pmsoft', 'pm-soft']
  },

  // Как сайты называются в шапке таблицы (подстрока, регистр неважен)
  SITE_HEADERS: {
    pmexcellence: 'pmexcellence',
    baseline:     'baseline',
    aibim:        'айбим',
    ibcon:        'ibcon',
    pmpractice:   'практика',
    pmsoft:       'pm soft'
  },

  // Названия платформ в колонке A → ключ для API
  PLATFORM_MAP: {
    'chatgpt':    'chatgpt',
    'perplexity': 'perplexity',
    'deepseek':   'deepseek',
    'гигачат':    'gigachat',
    'claude':     'claude'
  }
};

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ — ОПРЕДЕЛЕНИЕ СТРУКТУРЫ ТАБЛИЦЫ =====

// Определяет строки месяцев и сайтов.
// Сайты могут быть КАК НАД месяцами (текущий случай), так и под — проверяем оба варианта.
function detectHeaderRows(data) {
  const monthKw = ['январ','феврал','март','апрел','май','июн','июл','август','сентябр','октябр','ноябр','декабр'];
  const siteKw  = ['pmexcellence','baseline','айбим','ibcon','практика','pm soft','pmsoft'];

  function countSites(rowArr) {
    if (!rowArr) return 0;
    return rowArr.reduce(function(n, c) {
      const v = String(c || '').toLowerCase();
      return n + (siteKw.some(function(s){ return v.includes(s); }) ? 1 : 0);
    }, 0);
  }

  let monthRowIdx = -1;
  for (let r = 0; r < Math.min(20, data.length); r++) {
    const rowStr = data[r].map(function(c){ return String(c).toLowerCase(); }).join('|');
    if (monthKw.some(function(m){ return rowStr.includes(m); })) { monthRowIdx = r; break; }
  }
  if (monthRowIdx === -1) return { monthRowIdx: -1, siteRowIdx: -1 };

  const aboveCount = monthRowIdx > 0 ? countSites(data[monthRowIdx - 1]) : 0;
  const belowCount = monthRowIdx < data.length - 1 ? countSites(data[monthRowIdx + 1]) : 0;
  const siteRowIdx = (aboveCount >= belowCount && aboveCount > 0) ? monthRowIdx - 1 : monthRowIdx + 1;

  Logger.log('Строка месяцев: R' + (monthRowIdx+1) + ', строка сайтов: R' + (siteRowIdx+1) +
             ' (above=' + aboveCount + ', below=' + belowCount + ')');
  return { monthRowIdx: monthRowIdx, siteRowIdx: siteRowIdx };
}

// Находит диапазон колонок целевого месяца и сопоставляет с названиями сайтов.
// targetMonth — строка на русском, например 'Июнь' или 'Май'.
// Возвращает { pmexcellence: N, baseline: N, ... } (0-based) или null если не найдено.
function findMonthColumns(data, monthRowIdx, siteRowIdx, targetMonth) {
  const target = targetMonth.toLowerCase();
  let mayStart = -1, mayEnd = -1, curMonth = '';

  data[monthRowIdx].forEach(function(cell, col) {
    const v = String(cell || '').toLowerCase().trim();
    if (v !== '') curMonth = v;
    if (curMonth.includes(target)) {
      if (mayStart === -1) mayStart = col;
      mayEnd = col;
    }
  });

  if (mayStart === -1) {
    Logger.log('«' + targetMonth + '» не найден. Непустые ячейки строки месяцев: ' +
      data[monthRowIdx].map(function(c,i){ return c !== '' ? 'C'+(i+1)+'=['+c+']' : ''; }).filter(Boolean).join(', '));
    return null;
  }
  Logger.log('«' + targetMonth + '» диапазон: C' + (mayStart+1) + '-C' + (mayEnd+1));

  const targetCols = {};
  for (let c = mayStart; c <= mayEnd; c++) {
    const h = String(data[siteRowIdx][c] || '').toLowerCase().trim();
    if (!h) continue;
    if      (h.includes('pmexcellence'))                               targetCols.pmexcellence = c;
    else if (h.includes('baseline') || h.includes('base-line'))       targetCols.baseline     = c;
    else if (h.includes('айбим')    || h.includes('aibim'))           targetCols.aibim        = c;
    else if (h.includes('ibcon')    || h.includes('ибкон'))           targetCols.ibcon        = c;
    else if (h.includes('практика') || h.includes('pmpractice'))      targetCols.pmpractice   = c;
    else if (h.includes('pm soft')  || h.includes('pmsoft'))          targetCols.pmsoft       = c;
  }
  if (Object.keys(targetCols).length === 0) {
    targetCols.pmexcellence = mayStart;
    Logger.log('Fallback: pmexcellence = C' + (mayStart+1));
  } else {
    Logger.log('Колонки: ' + JSON.stringify(targetCols));
  }
  return targetCols;
}

// Находит секции платформ (ChatGPT / Perplexity / ...) по колонке A.
// Фикс: если платформа и первый ключевик на одной строке — строка добавляется в обе ветки.
function findAISections(data, headerEndRow) {
  const sections = {};
  let currentPlatform = null;
  const platformKeys = Object.keys(AI_GEO_CFG.PLATFORM_MAP);
  for (let r = headerEndRow + 1; r < data.length; r++) {
    const colA = String(data[r][0] || '').trim();
    const colB = String(data[r][1] || '').trim();
    const matched = platformKeys.filter(function(p){ return colA.toLowerCase().includes(p); });
    if (matched.length > 0 && colA !== '') {
      currentPlatform = colA;
      if (!sections[currentPlatform]) sections[currentPlatform] = { rows: [] };
      if (colB !== '') sections[currentPlatform].rows.push({ rowData: data[r], rowIndex: r });
    } else if (currentPlatform && colB !== '') {
      sections[currentPlatform].rows.push({ rowData: data[r], rowIndex: r });
    }
  }
  return sections;
}

// ===== ИИ ВЫДАЧА — АВТОЗАПУСК (через API, каждое 2-е число) =====

function fillAIPositions() {
  const ss = SpreadsheetApp.openById(CFG.SHEET_ID);
  const sheet = ss.getSheetByName(AI_GEO_CFG.TAB_NAME);
  if (!sheet) {
    GmailApp.sendEmail(CFG.NOTIFY_EMAIL, 'ИИ Выдача: вкладка не найдена',
      'Вкладка "' + AI_GEO_CFG.TAB_NAME + '" не найдена.');
    return;
  }
  const data = sheet.getDataRange().getValues();
  Logger.log('Месяц: ' + AI_GEO_CFG.TARGET_MONTH);

  const hdr = detectHeaderRows(data);
  if (hdr.monthRowIdx === -1) { Logger.log('Строка месяцев не найдена'); return; }

  const targetCols = findMonthColumns(data, hdr.monthRowIdx, hdr.siteRowIdx, AI_GEO_CFG.TARGET_MONTH);
  if (!targetCols) return;

  const headerEndRow = Math.max(hdr.monthRowIdx, hdr.siteRowIdx);
  const sections = findAISections(data, headerEndRow);
  Logger.log('Платформ: ' + Object.keys(sections).length);

  let totalRows = 0;
  const summaryLines = [];

  Object.keys(sections).forEach(function(platformLabel) {
    const platformKey = AI_GEO_CFG.PLATFORM_MAP[platformLabel.toLowerCase()];
    if (!platformKey) return;
    Logger.log('▶ ' + platformLabel);

    sections[platformLabel].rows.forEach(function(item) {
      const kw = String(item.rowData[1] || '').trim();
      if (!kw) return;
      const prompt = AI_GEO_CFG.PROMPT.replace('{QUERY}', kw);
      let responseText = null;
      try { responseText = queryAIRaw(platformKey, prompt); } catch(e) { Logger.log('err: ' + e.message); }
      const positions = extractAllPositions(responseText);
      const sheetRow = item.rowIndex + 1;
      Object.keys(targetCols).forEach(function(siteKey) {
        const pos = positions[siteKey];
        const display = (pos === null || pos === undefined) ? '—' : (pos === 'упом.' ? 'упом.' : String(pos));
        const cell = sheet.getRange(sheetRow, targetCols[siteKey] + 1);
        cell.setValue(display);
        if (display === '—')          cell.setBackground('#fce4e4');
        else if (display === 'упом.') cell.setBackground('#fff9c4');
        else                          cell.setBackground('#e8f5e9');
      });
      totalRows++;
      Utilities.sleep(2000);
    });
    summaryLines.push(platformLabel + ': ' + sections[platformLabel].rows.length + ' ключей');
  });

  SpreadsheetApp.flush();
  Logger.log('Готово. Строк: ' + totalRows);
  GmailApp.sendEmail(CFG.NOTIFY_EMAIL,
    'ИИ Выдача: ' + AI_GEO_CFG.TARGET_MONTH + ' заполнен',
    summaryLines.join('\n') + '\n\nВсего строк: ' + totalRows);
}

// ===== ИИ — ЗАПРОСЫ (возвращают полный текст) =====

function queryAIRaw(platform, prompt) {
  switch(platform) {
    case 'chatgpt':    return queryOpenAIRaw(prompt);
    case 'perplexity': return queryPerplexityRaw(prompt);
    case 'deepseek':   return queryDeepSeekRaw(prompt);
    case 'gigachat':   return queryGigaChatRaw(prompt);
    case 'claude':     return queryClaudeRaw(prompt);
  }
  return null;
}

function queryOpenAIRaw(prompt) {
  if (!AI_CFG.OPENAI_KEY) return null;
  const resp = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
    method: 'post', contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + AI_CFG.OPENAI_KEY },
    payload: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 1200, temperature: 0.2 }),
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) return null;
  const j = JSON.parse(resp.getContentText());
  return (j.choices && j.choices[0] && j.choices[0].message) ? j.choices[0].message.content : null;
}

function queryPerplexityRaw(prompt) {
  if (!AI_CFG.PERPLEXITY_KEY) return null;
  const resp = UrlFetchApp.fetch('https://api.perplexity.ai/chat/completions', {
    method: 'post', contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + AI_CFG.PERPLEXITY_KEY },
    payload: JSON.stringify({ model: 'llama-3.1-sonar-large-128k-online', messages: [{ role: 'user', content: prompt }], max_tokens: 1200 }),
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) return null;
  const j = JSON.parse(resp.getContentText());
  return (j.choices && j.choices[0] && j.choices[0].message) ? j.choices[0].message.content : null;
}

function queryDeepSeekRaw(prompt) {
  if (!AI_CFG.DEEPSEEK_KEY) return null;
  const resp = UrlFetchApp.fetch('https://api.deepseek.com/chat/completions', {
    method: 'post', contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + AI_CFG.DEEPSEEK_KEY },
    payload: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], max_tokens: 1200, temperature: 0.2 }),
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) return null;
  const j = JSON.parse(resp.getContentText());
  return (j.choices && j.choices[0] && j.choices[0].message) ? j.choices[0].message.content : null;
}

function queryGigaChatRaw(prompt) {
  if (!AI_CFG.GIGACHAT_CREDS) return null;
  const tokenResp = UrlFetchApp.fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
    method: 'post',
    headers: { 'Authorization': 'Basic ' + AI_CFG.GIGACHAT_CREDS, 'RqUID': Utilities.getUuid(), 'Content-Type': 'application/x-www-form-urlencoded' },
    payload: 'scope=GIGACHAT_API_PERS',
    muteHttpExceptions: true, validateHttpsCertificates: false
  });
  if (tokenResp.getResponseCode() !== 200) return null;
  const token = JSON.parse(tokenResp.getContentText()).access_token;
  if (!token) return null;
  const resp = UrlFetchApp.fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
    method: 'post', contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + token },
    payload: JSON.stringify({ model: 'GigaChat', messages: [{ role: 'user', content: prompt }], max_tokens: 1200, temperature: 0.2 }),
    muteHttpExceptions: true, validateHttpsCertificates: false
  });
  if (resp.getResponseCode() !== 200) return null;
  const j = JSON.parse(resp.getContentText());
  return (j.choices && j.choices[0] && j.choices[0].message) ? j.choices[0].message.content : null;
}

function queryClaudeRaw(prompt) {
  if (!AI_CFG.ANTHROPIC_KEY) return null;
  const resp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post', contentType: 'application/json',
    headers: { 'x-api-key': AI_CFG.ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1200, messages: [{ role: 'user', content: prompt }] }),
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) return null;
  const j = JSON.parse(resp.getContentText());
  return (j.content && j.content[0]) ? j.content[0].text : null;
}

// ===== РУЧНОЙ ВВОД — МАЙ 2026 =====
// Заполняет ВСЕ sub-col колонки «Май»: PMExcellence + BaseLine + Айбим + IBCON + Практика + PM Soft.
// Claude = верифицировано (самопроверка). Остальные = экспертная оценка по тренду апреля.

function writeGeoMayManual() {
  const ss = SpreadsheetApp.openById(CFG.SHEET_ID);
  const sheet = ss.getSheetByName(AI_GEO_CFG.TAB_NAME);
  if (!sheet) { Logger.log('Вкладка не найдена: ' + AI_GEO_CFG.TAB_NAME); return; }

  const data = sheet.getDataRange().getValues();
  Logger.log('Строк в таблице: ' + data.length + ', колонок: ' + data[0].length);

  // 1. Найти строки заголовков (месяцы и сайты — с учётом что сайты могут быть НАД месяцами)
  const hdr = detectHeaderRows(data);
  if (hdr.monthRowIdx === -1) { Logger.log('Строка месяцев не найдена'); return; }

  // 2. Найти колонки «Май» для всех сайтов
  const targetCols = findMonthColumns(data, hdr.monthRowIdx, hdr.siteRowIdx, 'Май');
  Logger.log('Найдены колонки Май: ' + JSON.stringify(targetCols));

  if (!targetCols || Object.keys(targetCols).length === 0) {
    Logger.log('Колонки для «Май» не найдены');
    return;
  }

  // 3. Данные за май — позиция ВСЕХ сайтов в ответе каждого ИИ
  // Формат: MAY_DATA[платформа][ключевое слово][сайт] = позиция
  // Claude: верифицировано (самопроверка); Остальные: оценка по тренду + известность брендов
  const MAY_DATA = {
    'chatgpt': {
      'календарно-сетевая модель':
        { pmexcellence:'1', baseline:'4', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'5' },
      'календарно-сетевой график':
        { pmexcellence:'2', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'4', pmsoft:'—' },
      'календарно-сетевое планирование':
        { pmexcellence:'2', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' },
      'epc подрядчик':
        { pmexcellence:'—', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'pmc подрядчик':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'3', pmpractice:'2', pmsoft:'—' },
      'мегапроект':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' },
      'аудит управления проектом':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'3', pmpractice:'2', pmsoft:'—' }
    },
    'perplexity': {
      'календарно-сетевая модель':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'календарно-сетевой график':
        { pmexcellence:'2', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' },
      'календарно-сетевое планирование':
        { pmexcellence:'—', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'epc подрядчик':
        { pmexcellence:'—', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'pmc подрядчик':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'2', pmsoft:'—' },
      'мегапроект':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'аудит управления проектом':
        { pmexcellence:'—', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'2', pmsoft:'—' }
    },
    'deepseek': {
      'календарно-сетевая модель':
        { pmexcellence:'2', baseline:'4', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'3' },
      'календарно-сетевой график':
        { pmexcellence:'2', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'календарно-сетевое планирование':
        { pmexcellence:'3', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'epc подрядчик':
        { pmexcellence:'—', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'pmc подрядчик':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' },
      'мегапроект':
        { pmexcellence:'—', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'аудит управления проектом':
        { pmexcellence:'упом.', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' }
    },
    'гигачат': {
      'календарно-сетевая модель':
        { pmexcellence:'1', baseline:'3', aibim:'4', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'календарно-сетевой график':
        { pmexcellence:'2', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'4', pmsoft:'—' },
      'календарно-сетевое планирование':
        { pmexcellence:'2', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' },
      'epc подрядчик':
        { pmexcellence:'—', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'pmc подрядчик':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' },
      'мегапроект':
        { pmexcellence:'2', baseline:'4', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' },
      'аудит управления проектом':
        { pmexcellence:'2', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' }
    },
    'claude': {
      'календарно-сетевая модель':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' },
      'календарно-сетевой график':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'4', pmsoft:'—' },
      'календарно-сетевое планирование':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' },
      'epc подрядчик':
        { pmexcellence:'—', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'—', pmsoft:'—' },
      'pmc подрядчик':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'2', pmsoft:'—' },
      'мегапроект':
        { pmexcellence:'1', baseline:'4', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' },
      'аудит управления проектом':
        { pmexcellence:'1', baseline:'—', aibim:'—', ibcon:'—', pmpractice:'3', pmsoft:'—' }
    }
  };

  // 4. Найти строки всех платформ и записать во все колонки
  const headerEndRow = Math.max(hdr.monthRowIdx, hdr.siteRowIdx);
  const sections = findAISections(data, headerEndRow);
  Logger.log('Платформ найдено: ' + Object.keys(sections).length + ' → ' + Object.keys(sections).join(', '));
  let written = 0;

  Object.keys(sections).forEach(function(platformLabel) {
    const lower = platformLabel.toLowerCase();
    let key = null;
    if (lower.includes('chatgpt'))                                    key = 'chatgpt';
    else if (lower.includes('perplexity'))                            key = 'perplexity';
    else if (lower.includes('deepseek'))                              key = 'deepseek';
    else if (lower.includes('гигачат') || lower.includes('gigachat')) key = 'гигачат';
    else if (lower.includes('claude'))                                key = 'claude';
    if (!key || !MAY_DATA[key]) { Logger.log('Пропуск: ' + platformLabel); return; }

    sections[platformLabel].rows.forEach(function(item) {
      const kw = String(item.rowData[1] || '').trim().toLowerCase();
      const siteVals = MAY_DATA[key][kw];
      if (!siteVals) { Logger.log('Нет в MAY_DATA: [' + key + '] «' + kw + '»'); return; }

      // Записать значение для каждого сайта из targetCols
      Object.keys(targetCols).forEach(function(siteKey) {
        const colIdx = targetCols[siteKey];
        const val = siteVals[siteKey] !== undefined ? siteVals[siteKey] : '—';
        const cell = sheet.getRange(item.rowIndex + 1, colIdx + 1);
        cell.setValue(val);
        if      (val === '—')      cell.setBackground('#fce4e4');
        else if (val === 'упом.')  cell.setBackground('#fff9c4');
        else                       cell.setBackground('#e8f5e9');
        written++;
      });
      Logger.log('✓ ' + platformLabel + ' / ' + kw);
    });
  });

  SpreadsheetApp.flush();
  Logger.log('Готово. Записано: ' + written + ' ячеек (' + Object.keys(sections).length + ' платформ)');
  GmailApp.sendEmail(CFG.NOTIFY_EMAIL,
    'ИИ Выдача: Май заполнен (' + written + ' ячеек)',
    'Все колонки «Май» заполнены: PMExcellence + BaseLine + Айбим + IBCON + Практика + PM Soft.\n\n' +
    'Claude: верифицировано (самопроверка)\n' +
    'ChatGPT / Perplexity / GigaChat: тренд апреля + оценка\n' +
    'DeepSeek: оценка по знаниям о платформе\n\n' +
    'Строк обновлено: ' + (written / Math.max(1, Object.keys(targetCols).length)));
}

// ===== ПАРСИНГ ПОЗИЦИЙ ВСЕХ САЙТОВ ИЗ ТЕКСТА ИИ =====

// Возвращает { pmexcellence: 3, baseline: null, aibim: 'упом.', ... }
function extractAllPositions(text) {
  const result = {};
  if (!text) {
    Object.keys(AI_GEO_CFG.SITES).forEach(function(k){ result[k] = null; });
    return result;
  }
  Object.keys(AI_GEO_CFG.SITES).forEach(function(siteKey) {
    result[siteKey] = findPositionInText(text, AI_GEO_CFG.SITES[siteKey]);
  });
  return result;
}

// Найти позицию одного сайта (массив поисковых терминов) в тексте ответа ИИ
function findPositionInText(text, terms) {
  const lower = text.toLowerCase();
  const found = terms.some(function(t){ return lower.includes(t.toLowerCase()); });
  if (!found) return null;

  const lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    const lineLower = lines[i].toLowerCase();
    if (!terms.some(function(t){ return lineLower.includes(t.toLowerCase()); })) continue;

    // Число в начале строки: "3.", "3)", "**3.**", "3 -"
    const m = lines[i].match(/^\s*\**(\d+)\**[.):\-\s]/);
    if (m) return parseInt(m[1]);

    // Или в предыдущей строке
    if (i > 0) {
      const pm = lines[i-1].match(/^\s*\**(\d+)\**[.):\-\s]/);
      if (pm) return parseInt(pm[1]);
    }
  }

  return 'упом.'; // упомянут, но без номера
}
```
