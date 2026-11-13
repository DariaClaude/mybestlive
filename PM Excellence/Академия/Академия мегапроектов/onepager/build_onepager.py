# -*- coding: utf-8 -*-
import re, html
css_all = open('aka.css', encoding='utf-8').read()
blocks = css_all.split('\n\n/* ===== */\n\n')
base_css = blocks[0] + '\n' + blocks[1]          # активные слои: aka-page + premium-refresh
content = open('content.html', encoding='utf-8').read()

# ---- CSS: пути к ассетам, убрать крошки ----
base_css = base_css.replace("url('hero-academy-clean.png')", "url('assets/hero-academy.jpg')")
for i in range(1, 5):
    base_css = base_css.replace(f"url('academy-icon-goldglass-{i}.png')", f"url('assets/who-{i}.png')")
base_css = re.sub(r'/\* ---------- BREADCRUMBS ---------- \*/\n\.aka-crumbs\{[^}]*\}\n', '', base_css)
base_css = base_css.replace("font-family:var(--aka-sans)", "font-family:var(--aka-sans)")

# ---- CONTENT ----
content = content.split('<!-- ===== ФУТЕР')[0]
# крошки
content = re.sub(r'\s*<div class="aka-crumbs".*?</div>\n', '\n', content, flags=re.S)
content = content.replace('<div class="aka-hero__brand" style="margin-top:34px">', '<div class="aka-hero__brand">')
# фото
photos = {
 'https://pmexcellence.com/upload/resize_cache/iblock/6c4/261_261_2/ktrb8reqc3923c503uphhmextm1s82ui.jpg': 'assets/kutuzov.jpg',
 'https://pmexcellence.com/upload/resize_cache/iblock/cd3/261_261_2/pqa7knt15na3m9lnd4p3weo4q13icqan.jpg': 'assets/cheremisin.jpg',
 'https://pmexcellence.com/upload/resize_cache/iblock/af0/261_261_2/z50hv21qzguqsqfgnbpc6xezxuejccuj.jpg': 'assets/kochetov.jpg',
 'https://pmexcellence.com/upload/resize_cache/iblock/e6a/261_261_2/e6a6a63d78543fc6c3cea3a572315a7b.jpg': 'assets/baranov.jpg',
 'assets/team-pavel-lavrentev.jpg': 'assets/lavrentev.jpg',
 'assets/team-evgeniy-pikulev.jpg': 'assets/pikulev.jpg',
 'assets/team-ivan-smirnov.jpg': 'assets/smirnov.jpg',
 'assets/team-sergey-shtanko.jpg': 'assets/shtanko.jpg',
 'assets/team-aleksandr-shaturnyy.jpg': 'assets/shaturnyy.jpg',
}
for a, b in photos.items():
    content = content.replace(f'src="{a}"', f'src="{b}" loading="lazy"')
# якоря секций
content = content.replace('<section class="aka-section">\n        <div class="aka-wrap">\n            <div class="aka-eyebrow">Исходная ситуация</div>',
                          '<section class="aka-section" id="about">\n        <div class="aka-wrap">\n            <div class="aka-eyebrow">Исходная ситуация</div>')
content = content.replace('<section class="aka-section aka-section--cool">\n        <div class="aka-wrap">\n            <div class="aka-eyebrow">Аудитория</div>',
                          '<section class="aka-section aka-section--cool" id="audience">\n        <div class="aka-wrap">\n            <div class="aka-eyebrow">Аудитория</div>')
content = content.replace('<section class="aka-section">\n        <div class="aka-wrap">\n            <div class="aka-eyebrow">Условия участия</div>',
                          '<section class="aka-section" id="price">\n        <div class="aka-wrap">\n            <div class="aka-eyebrow">Условия участия</div>')

