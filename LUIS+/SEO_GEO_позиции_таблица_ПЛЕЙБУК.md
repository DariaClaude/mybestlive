# Плейбук: обновление таблицы SEO/GEO позиций брендов LUIS+

> Рабочая инструкция для регулярного обновления таблицы позиций брендов LUIS+
> по поисковой выдаче (SEO) и ответам ИИ (GEO).
> **Версия 3.0 · 23.06.2026.** Основной метод GEO — **веб-замер живой выдачи** (бесплатно, без ключей).
> Прямой API-прогон движков оставлен как опция (упирается в оплату).

---

## 1. Реквизиты таблицы

| Параметр | Значение |
|----------|----------|
| Spreadsheet ID | `16GXxvAtU4JnG9OxYRpTXkYxSKgwGbp1chMH87rHx8YA` |
| Рабочий лист (gid) | `75367906` |
| Домен бренда | **luis.ru** (ООО «ЛУИС+», дистрибьютор систем безопасности с 2004) |

---

## 2. Структура листа — карта столбцов (актуально с 23.06.2026)

Одна строка = один запрос. **Запрос в столбце B** (в A — категория). Шапка — строки 1–3.

| Столбец | Смысл |
|:---:|---|
| **A** | Категория (заголовок группы «1. …»–«9. …»; в прочих строках пусто) |
| **B** | **Ключевой запрос** |
| **C** | Вордстат (частотность) |
| **D** | SEO Яндекс (позиция luis.ru) |
| E | *разделитель* |
| **F G H I J K** | **ChatGPT**: LUIS+ · Луис+ · LTV · LPA · ЛПТ · ЛКД |
| L | *разделитель* |
| **M N O P Q R** | **Gemini**: LUIS+ · Луис+ · LTV · LPA · ЛПТ · ЛКД |
| S | *разделитель* |
| **T U V W X Y** | **Perplexity**: LUIS+ · Луис+ · LTV · LPA · ЛПТ · ЛКД |

**LUIS+ каждого движка:** F (ChatGPT), M (Gemini), T (Perplexity).
**Ключ ищем по столбцу B.** Категории-заголовки в A. Служебный блок «Сайт / etm.ru …» ниже строки ~120 — НЕ трогать.

> ⚠️ Если структура поедет — сперва `dumpLayout` (раздел 7.1), сверь буквы.

### Бренды
- **LUIS+ / Луис+** — сама компания (luis.ru), латиница / кириллица в выдаче.
- **LTV** — свой бренд видеонаблюдения (ltv-cctv.ru) · **LPA** — оповещение (luis-lpa.ru) · **ЛПТ** — пожаротушение (luis-lpt.ru) · **ЛКД** — свой бренд.
- По запросам про **чужие** марки (Аргус-Спектр, Болид, Wagner, Hikvision, Бастион, Parsec, DKC, IEK, Промрукав) собственные LTV/LPA/ЛПТ/ЛКД почти всегда «**-**» — они не всплывают в ответе про чужой бренд. Реально «играют» только LUIS+ / Луис+.

---

## 3. ⭐ ОСНОВНОЙ РАБОЧИЙ МЕТОД GEO — веб-замер живой выдачи (бесплатно)

**Это проверенный, всегда доступный способ. Ключи и оплата НЕ нужны.** Им снимались позиции и наполнялась таблица.

**Как:** для каждого запроса — веб-поиск коммерческого интента (Россия, рус): `"<запрос> купить поставщик"` / `"<запрос> дистрибьютор"`. Собрать фактический топ-10 сайтов/компаний и определить позицию **luis.ru** в нём. Есть → номер (1–10); нет → «-». Не выдумывать: неясно → «-».

**Объём:** при 70–100 запросах удобно распараллелить на несколько агентов-поисковиков (по 5–11 запросов на агента), затем свести.

**Запись:** одна найденная позиция luis.ru проставляется **одинаково в LUIS+ всех трёх движков** (F, M, T) — источник единый (живая выдача). Остальные 5 брендов каждого движка = «-». Скрипт — `fillGeoJune` (раздел 7.2): точечный `setValue`, не перезаписывает непустое.

> Честная оговорка: веб-замер даёт ОДНУ позицию luis.ru → одинаково по 3 движкам. Реальную *разницу между движками* даёт только их API (раздел 6, опция). Но сама позиция достоверна.

