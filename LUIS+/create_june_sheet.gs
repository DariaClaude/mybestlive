/**
 * Мониторинг соцсетей конкурентов / LUIS+
 *
 * Что делает функция run():
 *   1. Добавляет вкладку «Июнь 2026»            — сводная по 22 конкурентам (с гиперссылками)
 *   2. Добавляет вкладку «Раскладка июнь 2026»  — все посты, сортировка по охвату ↓
 *   3. Приводит ВСЕ листы «Раскладка*» (апрель/май/июнь) к ЕДИНОЙ цветовой палитре
 *
 * Гиперссылки везде сделаны через RichText (setLinkUrl) — это локаль-независимо
 * и не даёт ошибку #ERROR!, в отличие от формулы =HYPERLINK() в русской локали.
 *
 * ЗАПУСК: script.google.com → вставить код → выбрать run → ▶ Выполнить.
 * Период данных: 1–25 июня 2026. Скрипт безопасен для повторного запуска.
 */

var SPREADSHEET_ID = '1oPpimp0DoHNmd6cTjBdrHeM2tb-0OsAbEhaGF9Xhmg4';

// ── ЕДИНАЯ ПАЛИТРА ОХВАТА (общая для апреля/мая/июня) ──
var PALETTE = {
  high: '#e8f5e9',  // ≥ 2 000
  good: '#fff8e1',  // 1 500 – 1 999
  mid:  '#f3e5f5',  // 1 000 – 1 499
  low:  '#e3f2fd',  // 500 – 999
  min:  '#f5f5f5',  // < 500
  none: '#f9f9f9'   // нет данных
};

function bgForReach(v) {
  if (v === '' || v === null || v === undefined) return PALETTE.none;
  var n = (typeof v === 'number') ? v : parseInt(String(v).replace(/[^\d]/g, ''), 10);
  if (isNaN(n)) return PALETTE.none;
  if (n >= 2000) return PALETTE.high;
  if (n >= 1500) return PALETTE.good;
  if (n >= 1000) return PALETTE.mid;
  if (n >= 500)  return PALETTE.low;
  return PALETTE.min;
}

// Универсальная гиперссылка через RichText (без ошибок локали)
function setLink(s, row, col, text, url) {
  var rt = SpreadsheetApp.newRichTextValue()
    .setText(text)
    .setLinkUrl(url)
    .build();
  s.getRange(row, col).setRichTextValue(rt);
}

function run() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  ['Июнь 2026', 'Раскладка июнь 2026'].forEach(function(name) {
    var old = ss.getSheetByName(name);
    if (old) ss.deleteSheet(old);
  });

  var mainSheet = ss.insertSheet('Июнь 2026');
  var razSheet  = ss.insertSheet('Раскладка июнь 2026');

  buildMainSheet(mainSheet);
  buildRazkladkaSheet(razSheet);

  var processed = unifyRazkladkaPalette(ss);   // единая палитра для всех раскладок

  ss.setActiveSheet(mainSheet);
  Logger.log('Готово. Единая палитра применена к листам: ' + processed.join(' | '));
}