# ---- форма вместо заглушки ----
form_html = '''
                <!-- ================================================================
                     ФОРМА ЗАЯВКИ. Сейчас отправка идёт письмом на pmc@pmexcellence.com
                     через почтовый клиент посетителя (mailto). Для подключения CRM
                     замените блок <form> на загрузчик CRM-формы Битрикс24:
                     <script data-b24-form="inline/XXX/YYYYYY" data-skip-moving="true">
                       (function(w,d,u){var s=d.createElement('script');s.async=true;
                       s.src=u+'?'+(Date.now()/180000|0);
                       var h=d.getElementsByTagName('script')[0];
                       h.parentNode.insertBefore(s,h);})(window,document,
                       'https://portal.pm.expert/upload/crm/form/loader_XXX_YYYYYY.js');
                     </script>
                     ================================================================ -->
                <form class="aka-reg" id="akaForm" novalidate>
                    <div class="aka-reg__grid">
                        <label class="aka-reg__f"><span>ФИО<i>*</i></span><input type="text" name="name" required autocomplete="name" placeholder="Иванов Иван Иванович"></label>
                        <label class="aka-reg__f"><span>Компания<i>*</i></span><input type="text" name="company" required autocomplete="organization" placeholder="Название компании"></label>
                        <label class="aka-reg__f"><span>Должность<i>*</i></span><input type="text" name="position" required autocomplete="organization-title" placeholder="Генеральный директор"></label>
                        <label class="aka-reg__f"><span>Телефон<i>*</i></span><input type="tel" name="phone" required autocomplete="tel" placeholder="+7 (___) ___-__-__"></label>
                        <label class="aka-reg__f aka-reg__f--wide"><span>E-mail<i>*</i></span><input type="email" name="email" required autocomplete="email" placeholder="name@company.ru"></label>
                        <label class="aka-reg__f aka-reg__f--wide"><span>Комментарий</span><textarea name="comment" rows="3" placeholder="Проект или инвестиционная программа, которую хотите обсудить"></textarea></label>
                    </div>
                    <label class="aka-reg__agree"><input type="checkbox" name="agree" required><span>Даю согласие на обработку персональных данных в соответствии с <a href="https://pmexcellence.com/privacy/" target="_blank" rel="noopener">политикой конфиденциальности</a>.</span></label>
                    <div class="aka-reg__actions">
                        <button type="submit" class="aka-btn">Отправить заявку</button>
                        <span class="aka-reg__hint">Ответим в течение одного рабочего дня.</span>
                    </div>
                    <p class="aka-reg__msg" id="akaFormMsg" hidden></p>
                </form>
'''
content = re.sub(r'\n\s*<!-- =+ -->\n\s*<!-- МЕСТО ДЛЯ ФОРМЫ БИТРИКС24.*?<div class="aka-form__slot">[^<]*</div>\n', form_html, content, flags=re.S)
assert 'akaForm' in content, 'form not inserted'

# ---- ld+json: цена и url ----
content = content.replace('"price":"100000"', '"price":"240000"')
content = content.replace('"url":"https://pmexcellence.com/akademiya/"', '"url":"https://pmexcellence.com/akademiya/"')

