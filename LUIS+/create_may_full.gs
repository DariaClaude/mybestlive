/**
 * Создаёт новую Google Таблицу «Соцсети конкурентов МАЙ 2026 / LUIS+»
 * с двумя вкладками и гиперссылками — точно как апрельская таблица.
 *
 * КАК ЗАПУСТИТЬ:
 * 1. Открой любую Google Таблицу
 * 2. Расширения → Apps Script
 * 3. Вставь этот код (замени всё, что там есть)
 * 4. Нажми ▶ Run → выбери createMaySpreadsheet
 * 5. Скрипт создаст новый файл и покажет ссылку
 */

function createMaySpreadsheet() {
  var ss = SpreadsheetApp.create('Соцсети конкурентов МАЙ 2026 / LUIS+');
  var url = ss.getUrl();

  var mainSheet = ss.getSheets()[0];
  mainSheet.setName('Май 2026');

  var razSheet = ss.insertSheet('Раскладка май 2026');

  buildMainSheet(mainSheet);
  buildRazkladkaSheet(razSheet);

  ss.setActiveSheet(mainSheet);

  Logger.log('✅ Готово: ' + url);
  try {
    SpreadsheetApp.getUi().alert('✅ Таблица создана!\n\n' + url);
  } catch(e) {
    Logger.log(url);
  }
}