// ═══════════════════════════════════════════════════════════
//  ВКЛАДКА 1 — СВОДНАЯ ТАБЛИЦА «Июнь 2026» (с гиперссылками)
// ═══════════════════════════════════════════════════════════
function buildMainSheet(s) {

  var colW = [40, 165, 110, 90, 110, 90, 95, 75, 90, 75, 110, 470];
  colW.forEach(function(w, i) { s.setColumnWidth(i + 1, w); });

  var headers = ['№','Конкурент','Telegram','Постов TG','ВКонтакте','Постов VK',
                 'YouTube','Видео','Другие','Всего','Уровень',
                 'Ключевые темы июня (1–25 июня 2026)'];
  var hRange = s.getRange(1, 1, 1, headers.length);
  hRange.setValues([headers]);
  hRange.setBackground('#1a1a1a').setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(10)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  s.setRowHeight(1, 38);
  s.setFrozenRows(1);

  // [№, Конкурент, TG, ПостовTG, ВК, ПостовVK, YouTube, Видео, Другие, Всего, Уровень, Темы]
  var data = [
    [1,'Аргус-Спектр','Telegram',0,'—',0,'—',0,'Сайт','—','Низкий',
     'Резкий спад медиа-активности: в TG-выдаче июньских постов нет (в мае было 8). Активность только на сайте/УЦ — ежедневные вебинары по «Стрелец-ПРО» (пн–пт), программирование и облачный сервис; ИИ-ассистент StreletzGPT (сайт, MAX, Telegram-бот)'],

    [2,'Болид','Telegram',7,'—',0,'YouTube',0,'—',7,'Высокий',
     'Топ-охват месяца — семинары ПБ/СПЗ Воронеж–Ростов–Омск (4 июня, 2 130); считыватели Proxy-6 нов. поколения MIFARE Plus (9 июня); биометрия С2000-BIOAccess-SF5P — лицо+ладонь (11 июня); видеорегистратор RGI-12888 на 128 каналов/32 Мп (16 июня); выставка «Центр безопасности» Минск (16–18 июня); вебинар по проектированию СОУЭ (23 июня)'],

    [3,'ДССЛ / TRASSIR','Telegram (закрытый)',0,'—',0,'—',0,'Сайт/СМИ','—','Низкий',
     'TG-канал закрыт. Публичной активности за июнь не выявлено'],

    [4,'DKC','Telegram',6,'—',0,'—',0,'—',6,'Средний',
     'Смещение в CSR: благотворительный забег «Бежим вместе» в Технопарке ДКС (20 июня, А. Алискеров, А. Смертин); генспонсор форума «Золотые руки» Краснодар (9–10 июня — FRAME, YON max, KANT); продуктовые посты: YON PRO, изоляторы TUR, шкафы для ЦОД, лючки Sotto'],

    [5,'IEK Group','Telegram',12,'ВКонтакте',0,'—',0,'Dzen',12,'Высокий',
     'Лидер по объёму, но контент в осн. электротехнический/корпоративный: «Электродвиж по-татарски» Уфа (19 июня, 1 750 — топ); размещение облигаций 001Р-05 на 2,5 млрд ₽ (19 июня); открытие кластера в Ульяновске; локализация кабель-каналов IMPACT (Ясногорск); FLITE/FORTE&PIANO в ТВ-шоу; форум «ЦОД» в СПб'],

    [6,'ISS','Telegram',0,'—',0,'—',0,'—',0,'Нет данных',
     'Последний пост — 26 мая. В июне публичной активности не выявлено'],

    [7,'Macroscop','—',0,'—',0,'—',0,'—',0,'Нет данных','—'],

    [8,'Рубеж','Telegram',9,'—',0,'—',0,'—',9,'Высокий',
     'Конференция «Комплексная безопасность объектов» Самара (10 июня — СП 6.13130, СП 484, СП 3.13130); семинар Челябинск (17 июня); линейка СПЗ GLOBAL RUBEZH — обзор уровней (до 1 000); интервью о линейке SONAR (963); вопрос эксперту о защите от единичных неисправностей (895); световые оповещатели ОПОП T1-R3/T2-R3; 10-уровневая ретрансляция RUBEZH R3'],

    [9,'ЭТМ','Telegram',13,'ВКонтакте',0,'—',0,'—',13,'Активен',
     '13 постов 25 июня — преимущественно электротовары (EKF PROXIMA, Navigator, KNIPEX, ДКС, КВТ). По теме LUIS+ единично: извещатели пламени «Гелиос» (398), огнестойкая монтажная пена FIREFORT B1 (74). Анонс вебинаров 25 и 30 июня'],

    [10,'Hikvision RU','—',0,'—',0,'YouTube',0,'Сайт',0,'Нет',
     'Ушли с рынка РФ, соцсети не ведут'],

    [11,'Layta','—',0,'—',0,'—',0,'—',0,'Нет данных','—'],
    [12,'Parsec','—',0,'—',0,'—',0,'—',0,'Нет данных','—'],
    [13,'Эридан','—',0,'—',0,'—',0,'—',0,'Нет данных','—'],

    [14,'Русский Свет','—',0,'ВКонтакте',0,'—',0,'—',0,'Низкий',
     'VK: акции на светотехнику (TOKOV ELECTRIC, EKF) — не по теме LUIS+'],

    [15,'Tinko','—',0,'—',0,'—',0,'—',0,'Нет данных','—'],
    [16,'ДЕАН','—',0,'—',0,'—',0,'—',0,'Нет данных','—'],
    [17,'Твинпро','—',0,'—',0,'—',0,'—',0,'Нет данных','—'],
    [18,'МСБ','—',0,'—',0,'—',0,'—',0,'Нет данных','—'],
    [19,'САТРО-ПАЛАДИН','—',0,'—',0,'—',0,'—',0,'Нет данных','—'],
    [20,'ТК РУТЕК','—',0,'—',0,'—',0,'—',0,'Нет данных','—'],
    [21,'ГАРАНТ','—',0,'—',0,'—',0,'—',0,'Нет данных','—'],
    [22,'WAGNER','—',0,'—',0,'—',0,'—',0,'Нет данных','—']
  ];

  var dataRange = s.getRange(2, 1, data.length, 12);
  dataRange.setValues(data);
  dataRange.setFontSize(10).setVerticalAlignment('top')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  for (var i = 0; i < data.length; i++) {
    s.getRange(i + 2, 1, 1, 12).setBackground(i % 2 === 0 ? '#ffffff' : '#f8f8f8');
    s.setRowHeight(i + 2, 56);
  }
  s.getRange(2, 1, data.length, 10).setHorizontalAlignment('center');

  // ── ГИПЕРССЫЛКИ (RichText, без ошибок локали) ──
  var siteMap = {
    'Аргус-Спектр':'https://argus-spectr.ru',
    'Болид':'https://bolid.ru',
    'ДССЛ / TRASSIR':'https://dssl.ru',
    'DKC':'https://dkc.ru',
    'IEK Group':'https://iek.ru',
    'ISS':'https://iss.ru',
    'Macroscop':'https://macroscop.com',
    'Рубеж':'https://rubezh.pro',
    'ЭТМ':'https://etm.ru',
    'Hikvision RU':'https://hikvision.ru',
    'Layta':'https://layta.ru',
    'Parsec':'https://parsec.ru',
    'Эридан':'https://eridan.ru',
    'Русский Свет':'https://russvet.ru',
    'Tinko':'https://tinko.ru',
    'ДЕАН':'https://dean.ru',
    'Твинпро':'https://twinpro.ru',
    'САТРО-ПАЛАДИН':'https://satro-paladin.com',
    'ТК РУТЕК':'https://rutek-group.ru',
    'ГАРАНТ':'https://garantgroup.com',
    'WAGNER':'https://wagner-alarm.de'
  };
  var tgMap = {
    'Аргус-Спектр':'https://t.me/argus_spectr',
    'Болид':'https://t.me/bolid_nvp',
    'ДССЛ / TRASSIR':'https://t.me/trassir',
    'DKC':'https://t.me/dkccom',
    'IEK Group':'https://t.me/iek_group_rus',
    'ISS':'https://t.me/iss_ru',
    'Рубеж':'https://t.me/rmc_rubezh',
    'ЭТМ':'https://t.me/etm_company'
  };
  var vkMap = {
    'IEK Group':'https://vk.com/iek_group',
    'ЭТМ':'https://vk.com/etmcompany',
    'Русский Свет':'https://vk.com/russkijsvet'
  };

  for (var i = 0; i < data.length; i++) {
    var row  = i + 2;
    var name = data[i][1];
    var tgTx = data[i][2];   // текст ячейки Telegram
    var vkTx = data[i][4];   // текст ячейки ВКонтакте

    if (siteMap[name])                       setLink(s, row, 2, name,  siteMap[name]);     // Конкурент → сайт
    if (tgMap[name] && tgTx !== '—')         setLink(s, row, 3, tgTx,  tgMap[name]);       // Telegram
    if (vkMap[name] && vkTx === 'ВКонтакте') setLink(s, row, 5, 'ВКонтакте', vkMap[name]); // ВКонтакте
  }
  // выравнивание после простановки ссылок
  s.getRange(2, 2, data.length, 1).setHorizontalAlignment('left').setFontSize(10);
  s.getRange(2, 3, data.length, 1).setHorizontalAlignment('center').setFontSize(10);
  s.getRange(2, 5, data.length, 1).setHorizontalAlignment('center').setFontSize(10);

  // ── Цвет колонки «Уровень» (11) — палитра активности ──
  var actColors = {
    'Высокий':    {bg:'#e8f5e9', fg:'#2e7d32'},
    'Средний':    {bg:'#fff8e1', fg:'#e65100'},
    'Активен':    {bg:'#e3f2fd', fg:'#1565c0'},
    'Низкий':     {bg:'#f3e5f5', fg:'#6a1b9a'},
    'Нет данных': {bg:'#f5f5f5', fg:'#999999'},
    'Нет':        {bg:'#f5f5f5', fg:'#999999'}
  };
  for (var i = 0; i < data.length; i++) {
    var c = actColors[data[i][10]] || actColors['Нет данных'];
    s.getRange(i + 2, 11).setBackground(c.bg).setFontColor(c.fg)
      .setFontWeight('bold').setHorizontalAlignment('center');
  }

  // ── РЕЙТИНГ АКТИВНОСТИ ──
  var rRow = data.length + 3;
  s.getRange(rRow, 1, 1, 5).merge()
    .setValue('РЕЙТИНГ АКТИВНОСТИ — ИЮНЬ 2026')
    .setBackground('#1a1a1a').setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(11).setHorizontalAlignment('center');

  s.getRange(rRow + 1, 1, 1, 5)
    .setValues([['Место','Компания','Постов','Топ охват','Профиль контента']])
    .setBackground('#f0f0f0').setFontWeight('bold').setFontSize(10)
    .setHorizontalAlignment('center');

  var rating = [
    [1,'Болид','7','2 130','По теме LUIS+ ✓'],
    [2,'IEK Group','12','1 750','Электротехника / корпоративный'],
    [3,'Рубеж','9','1 150','По теме LUIS+ ✓'],
    [4,'DKC','6','1 050','Электротехника / CSR'],
    [5,'ЭТМ','13','398','Электротовары (не по теме)']
  ];
  var rr = s.getRange(rRow + 2, 1, rating.length, 5);
  rr.setValues(rating).setFontSize(10).setHorizontalAlignment('center');
  for (var i = 0; i < rating.length; i++) {
    s.getRange(rRow + 2 + i, 1, 1, 5).setBackground(i % 2 === 0 ? '#ffffff' : '#f8f8f8');
  }
}

