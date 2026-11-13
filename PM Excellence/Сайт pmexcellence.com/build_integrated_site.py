# -*- coding: utf-8 -*-
"""Вписывает правки кризисного аудита в текущий сайт pmexcellence.com,
сохраняя его дизайн. Результат — pmexcellence_с_правками.html."""
import re

SRC = "site_index_raw.html"
OUT = "pmexcellence_с_правками.html"
BASE = "https://pmexcellence.com"

html = open(SRC, encoding="utf-8").read()

# ---------------------------------------------------------------------------
# Правка №5 — заменить токсичные цитаты на уверенные (в том же стиле слайдера).
# Заменяем строку целиком: она встречается и в тексте, и в alt изображения.
# ---------------------------------------------------------------------------
toxic1 = "«В управлении проектами нет гарантий. Но есть проверенные методы работы, которые повышают вероятность успеха.»"
fixed1 = "«Мы берём ответственность за результат. Часть нашего гонорара привязана к тому, что проект сдан в срок и в бюджет.»"

toxic2 = "«Искусство управления проектом: видеть цель, верить в себя, не замечать препятствий.»"
fixed2 = "«Искусство управления проектом — довести до результата: в срок, в бюджете, с управляемыми рисками.»"

assert toxic1 in html, "не найдена цитата 1"
assert toxic2 in html, "не найдена цитата 2"
html = html.replace(toxic1, fixed1)
html = html.replace(toxic2, fixed2)

# ---------------------------------------------------------------------------
# Правка №2 — единый email. В schema.org остался старый info@pmce.ru.
# ---------------------------------------------------------------------------
html = html.replace("info@pmce.ru", "pmc@pmexcellence.com")

# ---------------------------------------------------------------------------
# Правки №8 (Success Fee) и №9 (Кому подходим) + единый CTA (№6).
# Новые секции в родной вёрстке сайта (.content) и фирменной палитре #852a34,
# вставляем перед блоком «Примеры проектов».
# ---------------------------------------------------------------------------
new_sections = '''
<!-- ==== ПРАВКА АУДИТА №3: ключевое обещание (H1-заявление) ==== -->
<section class="pmx-claim">
    <div class="pmx-wrap">
        <p class="pmx-claim__text">Берём управление вашим проектом.<br><span>Сроки и&nbsp;бюджет&nbsp;&mdash; под нашим контролем.</span></p>
    </div>
</section>

<!-- ==== ПРАВКА АУДИТА №8: Success Fee (вынесен на видное место) ==== -->
<section class="pmx-fee">
    <div class="pmx-wrap">
        <div class="pmx-fee__grid">
            <div class="pmx-fee__head">
                <span class="pmx-eyebrow">Как мы работаем</span>
                <h2 class="pmx-h2">Один центр ответственности за весь проект</h2>
            </div>
            <div class="pmx-fee__body">
                <p>Мы&nbsp;берём на&nbsp;себя планирование, подрядчиков, сроки и&nbsp;бюджет&nbsp;&mdash; от&nbsp;старта до&nbsp;сдачи объекта. Вы&nbsp;ведёте дела с&nbsp;одной командой, а&nbsp;не&nbsp;с&nbsp;десятком подрядчиков. Так <b>мы&nbsp;отвечаем за&nbsp;итог вместе с&nbsp;вами</b>.</p>
                <a class="pmx-btn" href="mailto:pmc@pmexcellence.com">Обсудить ваш проект &rarr;</a>
            </div>
        </div>
    </div>
</section>

<!-- ==== ПРАВКА АУДИТА №9: Кому подходим (квалификатор лидов) ==== -->
<section class="pmx-fit">
    <div class="pmx-wrap">
        <div class="pmx-fit__head">
            <span class="pmx-eyebrow">Профиль проекта</span>
            <h2 class="pmx-h2">Кому подходит PM Excellence</h2>
        </div>
        <div class="pmx-fit__grid">
            <div class="pmx-fit__card">
                <div class="pmx-fit__label">Бюджет проекта</div>
                <div class="pmx-fit__val">от 1&nbsp;млрд&nbsp;&#8381;</div>
            </div>
            <div class="pmx-fit__card">
                <div class="pmx-fit__label">Отрасли</div>
                <div class="pmx-fit__val">Нефтегаз, девелопмент, промышленность, инфраструктура</div>
            </div>
            <div class="pmx-fit__card">
                <div class="pmx-fit__label">Стадия</div>
                <div class="pmx-fit__val">Планирование, реализация или антикризисное управление</div>
            </div>
        </div>
    </div>
</section>
'''

anchor = '<div class="experience-block">'
assert anchor in html, "не найден якорь experience-block"
html = html.replace(anchor, new_sections + "\n" + anchor, 1)

# ---------------------------------------------------------------------------
# Финальный CTA перед футером (закрывающий блок конверсии, правка №6).
# ---------------------------------------------------------------------------
final_cta = '''
<!-- ==== ПРАВКА АУДИТА №6: финальный CTA (закрывающий блок) ==== -->
<section class="pmx-final">
    <div class="pmx-wrap">
        <h2 class="pmx-final__h">Расскажите о вашем проекте</h2>
        <p>Ответим в&nbsp;течение рабочего дня и&nbsp;предложим формат участия&nbsp;&mdash; от&nbsp;отдельной экспертизы до&nbsp;полного управления.</p>
        <a class="pmx-btn" href="mailto:pmc@pmexcellence.com">Обсудить ваш проект &rarr;</a>
    </div>
</section>
'''
foot_anchor = '<footer'
assert foot_anchor in html, "не найден футер"
html = html.replace(foot_anchor, final_cta + "\n" + foot_anchor, 1)