// ═══════════════════════════════════════════════════════════
//  ВКЛАДКА 1 — СВОДНАЯ ТАБЛИЦА
// ═══════════════════════════════════════════════════════════
function buildMainSheet(s) {

  // --- Ширины колонок ---
  s.setColumnWidth(1, 40);
  s.setColumnWidth(2, 155);
  s.setColumnWidth(3, 140);
  s.setColumnWidth(4, 145);
  s.setColumnWidth(5, 95);
  s.setColumnWidth(6, 140);
  s.setColumnWidth(7, 95);
  s.setColumnWidth(8, 140);
  s.setColumnWidth(9, 90);
  s.setColumnWidth(10, 115);
  s.setColumnWidth(11, 95);
  s.setColumnWidth(12, 130);
  s.setColumnWidth(13, 400);

  // --- Заголовок ---
  var headers = ['№','Конкурент','Сайт','Telegram','Посты TG май',
                 'ВКонтакте','Посты VK май','YouTube','Видео май',
                 'Другие соцсети','Всего постов май','Уровень активности',
                 'Ключевые темы мая'];
  var hRange = s.getRange(1,1,1,headers.length);
  hRange.setValues([headers]);
  hRange.setBackground('#1a1a1a');
  hRange.setFontColor('#ffffff');
  hRange.setFontWeight('bold');
  hRange.setFontSize(10);
  hRange.setHorizontalAlignment('center');
  hRange.setVerticalAlignment('middle');
  s.setRowHeight(1, 36);
  s.setFrozenRows(1);

  // --- Данные (без формул) ---
  var data = [
    [1,'Аргус-Спектр','argus-spectr.ru','@argus_spectr','~15+','—','—','StreletzTV','Есть','—','15+','Высокий',
     'Продолжение серии StreletzGPT (ИИ-ассистент); Deco Line — дизайнерская противопожарная продукция; Стрелец-V-ПРО; вебинары по СП 3.13130.2026 и СП 6.13130; итоги участия в выставке (сайт 27 апр.)'],

    [2,'Рубеж (RUBEZH)','rubezh.pro','@rmc_rubezh','~12','vk.com/vpk.rubezh','Есть','RUBEZH YouTube','Есть','МАКС','12+','Высокий',
     'Запуск официального канала на платформе МАКС (1 780 просм.) — первый из профильных конкурентов; вебинары СП 3.13130.2026 и СП 6.13130; обновления R-PLATFORMA; обучение по городам'],

    [3,'Болид (НВП)','bolid.ru','@bolid_nvp','~5','—','—','НВП Болид YouTube','Есть','—','5+','Средний',
     'Итоги выставки: 2 500+ гостей на стенде (28 апр.); семинары по нормам СПЗ; цифровая маркировка «Честный знак»; обновление АРМ «Орион Икс» v1.2.0'],

    [4,'ДССЛ / TRASSIR','dssl.ru','@trassir (закрытый)','—','—','—','—','—','—','—','Низкий',
     'Технические обновления сайта: TRASSIR Pro v3; PoE-коммутаторы L3; мониторы ECO/PRO — продуктовые релизы без медиа-активности'],

    [5,'ISS','iss.ru','@iss_ru','2','—','—','ISS YouTube','Есть','—','2','Низкий',
     'SecurOS включён в реестр Минпромторга РФ (573 просм.) — аргумент для КИИ и госсектора; новый релиз SecurOS 12.1 (558 просм.)'],

    [6,'Layta','layta.ru','Не найден','—','—','—','—','—','—','0','Нет','Публичной активности не выявлено'],
    [7,'МСБ','—','—','—','—','—','—','—','—','0','Нет','Публичной активности не выявлено'],

    [8,'Parsec','parsec.ru','—','—','—','—','Parsec Academy','—','МАКС','0','Низкий',
     'Parsec запустил резервный канал в МАКС (апрель); технические публикации на сайте'],

    [9,'Эридан','eridan.ru','Не найден','—','—','—','—','—','—','0','Нет','Публичной активности не выявлено'],

    [10,'ЭТМ','etm.ru','@etm_company','4+','Есть','Есть','—','—','Facebook','5+','Активен',
     'Стабильная контент-активность: электрооборудование; акции; вебинары'],

    [11,'Русский Свет','russvet.ru','@russvet_official','4+','—','—','—','—','Instagram','4+','Средний',
     'Акции и спецпредложения; форумы по электромонтажу; региональные мероприятия'],

    [12,'Tinko','tinko.ru','Не найден','—','—','—','—','—','Facebook','0','Нет','Публичной активности не выявлено'],
    [13,'САТРО-ПАЛАДИН','satro-paladin.com','Не найден','—','—','—','—','—','—','0','Нет','Публичной активности не выявлено'],
    [14,'ТК РУТЕК','rutek-group.ru','Не найден','—','—','—','—','—','—','0','Нет','Публичной активности не выявлено'],
    [15,'ДЕАН','dean.ru','Не найден','—','—','—','—','—','—','0','Нет','Публичной активности не выявлено'],
    [16,'ГАРАНТ (ТД)','garantgroup.com','Не найден','—','—','—','—','—','—','0','Нет','Публичной активности не выявлено'],
    [17,'Hikvision','hikvision.ru','@hikvisionrussia (мёртв с 2022)','0','—','—','—','—','—','0','Нет','Ушли с рынка РФ. Активности нет'],

    [18,'Macroscop','macroscop.com','Не найден','—','—','—','MACROSCOP YouTube','—','—','0','Низкий',
     'Macroscop 4.4 — интеграции Sigur, аналитика СИЗ; публикации на сайте партнёров'],

    [19,'Твинпро','twinpro.ru','Не найден','—','—','—','—','—','—','0','Нет','Публичной активности не выявлено'],
    [20,'WAGNER','wagner-alarm.de','Не найден','—','—','—','—','—','—','0','Нет','Активности в РФ нет'],

    [21,'DKC','dkc.ru','@dkccom','~6','—','—','—','—','—','6+','Активен',
     'Клеммы Nuputuk — сертификаты пожарной безопасности (2 060 просм.); щитки Frame × Петрович (1 880 просм.); вебинары; конвенция дилеров'],

    [22,'IEK GROUP','iek.ru','@iek_group_rus','~6','vk.com/iek_group','Есть','IEK YouTube','Есть','Dzen','8+','Активен',
     'DCDE 2026 Forum — итоги (2 320 просм., топ-пост мая); серия вебинаров по электрике (1 800 просм.); активен в TG + ВК + YouTube + Dzen']
  ];

  var dataRange = s.getRange(2, 1, data.length, 13);
  dataRange.setValues(data);
  dataRange.setFontSize(10);
  dataRange.setVerticalAlignment('top');
  dataRange.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  // Чередование строк
  for (var i = 0; i < data.length; i++) {
    s.getRange(i+2, 1, 1, 13).setBackground(i%2===0 ? '#ffffff' : '#f8f8f8');
    s.setRowHeight(i+2, 52);
  }

  // --- Гиперссылки: Сайт (кол.3) ---
  var siteLinks = {
    'argus-spectr.ru':'https://argus-spectr.ru',
    'rubezh.pro':'https://rubezh.pro',
    'bolid.ru':'https://bolid.ru',
    'dssl.ru':'https://dssl.ru',
    'iss.ru':'https://iss.ru',
    'layta.ru':'https://layta.ru',
    'parsec.ru':'https://parsec.ru',
    'eridan.ru':'https://eridan.ru',
    'etm.ru':'https://etm.ru',
    'russvet.ru':'https://russvet.ru',
    'tinko.ru':'https://tinko.ru',
    'satro-paladin.com':'https://satro-paladin.com',
    'rutek-group.ru':'https://rutek-group.ru',
    'dean.ru':'https://dean.ru',
    'garantgroup.com':'https://garantgroup.com',
    'hikvision.ru':'https://hikvision.ru',
    'macroscop.com':'https://macroscop.com',
    'twinpro.ru':'https://twinpro.ru',
    'wagner-alarm.de':'https://wagner-alarm.de',
    'dkc.ru':'https://dkc.ru',
    'iek.ru':'https://iek.ru'
  };

  // --- Гиперссылки: Telegram (кол.4) ---
  var tgLinks = {
    '@argus_spectr':'https://t.me/argus_spectr',
    '@rmc_rubezh':'https://t.me/rmc_rubezh',
    '@bolid_nvp':'https://t.me/bolid_nvp',
    '@iss_ru':'https://t.me/iss_ru',
    '@etm_company':'https://t.me/etm_company',
    '@russvet_official':'https://t.me/russvet_official',
    '@dkccom':'https://t.me/dkccom',
    '@iek_group_rus':'https://t.me/iek_group_rus'
  };

  // --- Гиперссылки: VK (кол.6) ---
  var vkLinks = {
    'vk.com/vpk.rubezh':'https://vk.com/vpk.rubezh',
    'vk.com/iek_group':'https://vk.com/iek_group'
  };

  // Применяем гиперссылки
  for (var i = 0; i < data.length; i++) {
    var row = i + 2;
    var site = data[i][2];
    var tg   = data[i][3];
    var vk   = data[i][5];

    if (siteLinks[site]) {
      s.getRange(row,3).setFormula('=HYPERLINK("'+siteLinks[site]+'","'+site+'")');
    }
    if (tgLinks[tg]) {
      s.getRange(row,4).setFormula('=HYPERLINK("'+tgLinks[tg]+'","'+tg+'")');
    }
    if (vkLinks[vk]) {
      s.getRange(row,6).setFormula('=HYPERLINK("'+vkLinks[vk]+'","'+vk+'")');
    }
  }

  // --- Цвет "Уровень активности" (кол.12) ---
  var actColors = {
    'Высокий': {bg:'#e8f5e9', fg:'#2e7d32'},
    'Средний':  {bg:'#fff8e1', fg:'#e65100'},
    'Активен':  {bg:'#e3f2fd', fg:'#1565c0'},
    'Низкий':   {bg:'#f3e5f5', fg:'#6a1b9a'},
    'Нет':      {bg:'#f5f5f5', fg:'#999999'}
  };
  for (var i = 0; i < data.length; i++) {
    var c = actColors[data[i][11]] || actColors['Нет'];
    s.getRange(i+2, 12)
      .setBackground(c.bg).setFontColor(c.fg)
      .setFontWeight('bold').setHorizontalAlignment('center');
  }

  // --- Рейтинг активности ---
  var rRow = data.length + 3;
  var rt = s.getRange(rRow, 1, 1, 8);
  rt.merge().setValue('РЕЙТИНГ АКТИВНОСТИ — МАЙ 2026')
    .setBackground('#1a1a1a').setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(11).setHorizontalAlignment('center');

  s.getRange(rRow+1, 1, 1, 8)
    .setValues([['Место','Компания','Telegram','VK','YouTube','Другие','Всего постов','Топ охват']])
    .setBackground('#f0f0f0').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');

  var ratingData = [
    [1,'Аргус-Спектр','15+ постов','—','Есть','—','15+','—'],
    [2,'Рубеж (RUBEZH)','12+ постов','Есть','Есть','МАКС','12+','1 780 просм.'],
    [3,'DKC','6+ постов','—','—','—','6+','2 060 просм.'],
    [4,'IEK GROUP','6+ постов','Есть','Есть','Dzen','8+','2 320 просм.'],
    [5,'ЭТМ','4+ постов','Есть','—','Facebook','5+','—'],
    [6,'Русский Свет','4+ постов','—','—','Instagram','4+','—'],
    [7,'Болид (НВП)','5 постов','—','Есть','—','5+','—'],
    [8,'ISS','2 поста','—','Есть','—','2','573 просм.']
  ];
  var rrng = s.getRange(rRow+2, 1, ratingData.length, 8);
  rrng.setValues(ratingData).setFontSize(10).setHorizontalAlignment('center');
  for (var i=0; i<ratingData.length; i++) {
    s.getRange(rRow+2+i, 1, 1, 8).setBackground(i%2===0?'#ffffff':'#f8f8f8');
  }
}