// ═══════════════════════════════════════════════════════════
//  ВКЛАДКА 2 — РАСКЛАДКА (RichText-ссылки, сортировка по охвату ↓)
// ═══════════════════════════════════════════════════════════
function buildRazkladkaSheet(s) {

  var colW = [40, 130, 90, 130, 430, 200, 110, 110];
  colW.forEach(function(w, i) { s.setColumnWidth(i + 1, w); });

  var headers = ['#','Конкурент','Дата','Платформа','Пост / Контент','Тематика','Охват (просм.)','Ссылка'];
  var hRange = s.getRange(1, 1, 1, headers.length);
  hRange.setValues([headers]);
  hRange.setBackground('#1a1a1a').setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(10)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  s.setRowHeight(1, 38);
  s.setFrozenRows(1);

  var TG = {
    'Болид':'https://t.me/bolid_nvp',
    'IEK Group':'https://t.me/iek_group_rus',
    'Рубеж':'https://t.me/rmc_rubezh',
    'DKC':'https://t.me/dkccom',
    'ЭТМ':'https://t.me/etm_company'
  };

  // [Конкурент, Дата, Платформа, Пост, Тематика, Охват, URL]
  var posts = [
    ['Болид','4 июня','Telegram','Семинары по пожарной безопасности и СПЗ — Воронеж, Ростов-на-Дону, Омск','Образование / Нормативы',2130,TG['Болид']],
    ['IEK Group','19 июня','Telegram','«Электродвиж по-татарски» в Уфе — отраслевое мероприятие','Мероприятие / Отрасль',1750,TG['IEK Group']],
    ['Болид','11 июня','Telegram','Биометрический контроллер С2000-BIOAccess-SF5P — распознавание лица и ладони','Продукт / СКУД',1670,TG['Болид']],
    ['IEK Group','июнь','Telegram','Дайджест новинок продукции IEK','Продукт / Дайджест',1670,TG['IEK Group']],
    ['Болид','9 июня','Telegram','Считыватели Proxy-6 нового поколения — MIFARE Plus, криптозащита','Продукт / СКУД',1650,TG['Болид']],
    ['IEK Group','июнь','Telegram','Открытие производственного кластера в Ульяновске','Производство / PR',1580,TG['IEK Group']],
    ['Болид','17–18 июня','Telegram','Благодарность за визит — выставка «Центр безопасности» в Минске','Post-event / PR',1530,TG['Болид']],
    ['IEK Group','19 июня','Telegram','Завершение сбора заявок на облигации серии 001Р-05 на 2,5 млрд ₽','Финансы / Корпоративное',1480,TG['IEK Group']],
    ['Болид','16 июня','Telegram','Видеорегистратор BOLID RGI-12888 — 128 каналов, до 32 Мп','Продукт / Видеонаблюдение',1440,TG['Болид']],
    ['IEK Group','июнь','Telegram','Решение FLITE в телепередаче «Квартирный вопрос»','Продукт / Медиа',1350,TG['IEK Group']],
    ['IEK Group','июнь','Telegram','Форум «ЦОД: модели, сервисы, инфраструктура» в Санкт-Петербурге','Выставка / B2B',1350,TG['IEK Group']],
    ['Болид','16 июня','Telegram','Приглашение на выставку-форум «Центр безопасности» в Минске','Выставка / Анонс',1270,TG['Болид']],
    ['IEK Group','июнь','Telegram','Локализация производства кабель-каналов IMPACT в Ясногорске','Производство / Продукт',1230,TG['IEK Group']],
    ['IEK Group','июнь','Telegram','Коллекция FORTE&PIANO в проекте телепередачи «Дачный ответ»','Продукт / Медиа',1150,TG['IEK Group']],
    ['IEK Group','июнь','Telegram','Расширение линейки разъёмных соединений ARMAFIX CX','Продукт / Электрика',1150,TG['IEK Group']],
    ['IEK Group','июнь','Telegram','Обновление онлайн-калькулятора корпусов FORMAT','Сервис / Продукт',1080,TG['IEK Group']],
    ['DKC','20 июня','Telegram','Благотворительный забег «Бежим вместе» в Технопарке ДКС (донорство костного мозга)','CSR / Корпоративное',1050,TG['DKC']],
    ['Болид','23 июня','Telegram','Анонс бесплатного вебинара по проектированию систем оповещения (СОУЭ)','Образование / Нормативы',1050,TG['Болид']],
    ['Рубеж','июнь','Telegram','Линейка СПЗ GLOBAL RUBEZH — средний уровень системы','Продукт / СПЗ',1000,TG['Рубеж']],
    ['Рубеж','июнь','Telegram','Интервью о линейке оповещателей SONAR','Продукт / Контент',963,TG['Рубеж']],
    ['IEK Group','июнь','Telegram','Конкурс призов (прожектор, лампы, батарейки)','Промо / Сообщество',954,TG['IEK Group']],
    ['Рубеж','10 июня','Telegram','Конференция «Комплексная безопасность объектов» в Самаре (СП 6.13130, СП 484, СП 3.13130)','Мероприятие / Нормативы',939,TG['Рубеж']],
    ['DKC','20 июня','Telegram','Итоги забега «Бежим вместе» — А. Алискеров, А. Смертин','CSR / PR',896,TG['DKC']],
    ['Рубеж','июнь','Telegram','Вопрос эксперту: защита от единичных неисправностей','Экспертиза / Продукт',895,TG['Рубеж']],
    ['Рубеж','17 июня','Telegram','Бесплатный семинар в Челябинске — проектирование на оборудовании РУБЕЖ','Образование / Нормативы',840,TG['Рубеж']],
    ['IEK Group','июнь','Telegram','Приглашение на дизайн-спринт НИТУ МИСИС','Образование / Сообщество',703,TG['IEK Group']],
    ['Рубеж','июнь','Telegram','Линейка СПЗ GLOBAL RUBEZH — нижний уровень системы','Продукт / СПЗ',687,TG['Рубеж']],
    ['Рубеж','июнь','Telegram','Новые световые оповещатели ОПОП T1-R3 и T2-R3','Продукт / СОУЭ',616,TG['Рубеж']],
    ['ЭТМ','25 июня','Telegram','Извещатели пламени «Гелиос» — гибкие настройки, ПО для проектирования','Продукт / Пожарная безопасность',398,TG['ЭТМ']],
    ['DKC','9–10 июня','Telegram','Генеральный спонсор форума «Золотые руки» в Краснодаре (FRAME, YON max, KANT)','Мероприятие / PR',280,TG['DKC']],
    ['Рубеж','июнь','Telegram','10-уровневая ретрансляция в RUBEZH R3','Продукт / Технология',257,TG['Рубеж']],
    ['ЭТМ','25 июня','Telegram','Огнестойкая монтажная пена FIREFORT® B1 — противопожарная защита','Продукт / Пожарная безопасность',74,TG['ЭТМ']]
  ];

  posts.sort(function(a, b) { return b[5] - a[5]; });  // по убыванию охвата

  for (var i = 0; i < posts.length; i++) {
    var row = i + 2;
    var p = posts[i];
    s.setRowHeight(row, 46);
    s.getRange(row, 1).setValue(i + 1);
    s.getRange(row, 2).setValue(p[0]);
    s.getRange(row, 3).setValue(p[1]);
    s.getRange(row, 4).setValue(p[2]);
    s.getRange(row, 5).setValue(p[3]);
    s.getRange(row, 6).setValue(p[4]);
    s.getRange(row, 7).setValue(p[5]);
    setLink(s, row, 8, '→ Открыть', p[6]);          // RichText-ссылка (без #ERROR!)
    s.getRange(row, 8).setHorizontalAlignment('center');
  }

  var dataRange = s.getRange(2, 1, posts.length, 8);
  dataRange.setFontSize(10).setVerticalAlignment('middle')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  // выравнивание служебных колонок
  s.getRange(2, 1, posts.length, 1).setHorizontalAlignment('center');
  s.getRange(2, 3, posts.length, 1).setHorizontalAlignment('center');
  s.getRange(2, 4, posts.length, 1).setHorizontalAlignment('center');
  for (var i = 0; i < posts.length; i++) {
    var c = s.getRange(i + 2, 7).setHorizontalAlignment('center');
    if (posts[i][5] >= 1500) c.setFontWeight('bold');
  }

  // ── ЛЕГЕНДА (та же палитра) ──
  var legRow = posts.length + 4;
  s.getRange(legRow, 1, 1, 4).merge()
    .setValue('ЛЕГЕНДА — ОХВАТ (ПРОСМОТРЫ)')
    .setBackground('#1a1a1a').setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');

  var legend = [
    ['≥ 2 000 — Высокий охват', PALETTE.high],
    ['1 500 – 1 999 — Хороший',  PALETTE.good],
    ['1 000 – 1 499 — Средний',  PALETTE.mid],
    ['500 – 999 — Ниже среднего', PALETTE.low],
    ['< 500 — Низкий',           PALETTE.min],
    ['Нет данных об охвате',     PALETTE.none]
  ];
  legend.forEach(function(item, i) {
    s.getRange(legRow + 1 + i, 1, 1, 4).merge()
      .setValue(item[0]).setBackground(item[1])
      .setFontSize(10).setHorizontalAlignment('center');
  });
}