extra_css = '''
/* ================= ОДНОСТРАНИЧНИК: ШРИФТЫ, ШАПКА, ФОРМА, ФУТЕР ================= */
@font-face{font-family:'Gotham Pro';src:url('fonts/gothampro-light.woff') format('woff');font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:'Gotham Pro';src:url('fonts/gothampro.woff') format('woff');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Gotham Pro';src:url('fonts/gothampro-medium.woff') format('woff');font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:'Gotham Pro';src:url('fonts/gothampro-bold.woff') format('woff');font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:'Gotham Pro';src:url('fonts/gothampro-black.woff') format('woff');font-weight:800 900;font-style:normal;font-display:swap}
*,*:before,*:after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;background:#fff;color:var(--aka-ink);font-family:'Gotham Pro',-apple-system,'Segoe UI',Arial,sans-serif;font-size:16px;line-height:1.5}
img{max-width:100%;height:auto;display:block}
a{color:inherit}
h1,h2,h3,h4{font-family:'Gotham Pro',-apple-system,'Segoe UI',Arial,sans-serif}
button{font:inherit}
[hidden]{display:none!important}
:target{scroll-margin-top:84px}

/* ---------- ШАПКА ---------- */
.op-head{position:sticky;top:0;z-index:50;background:rgba(7,24,47,.92);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(201,178,122,.18);color:#fff}
.op-head__in{max-width:1200px;margin:0 auto;padding:0 30px;height:72px;display:flex;align-items:center;gap:28px}
.op-head__logo{display:flex;align-items:center;flex:none}
.op-head__logo img{height:32px;width:auto}
.op-head__tag{font-family:var(--aka-sans);font-size:12px;line-height:1.35;color:rgba(255,255,255,.55);max-width:170px;white-space:normal;padding-left:18px;border-left:1px solid rgba(255,255,255,.14)}
.op-nav{display:flex;gap:26px;margin-left:auto}
.op-nav a{font-family:var(--aka-sans);font-size:14px;font-weight:600;color:rgba(255,255,255,.78);text-decoration:none;letter-spacing:.2px;white-space:nowrap;
  padding:6px 0;border-bottom:1.5px solid transparent;transition:color .2s,border-color .2s}
.op-nav a:hover{color:#fff;border-bottom-color:var(--aka-gold)}
.op-head__phone{font-family:var(--aka-sans);font-size:14px;font-weight:700;color:#fff;text-decoration:none;white-space:nowrap}
.op-head__phone:hover{color:var(--aka-gold-lt)}
.op-head .aka-btn{padding:12px 22px;font-size:14px;white-space:nowrap}
.op-burger{display:none;width:44px;height:44px;border:0;background:none;padding:0;margin-left:auto;cursor:pointer;position:relative}
.op-burger span,.op-burger:before,.op-burger:after{content:'';position:absolute;left:11px;width:22px;height:2px;background:#fff;transition:transform .25s,opacity .25s}
.op-burger:before{top:14px}.op-burger span{top:21px}.op-burger:after{top:28px}
.op-head.is-open .op-burger:before{transform:translateY(7px) rotate(45deg)}
.op-head.is-open .op-burger span{opacity:0}
.op-head.is-open .op-burger:after{transform:translateY(-7px) rotate(-45deg)}

.aka-hero{padding-top:84px}

/* ---------- ФОРМА ---------- */
.aka-form{text-align:left}
.aka-form h2,.aka-form>p{text-align:center}
.aka-reg{margin:30px 0 26px}
.aka-reg__grid{display:grid;grid-template-columns:1fr 1fr;gap:18px 22px}
.aka-reg__f{display:block}
.aka-reg__f--wide{grid-column:1/-1}
.aka-reg__f>span{display:block;font-family:var(--aka-sans);font-size:12px;letter-spacing:1.6px;text-transform:uppercase;font-weight:700;color:var(--aka-gold-dk);margin-bottom:8px}
.aka-reg__f>span i{font-style:normal;color:#b3462f;margin-left:3px}
.aka-reg__f input,.aka-reg__f textarea{width:100%;font-family:var(--aka-sans);font-size:16px;line-height:1.4;color:var(--aka-ink);
  background:#fff;border:1px solid #cfd6df;border-radius:2px;padding:13px 14px;outline:none;transition:border-color .2s,box-shadow .2s}
.aka-reg__f textarea{resize:vertical;min-height:88px}
.aka-reg__f input::placeholder,.aka-reg__f textarea::placeholder{color:#a9b3bf}
.aka-reg__f input:focus,.aka-reg__f textarea:focus{border-color:var(--aka-gold);box-shadow:0 0 0 3px rgba(201,178,122,.22)}
.aka-reg.was-validated :invalid{border-color:#b3462f}
.aka-reg__agree{display:flex;gap:12px;align-items:flex-start;margin:22px 0 0;font-family:var(--aka-sans);font-size:14px;line-height:1.55;color:var(--aka-sec);cursor:pointer}
.aka-reg__agree input{flex:none;width:18px;height:18px;margin:2px 0 0;accent-color:var(--aka-gold-dk)}
.aka-reg__agree a{color:var(--aka-gold-dk);font-weight:600}
.aka-reg__actions{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:26px}
.aka-reg__actions .aka-btn{border:0;cursor:pointer}
.aka-reg__hint{font-family:var(--aka-sans);font-size:14px;color:var(--aka-muted)}
.aka-reg__msg{font-family:var(--aka-sans);font-size:15px;line-height:1.6;margin:18px 0 0;padding:14px 18px;border-radius:2px;
  background:var(--aka-cool);border-left:3px solid var(--aka-gold);color:var(--aka-ink)}
.aka-reg__msg.is-err{border-left-color:#b3462f}
.aka-form__contact{text-align:center}

/* ---------- ФУТЕР ---------- */
.op-foot{background:var(--aka-navy);color:rgba(255,255,255,.7);border-top:1px solid rgba(201,178,122,.18)}
.op-foot__in{max-width:1200px;margin:0 auto;padding:44px 30px 30px;display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:34px}
.op-foot__logo img{height:34px;width:auto;margin-bottom:14px}
.op-foot__tag{font-family:var(--aka-sans);font-size:14px;line-height:1.55;color:rgba(255,255,255,.55);max-width:300px;margin:0}
.op-foot__k{font-family:var(--aka-sans);font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:var(--aka-gold);margin:0 0 12px}
.op-foot p{font-family:var(--aka-sans);font-size:15px;line-height:1.6;margin:0 0 8px;color:rgba(255,255,255,.8)}
.op-foot a{color:#fff;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.25);transition:border-color .2s,color .2s}
.op-foot a:hover{color:var(--aka-gold-lt);border-bottom-color:var(--aka-gold)}
.op-foot__bottom{max-width:1200px;margin:0 auto;padding:18px 30px 26px;border-top:1px solid rgba(255,255,255,.08);
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:var(--aka-sans);font-size:13px;color:rgba(255,255,255,.45)}
.op-foot__bottom a{border:0;color:rgba(255,255,255,.6)}

@media(max-width:1280px){
  .op-head__tag{display:none}
}
@media(max-width:1100px){
  .op-nav{gap:18px}
  .op-head__in{gap:20px}
}
@media(max-width:900px){
  .op-head__in{padding:0 20px;height:64px;gap:14px}
  .op-head__logo img{height:28px}
  .op-nav{position:absolute;left:0;right:0;top:64px;flex-direction:column;gap:0;background:var(--aka-navy);
    border-bottom:1px solid rgba(201,178,122,.18);padding:8px 20px 16px;display:none;margin:0}
  .op-head.is-open .op-nav{display:flex}
  .op-nav a{padding:13px 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:16px}
  .op-nav a:hover{border-bottom-color:rgba(255,255,255,.08)}
  .op-head__phone,.op-head .aka-btn{display:none}
  .op-burger{display:block}
  .aka-hero{padding-top:52px}
  .aka-reg__grid{grid-template-columns:1fr}
  .op-foot__in{grid-template-columns:1fr;gap:26px;padding:36px 20px 24px}
  .op-foot__bottom{padding:16px 20px 22px}
  :target{scroll-margin-top:70px}
}
'''