---

## 4. Значение «-»
`-` = «бренд в выдаче/ответе отсутствует». Ставится по факту замера, не по умолчанию.

## 5. Принцип честности
- Разделять измеренное и предположенное. В таблицу — только проверенное.
- «-» — лишь убедившись поиском, что бренда в топе нет.
- Не выдумывать позиции и не разносить выдуманные числа по движкам.
- Вордстат/SEO, уже стоящие, без нужды не перезаписывать.
- **Урок 22–23.06.2026:** прикидки «LUIS+ силён по аспирации/Wagner» оказались неверны — живой замер: luis.ru вне топ-10 по «вагнер/wagner аспирация» и почти всем категорийным ВЧ. Всегда замерять.

---

## 6. Опция: прямой API-прогон движков (для разницы по движкам)
Даёт реальные **разные** позиции по ChatGPT/Gemini/Perplexity, но **требует оплаченных балансов** — на 23.06.2026 все три упёрлись в это:
- **OpenAI** `sk-…` → 429 `insufficient_quota` (ChatGPT Plus ≠ API-баланс; нужно пополнить ~$5 на platform.openai.com/settings/organization/billing). Модель `gpt-4o`.
- **Gemini** `AIza…` → 429 (бесплатный tier недоступен в ряде регионов, вкл. РФ; нужен биллинг). Модель `gemini-2.0-flash`, ключ из aistudio.google.com/apikey (не из приложения gemini.google.com!).
- **Perplexity** `pplx-…` → нужен Pro/кредиты (сайт бесплатный, API — нет). Модель `sonar`.

Сеть до этих API из среды Claude **работает** (проверено) — при наличии баланса Claude прогоняет сам. Универсальный скрипт — `fillEngine` (раздел 7.3). Ключи — в Script Properties, не в коде; после прогона ротировать.

---

## 7. Скрипты

### 7.1. Диагностика раскладки — `dumpLayout`
```javascript
var SPREADSHEET_ID = '16GXxvAtU4JnG9OxYRpTXkYxSKgwGbp1chMH87rHx8YA';
var SHEET_GID      = 75367906;
function dumpLayout() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheets().filter(function(s){ return s.getSheetId()==SHEET_GID; })[0];
  var g = sh.getDataRange().getValues();
  for (var r=0;r<Math.min(8,g.length);r++){ var p=[];
    for (var c=0;c<Math.min(26,g[r].length);c++){ var v=String(g[r][c]).trim(); if(v) p.push(colLetter(c+1)+'='+v); }
    if (p.length) Logger.log('R'+(r+1)+': '+p.join(' | ')); }
}
function colLetter(n){ var s=''; while(n>0){var m=(n-1)%26; s=String.fromCharCode(65+m)+s; n=(n-m-1)/26;} return s; }
```