// ═══════════════════════════════════════════════════════════
//  ВКЛАДКА 2 — РАСКЛАДКА
// ═══════════════════════════════════════════════════════════
function buildRazkladkaSheet(s) {

  s.setColumnWidth(1, 145);
  s.setColumnWidth(2, 130);
  s.setColumnWidth(3, 120);
  s.setColumnWidth(4, 380);
  s.setColumnWidth(5, 110);
  s.setColumnWidth(6, 110);
  s.setColumnWidth(7, 160);

  var headers = ['Компания','Платформа','Дата','Тема поста / публикации','Просмотры','Ссылка','Тематика'];
  var hRange = s.getRange(1,1,1,7);
  hRange.setValues([headers]);
  hRange.setBackground('#1a1a1a').setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(10)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  s.setRowHeight(1, 36);
  s.setFrozenRows(1);

  // --- Данные раскладки ---
  // Формат: [Компания, Платформа, Дата, Тема, Просмотры, URL_ссылки, Тематика]
  var posts = [
    // Топ с просмотрами
    ['IEK GROUP',    'Telegram',      'Май 2026', 'DCDE 2026 Forum — главные итоги участия',                             '2 320', 'https://t.me/iek_group_rus', 'Другая выставка ★'],
    ['DKC',          'Telegram',      'Май 2026', 'Клеммы Nuputuk — получены сертификаты пожарной безопасности',          '2 060', 'https://t.me/dkccom',        'Продукт'],
    ['DKC',          'Telegram',      'Май 2026', 'Щитки Frame × сеть Петрович — партнёрское видео B2C-дистрибьютора',   '1 880', 'https://t.me/dkccom',        'Партнёрство'],
    ['IEK GROUP',    'Telegram',      'Май 2026', 'Серия вебинаров по электрике для инженерной аудитории',               '1 800', 'https://t.me/iek_group_rus', 'Обучение'],
    ['Рубеж',        'МАКС (новый)',  'Май 2026', 'Запуск официального канала на платформе МАКС',                        '1 780', 'https://t.me/rmc_rubezh',   'Новая платформа ★'],
    ['ISS',          'Telegram',      'Апр / Май', 'SecurOS включён в реестр Минпромторга РФ',                           '573',   'https://t.me/iss_ru',        'Продукт / Реестр'],
    ['ISS',          'Telegram',      'Апр / Май', 'Новый релиз SecurOS 12.1',                                           '558',   'https://t.me/iss_ru',        'Продукт'],
    // Активность без данных по охвату
    ['Аргус-Спектр', 'Telegram',      'Май 2026', 'Серия StreletzGPT — кейсы и обновления ИИ-ассистента',               '—',     'https://t.me/argus_spectr',  'Продукт / Инновация'],
    ['Аргус-Спектр', 'Telegram',      'Май 2026', 'Deco Line — дизайнерская противопожарная продукция',                  '—',     'https://t.me/argus_spectr',  'Продукт'],
    ['Аргус-Спектр', 'Telegram',      'Май 2026', 'Стрелец-V-ПРО — вебинары и разборы применения',                      '—',     'https://t.me/argus_spectr',  'Продукт / Обучение'],
    ['Аргус-Спектр', 'Сайт',         'Май 2026', 'Вебинары по СП 3.13130.2026 и СП 6.13130',                           '—',     'https://argus-spectr.ru',    'Нормативы / Обучение'],
    ['Рубеж',        'Telegram',      'Май 2026', 'Серия вебинаров по СП 3.13130.2026 — разборы для проектировщиков',   '—',     'https://t.me/rmc_rubezh',   'Обучение'],
    ['Рубеж',        'Telegram',      'Май 2026', 'Обновления R-PLATFORMA — новые функции и интеграции',                 '—',     'https://t.me/rmc_rubezh',   'Продукт'],
    ['Рубеж',        'VK + YouTube',  'Май 2026', 'Обучающий контент и технические разборы',                             '—',     'https://vk.com/vpk.rubezh', 'Обучение'],
    ['Болид',        'Telegram',      'Май 2026', 'Семинары по нормам СПЗ в регионах',                                  '—',     'https://t.me/bolid_nvp',    'Обучение'],
    ['Болид',        'Telegram',      'Май 2026', 'Цифровая маркировка «Честный знак» — подготовка производителей',      '—',     'https://t.me/bolid_nvp',    'Отрасль'],
    ['Болид',        'Сайт',         'Май 2026', 'Итоги выставки: 2 500+ гостей на стенде — официальный отчёт',         '—',     'https://bolid.ru',          'Итоги'],
    ['ЭТМ',          'Telegram',      'Май 2026', 'Акции и спецпредложения на электрооборудование',                      '—',     'https://t.me/etm_company',  'Продукт / Акция'],
    ['ЭТМ',          'Telegram',      'Май 2026', 'Вебинары партнёров — обучение по продуктам',                          '—',     'https://t.me/etm_company',  'Обучение'],
    ['ЭТМ',          'VK + Facebook', 'Май 2026', 'Контент-активность без привязки к теме безопасности',                '—',     'https://etm.ru',            'Общий контент'],
    ['Русский Свет', 'Telegram',      'Май 2026', 'Акции и спецпредложения; форумы по электромонтажу',                  '—',     'https://t.me/russvet_official','Продукт / Акция'],
    ['ДССЛ/TRASSIR', 'Сайт',         'Май 2026', 'TRASSIR Pro v3; PoE-коммутаторы L3; мониторы ECO/PRO — релизы',      '—',     'https://dssl.ru',           'Продукт'],
    ['Macroscop',    'Сайт',         'Май 2026', 'Macroscop 4.4 — интеграции Sigur, аналитика СИЗ',                    '—',     'https://macroscop.com',     'Продукт']
  ];

  // Записываем данные
  for (var i = 0; i < posts.length; i++) {
    var row = i + 2;
    var p = posts[i];
    s.setRowHeight(row, 44);

    // Текстовые поля
    s.getRange(row,1).setValue(p[0]);
    s.getRange(row,2).setValue(p[1]);
    s.getRange(row,3).setValue(p[2]);
    s.getRange(row,4).setValue(p[3]);
    s.getRange(row,5).setValue(p[4]);
    s.getRange(row,7).setValue(p[6]);

    // Ссылка с гиперссылкой
    s.getRange(row,6).setFormula('=HYPERLINK("'+p[5]+'","→ Открыть")');
    s.getRange(row,6).setFontColor('#1565c0').setHorizontalAlignment('center');
  }

  var dataRange = s.getRange(2, 1, posts.length, 7);
  dataRange.setFontSize(10).setVerticalAlignment('middle')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  // Цвет строк по просмотрам + чередование
  var viewBg = function(viewsStr) {
    var v = parseInt(viewsStr.replace(/\s/g,''));
    if (isNaN(v)) return '#f9f9f9';
    if (v >= 2000) return '#e8f5e9';
    if (v >= 1500) return '#fff8e1';
    if (v >= 1000) return '#f3e5f5';
    if (v >= 500)  return '#e3f2fd';
    return '#f5f5f5';
  };

  for (var i = 0; i < posts.length; i++) {
    var bg = viewBg(posts[i][4]);
    s.getRange(i+2, 1, 1, 7).setBackground(bg);
  }

  // Колонка "Просмотры" — выравнивание по центру, жирный для топа
  for (var i = 0; i < posts.length; i++) {
    var cell = s.getRange(i+2, 5);
    cell.setHorizontalAlignment('center');
    var v = parseInt(posts[i][4].replace(/\s/g,''));
    if (v >= 1500) cell.setFontWeight('bold');
  }

  // --- Разделитель: "АКТИВНОСТЬ БЕЗ ДАННЫХ ПО ОХВАТУ" ---
  var sepRow = 9; // после 7 постов с просмотрами + 1 строка заголовка + 1 разделитель
  s.getRange(sepRow, 1, 1, 7).merge()
    .setValue('АКТИВНОСТЬ МАЯ — ДАННЫЕ ПО ОХВАТУ НЕДОСТУПНЫ (САЙТЫ, ЗАКРЫТЫЕ КАНАЛЫ)')
    .setBackground('#424242').setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(10)
    .setHorizontalAlignment('center');

  // --- Легенда ---
  var legRow = posts.length + 4;
  s.getRange(legRow, 1, 1, 4).merge()
    .setValue('ЛЕГЕНДА — ПРОСМОТРЫ')
    .setBackground('#1a1a1a').setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');

  var legend = [
    ['≥ 2 000 просм.', '#e8f5e9'],
    ['1 500 – 1 999',  '#fff8e1'],
    ['1 000 – 1 499',  '#f3e5f5'],
    ['500 – 999',      '#e3f2fd'],
    ['< 500',          '#f5f5f5'],
    ['Нет данных',     '#f9f9f9']
  ];
  legend.forEach(function(item, i) {
    var r = s.getRange(legRow+1+i, 1, 1, 4);
    r.merge().setValue(item[0]).setBackground(item[1])
      .setFontSize(10).setHorizontalAlignment('center');
  });
}