head_html = '''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Академия крупных проектов. Модуль 1: стадия «Определение» | PM Excellence</title>
<meta name="description" content="Академия крупных проектов PM Excellence. Модуль 1 «Стадия Определение»: 12 вопросов первого лица перед началом полномасштабного проектирования и планирования реализации. 5 декабря 2026 года, Москва, очный формат для собственников и руководителей.">
<meta property="og:title" content="Академия крупных проектов. Модуль 1: стадия «Определение»">
<meta property="og:description" content="12 вопросов первого лица перед началом полномасштабного проектирования. Экспертная сессия Александра Кутузова, PME. 5 декабря 2026, Москва.">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/hero-academy.jpg">
<link rel="icon" href="https://pmexcellence.com/favicon.ico">
<style>
''' + base_css + extra_css + '''
</style>
</head>
<body>

<!-- ===== ШАПКА ОДНОСТРАНИЧНИКА ===== -->
<header class="op-head" id="top">
    <div class="op-head__in">
        <a class="op-head__logo" href="#top" aria-label="PM Excellence"><img src="assets/logo.svg" alt="PM Excellence"></a>
        <div class="op-head__tag">Профессиональное управление крупными и мегапроектами</div>
        <nav class="op-nav" id="opNav" aria-label="Разделы страницы">
            <a href="#questions">12 вопросов</a>
            <a href="#program">Программа</a>
            <a href="#audience">Для кого</a>
            <a href="#speakers">Кто ведёт</a>
            <a href="#price">Стоимость</a>
        </nav>
        <a class="op-head__phone" href="tel:+74999385439">+7 (499) 938-54-39</a>
        <a class="aka-btn" href="#registration">Подать заявку</a>
        <button type="button" class="op-burger" id="opBurger" aria-label="Меню" aria-expanded="false" aria-controls="opNav"><span></span></button>
    </div>
</header>

<main>
'''