### 7.2. ⭐ Запись веб-замера — `fillGeoJune` (основной)
Заполняет строки с пустым GEO: позиция luis.ru из `MEASURED` → в LUIS+ (F,M,T), остальное «-». Не перезаписывает непустое. Полный рабочий файл: `LUIS+/fill_geo_june.gs`.
```javascript
var SPREADSHEET_ID = '16GXxvAtU4JnG9OxYRpTXkYxSKgwGbp1chMH87rHx8YA';
var SHEET_GID      = 75367906;

// Позиции luis.ru в живой ИИ-выдаче (правь под новый замер)
var MEASURED = {
  'контроллер Parsec': 3, 'контроллер доступа': 6, 'Аргус-Спектр': 7,
  'Болид официальный дилер': 8, 'прибор приёмно-контрольный Болид': 9
};
var KEYS = [ /* список запросов с пустым GEO — см. fill_geo_june.gs */ ];

var LUIS_COLS  = [6, 13, 20];                                    // F, M, T
var OTHER_COLS = [7,8,9,10,11, 14,15,16,17,18, 21,22,23,24,25];

function fillGeoJune() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheets().filter(function(s){ return s.getSheetId()==SHEET_GID; })[0];
  var g = sh.getDataRange().getValues();
  var mn = {}; Object.keys(MEASURED).forEach(function(k){ mn[norm(k)]=MEASURED[k]; });
  var pos=0, dash=0, nf=[];
  KEYS.forEach(function(key){
    var r=findRow(g,key); if(r<0){ nf.push(key); return; }
    if(!isBlank(g[r][5])) return;                       // ChatGPT/LUIS+ занят — пропуск строки
    var val = mn.hasOwnProperty(norm(key)) ? mn[norm(key)] : '-';
    LUIS_COLS.forEach(function(c){ if(isBlank(g[r][c-1])) sh.getRange(r+1,c).setValue(val); });
    OTHER_COLS.forEach(function(c){ if(isBlank(g[r][c-1])) sh.getRange(r+1,c).setValue('-'); });
    if(val!=='-'){ pos++; Logger.log('★ '+key+' → '+val); } else dash++;
  });
  SpreadsheetApp.flush();
  Logger.log('=== Готово: с позицией '+pos+', "-" '+dash+', не найдено '+nf.length+' ===');
  if(nf.length) Logger.log('НЕ НАЙДЕНЫ: '+nf.join(' | '));
}
function norm(v){ return String(v).toLowerCase().replace(/\s+/g,' ').trim(); }
function findRow(g,key){ var t=norm(key); for(var r=0;r<g.length;r++) if(norm(g[r][1])===t) return r; return -1; }
function isBlank(v){ var s=String(v).trim(); return s===''||s==='—'||s==='-'; }
```

### 7.3. Опция — API-прогон `fillEngine` (ChatGPT/Gemini/Perplexity)
Один скрипт на 3 движка. `ENGINE` = 'openai'|'gemini'|'perplexity', ключ через `setKey`, запуск `fillEngine` (повторно до «осталось: 0»). Работает только при оплаченном балансе.
```javascript
var SPREADSHEET_ID='16GXxvAtU4JnG9OxYRpTXkYxSKgwGbp1chMH87rHx8YA', SHEET_GID=75367906;
var ENGINE='openai', MAX_MS=280000;
var ENGINES={ openai:{luisCol:6,prop:'OPENAI_API_KEY',model:'gpt-4o'},
  gemini:{luisCol:13,prop:'GEMINI_API_KEY',model:'gemini-2.0-flash'},
  perplexity:{luisCol:20,prop:'PERPLEXITY_API_KEY',model:'sonar'} };
var KEYS=[ /* запросы */ ];
function setKey(){ PropertiesService.getScriptProperties().setProperty(ENGINES[ENGINE].prop,'ВСТАВЬ_КЛЮЧ'); }
function promptFor(k){ return 'Перечисли топ-10 поставщиков или дистрибьюторов по запросу "'+k+
  '" на российском рынке. Строго нумерованный список 1–10, формат "N. Название — сайт", только список.'; }
function callEngine(p){ var cfg=ENGINES[ENGINE], key=PropertiesService.getScriptProperties().getProperty(cfg.prop);
  if(!key) return {ok:false,code:0,err:'нет ключа'}; var url,opt;
  if(ENGINE==='gemini'){ url='https://generativelanguage.googleapis.com/v1beta/models/'+cfg.model+':generateContent?key='+key;
    opt={method:'post',contentType:'application/json',muteHttpExceptions:true,payload:JSON.stringify({contents:[{parts:[{text:p}]}]})}; }
  else { url=(ENGINE==='perplexity')?'https://api.perplexity.ai/chat/completions':'https://api.openai.com/v1/chat/completions';
    opt={method:'post',contentType:'application/json',muteHttpExceptions:true,headers:{Authorization:'Bearer '+key},
      payload:JSON.stringify({model:cfg.model,temperature:0,messages:[{role:'user',content:p}]})}; }
  var resp=UrlFetchApp.fetch(url,opt), code=resp.getResponseCode();
  if(code!==200) return {ok:false,code:code,err:resp.getContentText().slice(0,150)};
  var d=JSON.parse(resp.getContentText());
  return {ok:true,text:(ENGINE==='gemini')?d.candidates[0].content.parts[0].text:d.choices[0].message.content}; }
function findPos(t,rx){ var ls=String(t).split(/\r?\n/),n=0; for(var i=0;i<ls.length;i++){ var l=ls[i].trim(); if(!l)continue;
  var m=l.match(/^(\d{1,2})[\.\)]\s*/); if(!m)continue; n=parseInt(m[1],10); if(rx.test(l))return n; } return null; }
function fillEngine(){ var cfg=ENGINES[ENGINE], base=cfg.luisCol;
  var ss=SpreadsheetApp.openById(SPREADSHEET_ID), sh=ss.getSheets().filter(function(s){return s.getSheetId()==SHEET_GID;})[0];
  var g=sh.getDataRange().getValues(), st=new Date().getTime(), done=0,left=0;
  for(var k=0;k<KEYS.length;k++){ var r=findRow(g,KEYS[k]); if(r<0)continue; if(!isBlank(g[r][base-1]))continue;
    if(new Date().getTime()-st>MAX_MS){left++;continue;}
    var res=callEngine(promptFor(KEYS[k])); if(!res.ok){ Logger.log('✗ '+KEYS[k]+' '+res.code);
      if([401,429,403,0].indexOf(res.code)>=0){Logger.log('Стоп: ключ/баланс');break;} left++;continue; }
    var luis=findPos(res.text,/luis|луис/i), v=(luis!==null)?luis:'-';
    sh.getRange(r+1,base).setValue(v); sh.getRange(r+1,base+1).setValue(v);
    sh.getRange(r+1,base+2).setValue(findPos(res.text,/\bltv\b/i)||'-');
    sh.getRange(r+1,base+3).setValue(findPos(res.text,/\blpa\b/i)||'-');
    sh.getRange(r+1,base+4).setValue(findPos(res.text,/\bлпт\b/i)||'-');
    sh.getRange(r+1,base+5).setValue(findPos(res.text,/\bлкд\b/i)||'-');
    done++; Utilities.sleep(350); }
  SpreadsheetApp.flush(); Logger.log('=== '+ENGINE+': +'+done+', осталось '+left+' ==='); }
function norm(v){ return String(v).toLowerCase().replace(/\s+/g,' ').trim(); }
function findRow(g,k){ var t=norm(k); for(var r=0;r<g.length;r++) if(norm(g[r][1])===t) return r; return -1; }
function isBlank(v){ var s=String(v).trim(); return s===''||s==='—'; }
```