# ---------------------------------------------------------------------------
# Стили новых блоков — строго в палитре сайта (#852a34 / #6b1e27).
# ---------------------------------------------------------------------------
pmx_css = '''
<style id="pmx-additions">
.pmx-preview-bar{background:#852a34;color:#fff;text-align:center;
  font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:12px;
  letter-spacing:1.2px;text-transform:uppercase;padding:7px 12px;font-weight:600}
.pmx-eyebrow{display:inline-block;font-family:-apple-system,'Segoe UI',Arial,sans-serif;
  font-size:12px;letter-spacing:2.2px;text-transform:uppercase;color:#852a34;
  font-weight:700;margin-bottom:16px}
.pmx-wrap{max-width:1200px;margin:0 auto;padding:0 30px}
/* Ключевое обещание */
.pmx-claim{background:#fff;color:#222;padding:66px 0;text-align:center;border-top:1px solid #ededed;border-bottom:1px solid #ededed}
.pmx-claim__text{position:relative;font-size:40px;line-height:1.3;font-weight:700;margin:0;letter-spacing:-.3px;color:#222;padding-top:30px}
.pmx-claim__text:before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:64px;height:4px;background:#852a34}
.pmx-claim__text span{color:#852a34}
.pmx-h2{position:relative;font-size:34px;line-height:1.25;font-weight:700;color:#222;margin:0 0 22px;padding-bottom:16px}
.pmx-h2:after{content:'';position:absolute;left:0;bottom:0;width:76px;height:4px;background:#852a34}
.pmx-btn{display:inline-block;margin-top:26px;background:#852a34;color:#fff;
  font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:16px;font-weight:600;
  padding:15px 32px;border-radius:3px;text-decoration:none;transition:background .2s}
.pmx-btn:hover{background:#6b1e27;color:#fff}
/* Success Fee */
.pmx-fee{background:linear-gradient(90deg,rgba(250,248,247,.86) 0%,rgba(250,248,247,.48) 58%,rgba(250,248,247,.20) 100%),url(pmx_bg_megaproject.jpg) center right/cover no-repeat;padding:88px 0;border-top:1px solid #ededed;border-bottom:1px solid #ededed}
.pmx-fee__grid{display:flex;gap:56px;align-items:center;flex-wrap:wrap}
.pmx-fee__head{flex:1 1 340px}
.pmx-fee__body{flex:1 1 420px}
.pmx-fee__body p{font-size:19px;line-height:1.65;color:#454545;margin:0}
.pmx-fee__body b{color:#222}
/* Кому подходим */
.pmx-fit{padding:72px 0}
.pmx-fit__head{margin-bottom:40px}
.pmx-fit__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.pmx-fit__card{border:1px solid #e6e6e6;border-left:3px solid #852a34;
  padding:32px 28px;border-radius:3px;transition:box-shadow .2s,transform .2s}
.pmx-fit__card:hover{box-shadow:0 10px 30px rgba(133,42,52,.10);transform:translateY(-3px)}
.pmx-fit__label{font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:13px;
  letter-spacing:1px;text-transform:uppercase;color:#929291;font-weight:600;margin-bottom:12px}
.pmx-fit__val{font-size:22px;line-height:1.35;color:#222;font-weight:600}
/* Финальный CTA */
.pmx-final{background:#faf8f7;border-top:1px solid #ededed;padding:80px 0;text-align:center}
.pmx-final__h{display:inline-block;font-size:34px;line-height:1.2;font-weight:700;color:#222;margin:0 0 14px}
.pmx-final p{font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:18px;color:#565656;margin:0 auto 6px;max-width:560px}
@media(max-width:900px){
  .pmx-final__h{font-size:26px}
  .pmx-claim__text{font-size:25px}
  .pmx-h2{font-size:26px}
  .pmx-fit__grid{grid-template-columns:1fr}
  .pmx-fee__grid{gap:28px}
}
</style>
'''
html = html.replace("</head>", pmx_css + "\n</head>", 1)

# Плашка статуса (мета-элемент для согласования, вне дизайна сайта).
bar = '<div class="pmx-preview-bar">Предпросмотр правок для согласования &middot; pmexcellence.com &middot; интеграция кризисного аудита (июнь 2026)</div>\n'
html = html.replace('<div class="panel">', bar + '<div class="panel">', 1)

# ---------------------------------------------------------------------------
# Переписать корневые ссылки на абсолютные, чтобы макет открывался локально
# (CSS, шрифты, изображения и внутренние страницы грузились с боевого сайта).
# ---------------------------------------------------------------------------
# "/..." после кавычки или скобки url() -> абсолютный адрес (кроме "//").
html = re.sub(r'(["\'(])/(?!/)', r'\1' + BASE + '/', html)

open(OUT, "w", encoding="utf-8").write(html)
print("OK ->", OUT, len(html), "байт")