// ═══════════════════════════════════════════════════════════
//  ЕДИНАЯ ПАЛИТРА ДЛЯ ВСЕХ ЛИСТОВ «Раскладка*»
//  Авто-находит листы по названию, определяет колонку охвата
//  по заголовку («Охват» / «Просмотры») и перекрашивает строки.
// ═══════════════════════════════════════════════════════════
function unifyRazkladkaPalette(ss) {
  var processed = [];
  ss.getSheets().forEach(function(sh) {
    if (sh.getName().toLowerCase().indexOf('раскладка') < 0) return;
    if (recolorRazkladka(sh)) processed.push(sh.getName());
  });
  return processed;
}

function recolorRazkladka(s) {
  var lastCol = s.getLastColumn();
  var lastRow = s.getLastRow();
  if (lastCol < 2 || lastRow < 2) return false;

  // 1) найти колонку охвата по заголовку
  var header = s.getRange(1, 1, 1, lastCol).getValues()[0];
  var reachCol = -1;
  for (var i = 0; i < header.length; i++) {
    var h = String(header[i]).toLowerCase();
    if (h.indexOf('хват') >= 0 || h.indexOf('росмотр') >= 0) { reachCol = i + 1; break; }
  }
  if (reachCol < 0) return false;

  // 2) единый стиль заголовка
  s.getRange(1, 1, 1, lastCol)
    .setBackground('#1a1a1a').setFontColor('#ffffff').setFontWeight('bold');

  // 3) перекрасить строки данных по охвату
  var names  = s.getRange(1, 1, lastRow, 1).getValues();
  var reaches = s.getRange(1, reachCol, lastRow, 1).getValues();
  for (var r = 2; r <= lastRow; r++) {
    var nm = names[r - 1][0];
    if (nm === '' || nm === null) break;                  // конец таблицы данных
    if (/ПРОСМОТР|ПЛАТФОРМА|ЛЕГЕНД|ОХВАТ|^≥|^</i.test(String(nm))) break; // начался блок легенды
    s.getRange(r, 1, 1, lastCol).setBackground(bgForReach(reaches[r - 1][0]));
  }
  return true;
}