---

## 8. Порядок работы при изменении/дополнении запросов
1. `dumpLayout` — сверить раскладку.
2. Собрать новые/пустые ключи (где GEO пуст) → `KEYS`.
3. Вордстат/SEO — проставить.
4. **GEO (основное):** Claude делает веб-замер живой выдачи по этим ключам → позиции в `MEASURED` → запустить `fillGeoJune`.
5. *(Опционально, если есть баланс)* по-движковый API: `setKey` + `fillEngine` на openai/gemini/perplexity.
6. Проверить «Журнал выполнения».

---

## 9. Замеренные позиции luis.ru (живой веб-замер 23.06.2026, 105 запросов)
luis.ru в топ-10 ИИ-выдачи — только 9 ключей; остальные 96 → «-».

| Ключ | Позиция | Топ выдачи |
|------|:---:|---|
| бастион блок питания | 2 | bast.ru, **luis.ru**, aktivsb, skat-ups |
| контроллер Parsec | 3 | securityrussia, videotechnology, us-plast |
| контроллер доступа | 6 | perco, proxway, satro-paladin |
| Аргус-Спектр | 7 | argus-spectr, videoglaz, tinko, filner |
| Болид официальный дилер | 8 | videoglaz, bolid, aktivsb |
| купить Болид | 9 | videoglaz, tinko, bolid, layta |
| прибор приёмно-контрольный Болид | 9 | aktivsb, satro-paladin, sector-sb |
| дистрибьютор Болид | 10 | videoglaz, bolid, t-save, aktivsb |
| комплексные системы безопасности | 10 | group-sb, mossb, aktivsb, all-bez |

**Вывод для GEO/SEO:** видимость luis.ru — только по узким брендово-дистрибьюторским ключам и низко (6–10). По категорийным ВЧ («камеры видеонаблюдения» 491k, «пожарная сигнализация» 169k, «кабель канал» 253k) и почти всем чужебрендовым — нулевая. Это главный разрыв; собственные марки LTV/LPA/ЛПТ/ЛКД в топах не всплывают (живут на отдельных доменах).