foot_html = '''
</main>

<!-- ===== ФУТЕР ===== -->
<footer class="op-foot">
    <div class="op-foot__in">
        <div>
            <div class="op-foot__logo"><img src="assets/logo.svg" alt="PM Excellence"></div>
            <p class="op-foot__tag">Профессиональное управление крупными и мегапроектами. Первый PMC | EPC подрядчик в России.</p>
        </div>
        <div>
            <p class="op-foot__k">Контакты</p>
            <p><a href="tel:+74999385439">+7 (499) 938-54-39</a></p>
            <p><a href="mailto:pmc@pmexcellence.com">pmc@pmexcellence.com</a></p>
            <p><a href="https://t.me/pmexcellence" target="_blank" rel="noopener">Telegram-канал PM Excellence</a></p>
            <p><a href="https://t.me/megkutuzov" target="_blank" rel="noopener">«Мегапроекты с Кутузовым»</a></p>
        </div>
        <div>
            <p class="op-foot__k">Адреса</p>
            <p>127030, Москва, Новослободская ул., д. 20</p>
            <p>107078, Москва, Каланчевская ул., д. 15</p>
            <p><a href="https://pmexcellence.com/" target="_blank" rel="noopener">pmexcellence.com</a></p>
        </div>
    </div>
    <div class="op-foot__bottom">
        <span>© 2026 ООО «ПИЭМСИ». Все права защищены.</span>
        <a href="https://pmexcellence.com/privacy/" target="_blank" rel="noopener">Политика конфиденциальности</a>
    </div>
</footer>

<script>
// мобильное меню
(function(){
  var h=document.getElementById('top'), b=document.getElementById('opBurger'), n=document.getElementById('opNav');
  if(!h||!b||!n) return;
  b.addEventListener('click',function(){
    var open=h.classList.toggle('is-open');
    b.setAttribute('aria-expanded',String(open));
  });
  Array.prototype.forEach.call(n.querySelectorAll('a'),function(a){
    a.addEventListener('click',function(){ h.classList.remove('is-open'); b.setAttribute('aria-expanded','false'); });
  });
})();

// форма заявки: отправка письмом через почтовый клиент (до подключения CRM-формы Битрикс24)
(function(){
  var f=document.getElementById('akaForm'), m=document.getElementById('akaFormMsg');
  if(!f) return;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    f.classList.add('was-validated');
    if(!f.checkValidity()){
      m.hidden=false; m.className='aka-reg__msg is-err';
      m.textContent='Заполните обязательные поля и подтвердите согласие на обработку персональных данных.';
      return;
    }
    var d=new FormData(f);
    var body=[
      'Заявка на участие: Академия крупных проектов, Модуль 1 (5 декабря 2026)','',
      'ФИО: '+d.get('name'),
      'Компания: '+d.get('company'),
      'Должность: '+d.get('position'),
      'Телефон: '+d.get('phone'),
      'E-mail: '+d.get('email'),
      'Комментарий: '+(d.get('comment')||'—'),'',
      'Согласие на обработку персональных данных: да'
    ].join('\\n');
    var subject='Заявка: Академия крупных проектов, Модуль 1 — '+d.get('company');
    window.location.href='mailto:pmc@pmexcellence.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    m.hidden=false; m.className='aka-reg__msg';
    m.textContent='Сейчас откроется письмо с заявкой в вашей почтовой программе. Если этого не произошло, напишите нам на pmc@pmexcellence.com или позвоните +7 (499) 938-54-39.';
  });
})();
</script>
</body>
</html>
'''

out = head_html + content + foot_html
open('build/index.html', 'w', encoding='utf-8').write(out)
print('written', len(out))
