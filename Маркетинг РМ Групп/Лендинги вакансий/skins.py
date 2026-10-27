# -*- coding: utf-8 -*-
"""Скины лендингов вакансий по юрлицам: CSS + разметка body (без модалки/скриптов — они общие в build_landings.py).
Визуальный язык взят из Сайты для ЮЛ/Сайты/*.html: rmgk-landing (строгий корпоративный, без скруглений),
urban-service-landing (bento, пилюли, Apple-like), Инстафф — по сайту in-staff.ru (фото-хиро с оверлеем, Oswald капсом)."""

BASE_CSS = r"""
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:var(--ink);background:var(--bg);line-height:1.5;padding-bottom:calc(84px + env(safe-area-inset-bottom))}
img{max-width:100%;display:block}
a{color:inherit}
.wrap{max-width:var(--max);margin:0 auto;padding:0 20px}
@media(min-width:860px){.wrap{padding:0 40px}}
h1,h2,h3{font-family:var(--font-h);line-height:1.1;letter-spacing:var(--h-ls);text-transform:var(--h-case)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:54px;padding:12px 26px;border-radius:var(--btn-r);font-weight:700;font-size:16px;line-height:1.15;text-align:center;text-decoration:none;border:0;cursor:pointer;transition:.18s;-webkit-tap-highlight-color:transparent;min-width:0;max-width:100%;font-family:var(--font-btn)}
.btn:active{transform:scale(.98)}
.btn-primary{background:var(--accent);color:#fff}
.btn-primary:hover{background:var(--accent-d)}
.btn-ghost{background:transparent;color:var(--ink);border:2px solid var(--ink)}
.btn-ghost:hover{background:var(--ink);color:#fff}
.btn-block{width:100%}
.btn svg{width:22px;height:22px;flex:none}
.field{margin-bottom:12px}
.field label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:var(--ink2)}
.field input{width:100%;height:54px;border:2px solid var(--line);border-radius:var(--in-r);padding:0 16px;font:inherit;font-size:17px;color:var(--ink);background:#fff;outline:none;transition:border .15s}
.field input:focus{border-color:var(--accent)}
.field input.err{border-color:#E5484D}
.hp{position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden}
.consent{font-size:12px;color:var(--muted);margin-top:12px;line-height:1.4}
.consent a{color:var(--muted)}
.form-msg{display:none;margin-top:12px;font-size:14px;font-weight:600}
.form-msg.show{display:block}.form-msg.ok{color:#2E7D32}.form-msg.bad{color:#C62828}
.success{text-align:center;padding:14px 4px}
.success .ok-ic{width:64px;height:64px;border-radius:50%;background:var(--accent);display:grid;place-items:center;margin:0 auto 14px}
.success .ok-ic svg{width:30px;height:30px}
.success h3{margin-bottom:6px;font-size:22px}
.success p{color:var(--muted);font-size:15px;margin-bottom:16px}
.btn-tg{background:var(--ink);color:#fff}
.bar{position:fixed;left:0;right:0;bottom:0;z-index:50;background:rgba(255,255,255,.96);backdrop-filter:blur(10px);border-top:1px solid var(--line);padding:10px 14px calc(10px + env(safe-area-inset-bottom));display:flex;gap:10px;transition:transform .25s}
.bar .btn-primary{flex:1;min-height:54px}
.bar .call{width:54px;height:54px;border-radius:var(--btn-r);background:var(--ink);color:#fff;display:grid;place-items:center;flex:none}
.bar .call svg{width:24px;height:24px}
.bar.hide{transform:translateY(120%)}
@media(min-width:860px){.bar{display:none}body{padding-bottom:0}}
.modal{position:fixed;inset:0;z-index:100;display:none;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.6)}
@media(min-width:640px){.modal{align-items:center;padding:20px}}
.modal.open{display:flex}
.modal .box{background:#fff;width:100%;max-width:480px;border-radius:var(--card-r) var(--card-r) 0 0;padding:22px 20px calc(22px + env(safe-area-inset-bottom));position:relative;max-height:92vh;overflow:auto;animation:up .25s ease-out}
@media(min-width:640px){.modal .box{border-radius:var(--card-r);padding:30px 28px}}
@keyframes up{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
.modal .x{position:absolute;right:14px;top:14px;width:36px;height:36px;border-radius:50%;border:0;background:var(--bg);font-size:20px;cursor:pointer;display:grid;place-items:center}
.modal .vac-name{display:inline-block;background:var(--accent-soft);color:var(--accent-d);border-radius:var(--in-r);padding:6px 10px;font-size:13px;font-weight:700;margin-bottom:14px}
.modal h3{font-size:22px;margin-bottom:4px;padding-right:40px}
.modal .hint{font-size:14px;color:var(--muted);margin-bottom:16px}
.reveal{opacity:0;transform:translateY(14px);transition:opacity .5s,transform .5s}
.reveal.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}html{scroll-behavior:auto}}
.nav-phone svg,.contact-lines svg{width:20px;height:20px;flex:none}
.logos{display:flex;flex-wrap:wrap;justify-content:center;gap:18px 34px;align-items:center}
.logos img{height:28px;width:auto;filter:grayscale(1);opacity:.65;transition:.2s}
.logos img:hover{filter:none;opacity:1}
@media(min-width:860px){.logos img{height:34px}}
.vac ul{list-style:none;display:grid;gap:6px;font-size:14.5px;color:var(--ink2)}
.vac ul li{padding-left:20px;position:relative}
.vac .lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:6px}
.vac .btn{margin-top:auto}
.meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.meta div{background:var(--bg);border-radius:var(--in-r);padding:10px 12px;font-size:14px}
.meta div small{display:block;color:var(--muted);font-size:12px;margin-bottom:2px}
.meta div.full{grid-column:1/-1}
"""

PHONE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z"/></svg>'
MAX_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/></svg>'
MAIL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'

FORM_MAIN = '''<form class="lead" id="mainForm" novalidate>
      <h3>Оставить заявку</h3>
      <p class="hint">Перезвоним в течение 15 минут в рабочее время</p>
      <div class="field"><label for="f-name">Ваше имя</label><input id="f-name" name="name" type="text" autocomplete="name" placeholder="Как к вам обращаться"></div>
      <div class="field"><label for="f-phone">Телефон</label><input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required></div>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off">
      <input type="hidden" name="vacancy" value="{{sheet_vacancy}}">
      <button class="btn btn-primary btn-block" type="submit">Отправить заявку</button>
      <div class="form-msg"></div>
      <p class="consent">Нажимая кнопку, вы соглашаетесь с <a href="{{policy_url}}" target="_blank" rel="noopener">политикой конфиденциальности</a> и даёте <a href="{{consent_url}}" target="_blank" rel="noopener">согласие на обработку персональных данных</a>.</p>
    </form>'''

CONTACT_LINES = f'''<div class="contact-lines">
        <a href="tel:{{{{phone_link}}}}" data-ym="phone_click">{PHONE_SVG}{{{{phone_display}}}}</a>
        <a href="{{{{max_url}}}}" target="_blank" rel="noopener" data-ym="max_click">{MAX_SVG}Написать в MAX</a>
        <a href="mailto:{{{{email}}}}">{MAIL_SVG}{{{{email}}}}</a>
      </div>'''

BAR = f'''<div class="bar" id="bar">
  <button class="btn btn-primary" data-open="">Откликнуться</button>
  <a class="call" href="tel:{{{{phone_link}}}}" aria-label="Позвонить" data-ym="phone_click">{PHONE_SVG}</a>
</div>'''

# =====================================================================================
# РМГК — Clean White Corporate (rmgk-landing.html): без скруглений, оранжевая полоса у логотипа,
# kicker с линией, крупный H1 800, абзац с оранжевой левой рамкой, тёмная правая панель, вертикальный таймлайн.
# =====================================================================================
RMGK_CSS = r"""
:root{--ink:#111827;--ink2:#374151;--muted:#6B7280;--line:#E5E7EB;--bg:#F9FAFB;--accent:#FF5B1F;--accent-d:#E04A0F;--accent-soft:#FFF1EA;
--font-h:Inter,system-ui,sans-serif;--font-btn:Inter,system-ui,sans-serif;--h-case:none;--h-ls:-.03em;--btn-r:0;--in-r:0;--card-r:0;--max:1200px}
.btn{font-size:14px;letter-spacing:.01em}
header{position:sticky;top:0;z-index:40;background:#fff;border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;height:64px;gap:12px}
.brand{display:flex;align-items:center;gap:12px;text-decoration:none}
.brand .bar-mark{width:4px;height:30px;background:var(--accent);flex:none}
.brand b{font-size:19px;font-weight:900;letter-spacing:-.5px;display:block;line-height:1}
.brand small{display:block;font-size:11px;color:var(--muted);margin-top:3px}
.nav-right{display:flex;align-items:center;gap:10px}
.nav-phone{display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px;text-decoration:none;padding:10px 12px;border:1px solid var(--line)}
.nav-phone span{display:none}@media(min-width:640px){.nav-phone span{display:inline}}
.nav-cta{display:none}@media(min-width:860px){.nav-cta{display:inline-flex;min-height:44px;padding:0 24px}}
.hero{display:grid;grid-template-columns:1fr;background:#fff}
@media(min-width:960px){.hero{grid-template-columns:1fr 420px;min-height:560px}}
.hero-left{padding:40px 20px 36px}
@media(min-width:960px){.hero-left{padding:80px 64px;border-right:1px solid var(--line);display:flex;flex-direction:column;justify-content:center}}
.kicker{display:flex;align-items:center;gap:12px;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:22px}
.kicker::before{content:"";width:32px;height:2px;background:var(--accent);flex:none}
h1{font-size:clamp(34px,5.5vw,64px);font-weight:800;line-height:1;margin-bottom:22px}
p.lead{font-size:16px;line-height:1.6;color:var(--muted);border-left:3px solid var(--accent);padding-left:18px;margin-bottom:28px;max-width:520px}
.hero-actions{display:flex;flex-wrap:wrap;gap:12px}
.hero-actions .btn{flex:1 1 100%}@media(min-width:640px){.hero-actions .btn{flex:0 0 auto;min-width:200px}}
.hero-right{background:var(--ink);color:#fff;padding:0 0 28px}
.hero-right img{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:{{hero_pos}}}
@media(min-width:960px){.hero-right img{aspect-ratio:auto;height:260px}}
.panel{padding:24px 20px 0}@media(min-width:960px){.panel{padding:28px 32px 0}}
.panel-label{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.4);padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.12);margin-bottom:16px}
.panel-num{font-size:clamp(44px,5vw,60px);font-weight:900;line-height:1;letter-spacing:-2px}
.panel-num sup{color:var(--accent);font-size:.45em;vertical-align:top;margin-left:2px}
.panel-sub{font-size:13px;color:rgba(255,255,255,.55);margin:6px 0 18px}
.panel-list{list-style:none;border-top:1px solid rgba(255,255,255,.12);padding-top:16px;display:grid;gap:9px;font-size:14px}
.panel-list li{display:flex;gap:10px;align-items:flex-start;color:rgba(255,255,255,.85)}
.panel-list li::before{content:"";width:6px;height:6px;background:var(--accent);flex:none;margin-top:7px}
.stats{background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.stats .wrap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding-top:26px;padding-bottom:22px}
.stat b{display:block;font-size:clamp(26px,4vw,44px);font-weight:900;letter-spacing:-1.5px;line-height:1}
.stat b i{font-style:normal;color:var(--accent)}
.stat span{display:block;font-size:12px;color:var(--muted);margin-top:6px}
.stats-note{font-size:11px;color:var(--muted);padding-bottom:18px;letter-spacing:.02em}
section{padding:56px 0}@media(min-width:860px){section{padding:84px 0}}
.sec-label{display:flex;align-items:center;gap:12px;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:14px}
.sec-label::before{content:"";width:32px;height:2px;background:var(--accent)}
h2{font-size:clamp(28px,3.6vw,44px);font-weight:800;margin-bottom:28px}
.why-grid{display:grid;gap:0;border-top:2px solid var(--ink)}
@media(min-width:760px){.why-grid{grid-template-columns:repeat(2,1fr)}}@media(min-width:1000px){.why-grid{grid-template-columns:repeat(4,1fr)}}
.why{padding:22px 0 24px;border-bottom:1px solid var(--line);position:relative}
@media(min-width:760px){.why{padding:26px 22px 26px 0}.why+.why{padding-left:22px;border-left:1px solid var(--line)}}
.why .ic{display:none}
.why::before{content:counter(w,decimal-leading-zero);counter-increment:w;font-size:12px;font-weight:700;color:var(--accent);letter-spacing:2px;display:block;margin-bottom:12px}
.why-grid{counter-reset:w}
.why h3{font-size:17px;font-weight:800;margin-bottom:8px}
.why p{font-size:14px;color:var(--muted)}
.vac-grid{display:grid;gap:16px}@media(min-width:860px){.vac-grid{grid-template-columns:1fr 1fr}}
.vac{background:#fff;border:1px solid var(--line);padding:24px;display:flex;flex-direction:column;gap:14px;transition:border-color .2s}
.vac:hover{border-color:var(--accent)}
.vac-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}
.vac h3{font-size:20px;font-weight:800}
.rate{text-align:right}
.rate b{display:block;font-size:22px;font-weight:900;color:var(--accent);letter-spacing:-.5px;white-space:nowrap}
.rate b.tbd{font-size:13px;font-weight:700;color:var(--accent-d);white-space:normal;max-width:150px}
.rate span{display:block;font-size:12px;color:var(--muted)}
.meta div{border:1px solid var(--line);background:#fff}
.vac ul li::before{content:"";position:absolute;left:0;top:8px;width:7px;height:7px;background:var(--accent)}
.vac ul.req li::before{background:transparent;border:2px solid var(--ink)}
.vac .btn{background:transparent;color:var(--ink);border:2px solid var(--ink)}.vac .btn:hover{background:var(--ink);color:#fff}
@media(max-width:859px){.vac .btn{background:var(--accent);border-color:var(--accent);color:#fff}}
.partners{background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:44px 0}
.partners h2{font-size:22px;text-align:center;margin-bottom:6px}
.partners p{text-align:center;color:var(--muted);margin-bottom:26px;font-size:14px}
.steps{position:relative;display:grid;gap:0}
.step{position:relative;padding:0 0 26px 44px}
.step::before{content:"";position:absolute;left:13px;top:8px;bottom:-8px;width:2px;background:var(--line)}
.step:last-child::before{display:none}
.step i{position:absolute;left:0;top:0;width:28px;height:28px;background:var(--accent);color:#fff;font-style:normal;font-weight:800;font-size:13px;display:grid;place-items:center}
.step h3{font-size:17px;font-weight:800;margin-bottom:4px}
.step p{font-size:14px;color:var(--muted)}
@media(min-width:960px){.steps{grid-template-columns:repeat(4,1fr);gap:24px}.step{padding:0 0 0 0;padding-top:44px}.step::before{left:14px;right:-24px;top:13px;bottom:auto;height:2px;width:auto}.step:last-child::before{display:none}.step i{left:0;top:0}}
.form-sec{background:var(--ink);color:#fff;border-top:3px solid var(--accent)}
.form-grid{display:grid;gap:28px;align-items:center}@media(min-width:860px){.form-grid{grid-template-columns:1fr 1fr;gap:56px}}
.form-sec h2{color:#fff}
.form-sec p.lead{border-color:var(--accent);color:rgba(255,255,255,.7)}
.contact-lines{display:grid;gap:10px;font-weight:600}
.contact-lines a{text-decoration:none;display:flex;gap:10px;align-items:center}
.contact-lines svg{color:var(--accent)}
form.lead{background:#fff;color:var(--ink);padding:28px 24px}@media(min-width:640px){form.lead{padding:34px 32px}}
form.lead h3{font-size:22px;margin-bottom:4px;font-weight:800}
form.lead .hint{font-size:14px;color:var(--muted);margin-bottom:18px}
footer{background:var(--ink);color:rgba(255,255,255,.55);padding:26px 0;font-size:12px;border-top:3px solid var(--accent)}
footer .row{display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between;align-items:center}
footer .brand b{color:#fff}footer a{text-decoration:none}
"""

RMGK_BODY = f'''
<header>
  <div class="wrap nav">
    <a class="brand" href="#top" aria-label="{{{{brand_name}}}}"><span class="bar-mark"></span><span><b>{{{{brand_name}}}}</b><small>вакансии рядом с домом</small></span></a>
    <div class="nav-right">
      <a class="nav-phone" href="tel:{{{{phone_link}}}}" data-ym="phone_click">{PHONE_SVG}<span>{{{{phone_display}}}}</span></a>
      <button class="btn btn-primary nav-cta" data-open="">Откликнуться</button>
    </div>
  </div>
</header>
<main id="top">
<section class="hero" style="padding:0">
  <div class="hero-left">
    <div class="kicker">{{{{eyebrow}}}}</div>
    <h1>{{{{h1}}}}</h1>
    <p class="lead">{{{{sub}}}}</p>
    <div class="hero-actions">{{{{hero_buttons}}}}</div>
  </div>
  <aside class="hero-right">
    <img src="{{{{hero_photo}}}}" alt="" loading="eager" fetchpriority="high" onerror="this.remove()">
    <div class="panel">
      <div class="panel-label">Условия</div>
      <div class="panel-num">{{{{fact1_b}}}}<sup>+</sup></div>
      <div class="panel-sub">{{{{fact1_s}}}}</div>
      <ul class="panel-list">{{{{facts_li}}}}</ul>
    </div>
  </aside>
</section>
<div class="stats"><div class="wrap">{{{{stats_html}}}}</div><div class="wrap stats-note">«{{{{brand_name}}}}» входит в группу компаний «РМ Групп»</div></div>
<section id="about"><div class="wrap">
  <div class="sec-label">Почему мы</div><h2>Почему с нами</h2>
  <div class="why-grid">{{{{why_html}}}}</div>
</div></section>
<section id="vacancies" style="padding-top:0"><div class="wrap">
  <div class="sec-label">Вакансии</div><h2>{{{{vacancies_title}}}}</h2>
  <div class="vac-grid">{{{{vacancies_html}}}}</div>
</div></section>
<div class="partners"><div class="wrap"><h2>Наши сотрудники работают в</h2><p>Смены в крупных сетях и на складах, официально через «{{{{brand_name}}}}»</p><div class="logos">{{{{partners_html}}}}</div></div></div>
<section id="steps"><div class="wrap">
  <div class="sec-label">Этапы</div><h2>Как выйти на работу</h2>
  <div class="steps">{{{{steps_html}}}}</div>
</div></section>
<section class="form-sec" id="form"><div class="wrap form-grid">
  <div>
    <div class="sec-label">Контакты</div><h2>Ответим на все вопросы</h2>
    <p class="lead">Оставьте номер: перезвоним, подберём смены рядом с домом и расскажем, что взять с собой в первый день.</p>
    {CONTACT_LINES}
  </div>
  {FORM_MAIN}
</div></section>
</main>
<footer><div class="wrap row">
  <a class="brand" href="#top"><span class="bar-mark"></span><b>{{{{brand_name}}}}</b></a>
  <div>{{{{legal}}}} · {{{{address}}}}</div>
  <div><a href="tel:{{{{phone_link}}}}">{{{{phone_display}}}}</a> · <a href="mailto:{{{{email}}}}">{{{{email}}}}</a></div>
</div></footer>
{BAR}
'''

# =====================================================================================
# УРБАН СЕРВИС — bento (urban-service-landing.html): полупрозрачная навигация, «Урбан» + зелёный «Сервис»,
# пилюли, светло-зелёный градиентный hero-блок с плавающими тегами, зелёная карточка с большой цифрой, фото-карточки.
# =====================================================================================
URBAN_CSS = r"""
:root{--ink:#1D1D1F;--ink2:#3A3A3C;--muted:#6E6E73;--line:#E5E5EA;--bg:#F5F5F7;--accent:#10B981;--accent-d:#059669;--accent-lt:#34D399;--accent-soft:#D1FAE5;
--font-h:Inter,system-ui,sans-serif;--font-btn:Inter,system-ui,sans-serif;--h-case:none;--h-ls:-.03em;--btn-r:100px;--in-r:12px;--card-r:20px;--max:1140px}
.btn{font-size:15px;font-weight:600}
.btn-ghost{background:rgba(255,255,255,.7);border:1px solid rgba(0,0,0,.12);backdrop-filter:blur(10px)}.btn-ghost:hover{background:#fff;color:var(--ink)}
header{position:sticky;top:0;z-index:40;background:rgba(245,245,247,.88);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.07)}
.nav{display:flex;align-items:center;justify-content:space-between;height:56px;gap:12px}
.brand{display:flex;align-items:center;gap:9px;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:-.3px}
.brand svg{height:26px;width:auto}
.brand em{font-style:normal;color:var(--accent)}
.brand small{display:block;font-weight:500;font-size:11px;color:var(--muted)}
.nav-right{display:flex;align-items:center;gap:8px}
.nav-phone{display:flex;align-items:center;gap:8px;font-weight:600;font-size:14px;text-decoration:none;padding:8px 12px;border-radius:100px;border:1px solid rgba(0,0,0,.12);background:#fff}
.nav-phone span{display:none}@media(min-width:640px){.nav-phone span{display:inline}}
.nav-cta{display:none}@media(min-width:860px){.nav-cta{display:inline-flex;min-height:38px;padding:0 18px;font-size:13px;background:var(--ink)}.nav-cta:hover{background:#000}}
.bento{display:grid;grid-template-columns:1fr;gap:12px;padding:16px 0 8px}
@media(min-width:860px){.bento{grid-template-columns:repeat(6,1fr);gap:16px;padding:40px 0 8px}}
.bc{border-radius:var(--card-r);overflow:hidden;position:relative}
.bc-main{grid-column:1/-1;background:linear-gradient(135deg,#ECFDF5 0%,#D1FAE5 60%,#A7F3D0 100%);padding:28px 22px 28px}
@media(min-width:860px){.bc-main{grid-column:span 4;padding:44px 44px 40px}}
.bc-num{grid-column:1/-1;background:var(--accent);color:#fff;padding:22px;display:flex;flex-direction:column;justify-content:space-between;min-height:150px}
@media(min-width:860px){.bc-num{grid-column:span 2}}
.bc-photo{grid-column:1/-1;min-height:200px}
@media(min-width:860px){.bc-photo{grid-column:span 2;min-height:230px}}
.bc-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:{{hero_pos}}}
.bc-cap{position:absolute;left:0;right:0;bottom:0;padding:18px;background:linear-gradient(transparent,rgba(0,0,0,.65));color:#fff}
.bc-cap b{display:block;font-size:20px;font-weight:800;letter-spacing:-.5px}.bc-cap span{font-size:12px;opacity:.85}
.bc-fact{grid-column:1/-1;background:#fff;padding:22px;display:flex;flex-direction:column;justify-content:flex-end;min-height:130px}
@media(min-width:860px){.bc-fact{grid-column:span 2}}
.bc-fact b{font-size:26px;font-weight:800;letter-spacing:-1px;color:var(--accent-d)}.bc-fact span{font-size:13px;color:var(--muted)}
.bc-dark{grid-column:1/-1;background:linear-gradient(160deg,#1D1D1F,#064E3B);color:#fff;padding:22px;display:flex;flex-direction:column;justify-content:flex-end;min-height:130px}
@media(min-width:860px){.bc-dark{grid-column:span 2}}
.bc-dark b{font-size:26px;font-weight:800;letter-spacing:-1px}.bc-dark span{font-size:12px;opacity:.7}
.kicker{font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:600;color:var(--accent-d);margin-bottom:14px}
h1{font-size:clamp(30px,3.6vw,46px);font-weight:800;line-height:1.08;margin-bottom:14px}
h1 .g{color:var(--accent-d)}
p.lead{font-size:16px;line-height:1.55;color:var(--ink2);max-width:520px;margin-bottom:22px}
.hero-actions{display:flex;flex-wrap:wrap;gap:10px}
.hero-actions .btn{flex:1 1 100%}@media(min-width:640px){.hero-actions .btn{flex:0 0 auto}}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.tag{background:rgba(255,255,255,.85);border:1px solid rgba(16,185,129,.3);color:var(--accent-d);font-size:11px;font-weight:600;padding:5px 12px;border-radius:100px}
.bc-num .lbl{font-size:10px;letter-spacing:1px;text-transform:uppercase;font-weight:600;opacity:.85}
.bc-num b{font-size:clamp(40px,5vw,60px);font-weight:800;letter-spacing:-2px;line-height:1}
.bc-num span{font-size:13px;opacity:.9}
.stats{padding:8px 0 0}
.stats .wrap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.stat{background:#fff;border-radius:16px;padding:16px 14px}
.stat b{display:block;font-size:clamp(24px,3.4vw,36px);font-weight:800;letter-spacing:-1.5px;line-height:1;color:var(--ink)}
.stat b i{font-style:normal;color:var(--accent)}
.stat span{display:block;font-size:12px;color:var(--muted);margin-top:6px}
.stats-note{font-size:11px;color:var(--muted);padding:12px 0 0}
section{padding:48px 0}@media(min-width:860px){section{padding:72px 0}}
.sec-label{font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:600;color:var(--muted);margin-bottom:8px}
h2{font-size:clamp(24px,3vw,34px);font-weight:800;margin-bottom:22px}
.why-grid{display:grid;gap:12px}@media(min-width:640px){.why-grid{grid-template-columns:1fr 1fr}}@media(min-width:1000px){.why-grid{grid-template-columns:repeat(4,1fr)}}
.why{background:#fff;border-radius:16px;padding:22px 20px;transition:transform .2s,box-shadow .2s}
.why:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,.06)}
.why .ic{width:40px;height:40px;border-radius:12px;background:var(--accent-soft);display:grid;place-items:center;margin-bottom:14px}
.why .ic svg{width:22px;height:22px;stroke:var(--accent-d)}
.why h3{font-size:16px;font-weight:700;margin-bottom:6px}.why p{font-size:14px;color:var(--muted)}
.vac-grid{display:grid;gap:14px}@media(min-width:860px){.vac-grid{grid-template-columns:1fr 1fr}}
.vac{background:#fff;border-radius:var(--card-r);padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:0 1px 0 rgba(0,0,0,.03)}
.vac-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}
.vac h3{font-size:20px;font-weight:800}
.rate{text-align:right}
.rate b{display:inline-block;background:var(--accent);color:#fff;border-radius:100px;padding:8px 14px;font-size:16px;font-weight:700;white-space:nowrap}
.rate b.tbd{background:var(--accent-soft);color:var(--accent-d);font-size:13px;white-space:normal;max-width:160px}
.rate span{display:block;font-size:12px;color:var(--muted);margin-top:4px}
.vac ul li::before{content:"";position:absolute;left:0;top:7px;width:10px;height:10px;border-radius:50%;background:var(--accent)}
.vac ul.req li::before{background:#fff;border:2px solid var(--accent)}
.vac .btn{background:var(--ink);color:#fff}.vac .btn:hover{background:#000}
.partners{padding:8px 0 48px}
.partners .card{background:#fff;border-radius:var(--card-r);padding:34px 22px}
.partners h2{font-size:22px;text-align:center;margin-bottom:6px}
.partners p{text-align:center;color:var(--muted);margin-bottom:24px;font-size:14px}
.steps{display:grid;gap:14px;position:relative}
@media(min-width:860px){.steps{grid-template-columns:repeat(4,1fr);gap:0}}
.step{position:relative;padding:0 0 0 56px}
@media(min-width:860px){.step{padding:64px 12px 0 0;text-align:center}}
.step i{position:absolute;left:0;top:0;width:40px;height:40px;border-radius:50%;background:#fff;border:2px solid var(--accent);color:var(--accent-d);font-style:normal;font-weight:700;font-size:13px;display:grid;place-items:center}
@media(min-width:860px){.step i{left:50%;transform:translateX(-50%)}.step::before{content:"";position:absolute;top:20px;left:50%;right:-50%;height:2px;background:var(--accent-soft)}.step:last-child::before{display:none}}
.step h3{font-size:16px;font-weight:700;margin-bottom:4px}.step p{font-size:14px;color:var(--muted)}
.form-sec{padding-top:8px}
.form-grid{display:grid;gap:14px}@media(min-width:860px){.form-grid{grid-template-columns:1fr 1fr;gap:16px}}
.info-card{background:#fff;border-radius:var(--card-r);padding:26px 22px}
.info-card p.lead{margin-bottom:18px}
.contact-lines{display:grid;gap:10px;font-weight:600}
.contact-lines a{text-decoration:none;display:flex;gap:10px;align-items:center;background:var(--bg);border-radius:12px;padding:12px 14px;font-size:14px}
.contact-lines svg{color:var(--accent-d)}
form.lead{background:#fff;border-radius:var(--card-r);padding:26px 22px}@media(min-width:640px){form.lead{padding:32px 30px}}
form.lead h3{font-size:22px;margin-bottom:4px}form.lead .hint{font-size:14px;color:var(--muted);margin-bottom:18px}
form.lead .btn-primary{background:var(--ink)}form.lead .btn-primary:hover{background:#000}
footer{background:var(--ink);color:rgba(255,255,255,.55);padding:24px 0;font-size:12px}
footer .row{display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between;align-items:center}
footer .brand{color:rgba(255,255,255,.8);font-size:14px}footer a{text-decoration:none}
"""

URBAN_BODY = f'''
<header>
  <div class="wrap nav">
    <a class="brand" href="#top" aria-label="{{{{brand_name}}}}">{{{{brand_logo}}}}<span>Урбан <em>Сервис</em><small>вакансии рядом с домом</small></span></a>
    <div class="nav-right">
      <a class="nav-phone" href="tel:{{{{phone_link}}}}" data-ym="phone_click">{PHONE_SVG}<span>{{{{phone_display}}}}</span></a>
      <button class="btn btn-primary nav-cta" data-open="">Откликнуться</button>
    </div>
  </div>
</header>
<main id="top">
<div class="wrap bento">
  <div class="bc bc-main">
    <div class="kicker">{{{{eyebrow}}}}</div>
    <h1>{{{{h1_accent}}}}</h1>
    <p class="lead">{{{{sub}}}}</p>
    <div class="hero-actions">{{{{hero_buttons}}}}</div>
    <div class="tags">{{{{tags_html}}}}</div>
  </div>
  <div class="bc bc-num"><div class="lbl">Ставка</div><div><b>{{{{fact1_b}}}}</b><span style="display:block">{{{{fact1_s}}}}</span></div></div>
  <div class="bc bc-photo"><img src="{{{{hero_photo}}}}" alt="" loading="eager" fetchpriority="high" onerror="this.remove()"><div class="bc-cap"><b>{{{{fact2_b}}}}</b><span>{{{{fact2_s}}}}</span></div></div>
  <div class="bc bc-fact"><b>{{{{fact3_b}}}}</b><span>{{{{fact3_s}}}}</span></div>
  <div class="bc bc-dark"><b>16 лет</b><span>«{{{{brand_name}}}}» входит в группу компаний «РМ Групп»: 4000+ человек на объектах, 93 проекта</span></div>
</div>
<section id="about"><div class="wrap">
  <div class="sec-label">Почему мы</div><h2>Почему с нами</h2>
  <div class="why-grid">{{{{why_html}}}}</div>
</div></section>
<section id="vacancies" style="padding-top:0"><div class="wrap">
  <div class="sec-label">Вакансии</div><h2>{{{{vacancies_title}}}}</h2>
  <div class="vac-grid">{{{{vacancies_html}}}}</div>
</div></section>
<div class="partners"><div class="wrap"><div class="card"><h2>Наши сотрудники работают в</h2><p>Смены в крупных сетях и на складах, официально через «{{{{brand_name}}}}»</p><div class="logos">{{{{partners_html}}}}</div></div></div></div>
<section id="steps" style="padding-top:0"><div class="wrap">
  <div class="sec-label">Этапы</div><h2>Выйти на работу — это просто</h2>
  <div class="steps">{{{{steps_html}}}}</div>
</div></section>
<section class="form-sec" id="form"><div class="wrap">
  <div class="sec-label">Контакты</div><h2>Начнём?</h2>
  <div class="form-grid">
    <div class="info-card">
      <p class="lead">Оставьте номер: перезвоним, подберём смены рядом с домом и расскажем, что взять с собой в первый день.</p>
      {CONTACT_LINES}
    </div>
    {FORM_MAIN}
  </div>
</div></section>
</main>
<footer><div class="wrap row">
  <a class="brand" href="#top">{{{{brand_logo}}}}<span>Урбан <em>Сервис</em></span></a>
  <div>{{{{legal}}}} · {{{{address}}}}</div>
  <div><a href="tel:{{{{phone_link}}}}">{{{{phone_display}}}}</a> · <a href="mailto:{{{{email}}}}">{{{{email}}}}</a></div>
</div></footer>
{BAR}
'''

# =====================================================================================
# ИНСТАФФ — по сайту in-staff.ru: белая шапка с INSTAFF, крупный телефон; фото-хиро с тёмным оверлеем,
# белый Oswald капсом по центру, синяя прямоугольная кнопка, скос-шеврон снизу; серые секции, центрированные заголовки.
# =====================================================================================
INSTAFF_CSS = r"""
:root{--ink:#333333;--ink2:#444444;--muted:#6B6F78;--line:#E3E6EC;--bg:#F5F5F5;--accent:#6B93CA;--accent-d:#4F7AB8;--accent-soft:#E4EDF9;
--font-h:Oswald,'Arial Narrow',Arial,sans-serif;--font-btn:Oswald,'Arial Narrow',Arial,sans-serif;--h-case:uppercase;--h-ls:.02em;--btn-r:2px;--in-r:2px;--card-r:2px;--max:1140px}
.btn{font-size:16px;font-weight:500;letter-spacing:.06em;text-transform:uppercase}
header{position:sticky;top:0;z-index:40;background:#fff;box-shadow:0 1px 0 var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;height:66px;gap:12px}
.brand{display:flex;align-items:center;gap:14px;text-decoration:none}
.brand svg{height:30px;width:auto}
.brand small{display:block;font-size:12px;font-weight:600;color:var(--ink)}
.nav-right{display:flex;align-items:center;gap:14px}
.nav-phone{text-decoration:none;font-family:Oswald,Arial,sans-serif;font-size:20px;color:var(--ink);display:flex;align-items:center;gap:8px}
.nav-phone svg{color:var(--accent)}.nav-phone span{display:none}@media(min-width:640px){.nav-phone span{display:inline}}
.nav-cta{display:none}@media(min-width:860px){.nav-cta{display:inline-flex;min-height:44px;padding:0 24px;font-size:14px}}
.hero{position:relative;color:#fff;background:#333;padding:64px 0 96px;text-align:center;clip-path:polygon(0 0,100% 0,100% calc(100% - 34px),50% 100%,0 calc(100% - 34px))}
@media(min-width:860px){.hero{padding:120px 0 150px;clip-path:polygon(0 0,100% 0,100% calc(100% - 60px),50% 100%,0 calc(100% - 60px))}}
.hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:{{hero_pos}};filter:grayscale(.35)}
.hero::after{content:"";position:absolute;inset:0;background:rgba(40,40,40,.62)}
.hero .wrap{position:relative;z-index:1}
.kicker{font-family:Oswald,Arial,sans-serif;font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:#fff;opacity:.9;margin-bottom:16px}
h1{font-size:clamp(34px,6vw,64px);font-weight:700;line-height:1.05;margin-bottom:16px;max-width:820px;margin-left:auto;margin-right:auto}
p.lead{font-family:Oswald,Arial,sans-serif;font-weight:400;font-size:clamp(16px,2vw,20px);letter-spacing:.06em;text-transform:uppercase;opacity:.95;max-width:640px;margin:0 auto 28px}
.hero-actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.hero-actions .btn{flex:1 1 100%}@media(min-width:640px){.hero-actions .btn{flex:0 0 auto;min-width:220px}}
.hero .btn-ghost{color:#fff;border-color:#fff}.hero .btn-ghost:hover{background:#fff;color:var(--ink)}
.facts{position:relative;z-index:2;margin-top:-56px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
@media(max-width:480px){.facts{grid-template-columns:1fr 1fr}.fact:last-child{grid-column:1/-1}}
@media(min-width:860px){.facts{margin-top:-70px;gap:16px}}
.fact{background:#fff;padding:18px 14px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.08);min-width:0}
.fact b{display:block;font-family:Oswald,Arial,sans-serif;font-size:clamp(20px,3vw,32px);font-weight:700;color:var(--accent-d);line-height:1.1;text-transform:uppercase}
.fact span{display:block;font-size:12px;color:var(--muted);margin-top:4px}
.stats{padding:36px 0 0;text-align:center}
.stats .wrap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.stat b{display:block;font-family:Oswald,Arial,sans-serif;font-size:clamp(28px,4vw,48px);font-weight:700;line-height:1;color:var(--ink)}
.stat b i{font-style:normal;color:var(--accent)}
.stat span{display:block;font-size:12px;color:var(--muted);margin-top:6px}
.stats-note{font-size:11px;color:var(--muted);padding-top:12px;text-align:center}
section{padding:52px 0}@media(min-width:860px){section{padding:80px 0}}
h2{font-size:clamp(28px,4vw,44px);font-weight:700;text-align:center;margin-bottom:30px}
.sec-label{display:none}
.why-grid{display:grid;gap:12px}@media(min-width:640px){.why-grid{grid-template-columns:1fr 1fr}}@media(min-width:1000px){.why-grid{grid-template-columns:repeat(4,1fr)}}
.why{background:#fff;padding:26px 20px;text-align:center;border-bottom:3px solid var(--accent)}
.why .ic{width:48px;height:48px;margin:0 auto 14px;display:grid;place-items:center;background:var(--accent-soft);border-radius:50%}
.why .ic svg{width:24px;height:24px;stroke:var(--accent-d)}
.why h3{font-size:18px;font-weight:600;margin-bottom:8px}.why p{font-size:14px;color:var(--muted)}
.vac-grid{display:grid;gap:14px}@media(min-width:860px){.vac-grid{grid-template-columns:1fr 1fr}}
.vac{background:#fff;padding:24px;display:flex;flex-direction:column;gap:14px;border-top:3px solid var(--accent)}
.vac-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}
.vac h3{font-size:22px;font-weight:600}
.rate{text-align:right}
.rate b{display:block;font-family:Oswald,Arial,sans-serif;font-size:26px;font-weight:700;color:var(--accent-d);white-space:nowrap;line-height:1}
.rate b.tbd{font-size:14px;white-space:normal;max-width:150px}
.rate span{display:block;font-size:12px;color:var(--muted);margin-top:4px}
.vac ul li::before{content:"";position:absolute;left:0;top:8px;width:8px;height:8px;background:var(--accent)}
.vac ul.req li::before{background:transparent;border:2px solid var(--accent)}
.partners{background:#fff;padding:44px 0}
.partners h2{font-size:26px;margin-bottom:6px}
.partners p{text-align:center;color:var(--muted);margin-bottom:26px;font-size:14px}
.steps{display:grid;gap:12px}@media(min-width:860px){.steps{grid-template-columns:repeat(4,1fr)}}
.step{background:#fff;padding:24px 20px;text-align:center}
.step i{display:grid;place-items:center;width:44px;height:44px;margin:0 auto 14px;background:var(--accent);color:#fff;font-style:normal;font-family:Oswald,Arial,sans-serif;font-weight:700;font-size:20px}
.step h3{font-size:18px;font-weight:600;margin-bottom:4px}.step p{font-size:14px;color:var(--muted)}
.form-sec{background:#333;color:#fff}
.form-sec h2{color:#fff;text-align:left}
.form-grid{display:grid;gap:28px;align-items:center}@media(min-width:860px){.form-grid{grid-template-columns:1fr 1fr;gap:56px}}
.form-sec p.lead{text-align:left;margin:0 0 22px;text-transform:none;font-family:Inter,sans-serif;letter-spacing:0;font-size:16px;color:rgba(255,255,255,.75)}
.contact-lines{display:grid;gap:10px;font-weight:600}
.contact-lines a{text-decoration:none;display:flex;gap:10px;align-items:center}
.contact-lines svg{color:var(--accent)}
form.lead{background:#fff;color:var(--ink);padding:28px 24px}@media(min-width:640px){form.lead{padding:34px 32px}}
form.lead h3{font-size:24px;margin-bottom:4px}form.lead .hint{font-size:14px;color:var(--muted);margin-bottom:18px}
footer{background:#fff;color:var(--muted);padding:26px 0;font-size:12px;border-top:1px solid var(--line)}
footer .row{display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between;align-items:center}
footer a{text-decoration:none}
"""

INSTAFF_BODY = f'''
<header>
  <div class="wrap nav">
    <a class="brand" href="#top" aria-label="{{{{brand_name}}}}">{{{{brand_logo}}}}<small>вакансии рядом с домом</small></a>
    <div class="nav-right">
      <a class="nav-phone" href="tel:{{{{phone_link}}}}" data-ym="phone_click">{PHONE_SVG}<span>{{{{phone_display}}}}</span></a>
      <button class="btn btn-primary nav-cta" data-open="">Откликнуться</button>
    </div>
  </div>
</header>
<main id="top">
<section class="hero">
  <img src="{{{{hero_photo}}}}" alt="" loading="eager" fetchpriority="high" onerror="this.remove()">
  <div class="wrap">
    <div class="kicker">{{{{eyebrow}}}}</div>
    <h1>{{{{h1}}}}</h1>
    <p class="lead">{{{{sub}}}}</p>
    <div class="hero-actions">{{{{hero_buttons}}}}</div>
  </div>
</section>
<div class="wrap facts">{{{{facts_html}}}}</div>
<div class="stats"><div class="wrap">{{{{stats_html}}}}</div><div class="wrap stats-note">«{{{{brand_name}}}}» входит в группу компаний «РМ Групп»</div></div>
<section id="about"><div class="wrap"><h2>Почему с нами</h2><div class="why-grid">{{{{why_html}}}}</div></div></section>
<section id="vacancies" style="padding-top:0"><div class="wrap"><h2>{{{{vacancies_title}}}}</h2><div class="vac-grid">{{{{vacancies_html}}}}</div></div></section>
<div class="partners"><div class="wrap"><h2>Наши сотрудники работают в</h2><p>Смены в крупных сетях и на складах, официально через «{{{{brand_name}}}}»</p><div class="logos">{{{{partners_html}}}}</div></div></div>
<section id="steps"><div class="wrap"><h2>Как выйти на работу</h2><div class="steps">{{{{steps_html}}}}</div></div></section>
<section class="form-sec" id="form"><div class="wrap form-grid">
  <div>
    <h2>Ответим на все вопросы</h2>
    <p class="lead">Оставьте номер: перезвоним, подберём смены рядом с домом и расскажем, что взять с собой в первый день.</p>
    {CONTACT_LINES}
  </div>
  {FORM_MAIN}
</div></section>
</main>
<footer><div class="wrap row">
  <a class="brand" href="#top">{{{{brand_logo}}}}</a>
  <div>{{{{legal}}}} · {{{{address}}}}</div>
  <div><a href="tel:{{{{phone_link}}}}">{{{{phone_display}}}}</a> · <a href="mailto:{{{{email}}}}">{{{{email}}}}</a></div>
</div></footer>
{BAR}
'''

SKINS = {
  'rmgk':    dict(css=RMGK_CSS,    body=RMGK_BODY),
  'urban':   dict(css=URBAN_CSS,   body=URBAN_BODY),
  'instaff': dict(css=INSTAFF_CSS, body=INSTAFF_BODY),
}

# =====================================================================================
# ОРИОН — Dark Space (orion-landing.html): тёмный #0C1527, синий градиентный hero, стеклянный чип,
# Space Grotesk H1 с голубой акцентной строкой, фиолетово-синяя градиентная кнопка-пилюля, тёмные карточки с тонкой рамкой.
# =====================================================================================
ORION_CSS = r"""
:root{--ink:#F8FAFC;--ink2:#CBD5E1;--muted:#8A97B0;--line:rgba(255,255,255,.13);--bg:#0C1527;--card:#0D1424;--accent:#1D4ED8;--accent-d:#1E40AF;--accent-lt:#60A5FA;--accent-soft:rgba(29,78,216,.18);--violet:#7C3AED;--mist:#BAE6FD;
--font-h:"Space Grotesk",Inter,system-ui,sans-serif;--font-btn:Inter,system-ui,sans-serif;--h-case:none;--h-ls:-.03em;--btn-r:10px;--in-r:10px;--card-r:16px;--max:1240px}
body{background:var(--bg);color:var(--ink)}
.btn{font-size:14px;font-weight:600}
.btn-primary{background:linear-gradient(135deg,#1D4ED8,#7C3AED);color:#fff;box-shadow:0 8px 24px rgba(124,58,237,.3)}.btn-primary:hover{filter:brightness(1.1)}
.btn-ghost{color:#fff;border:1px solid rgba(255,255,255,.45);background:rgba(255,255,255,.1);backdrop-filter:blur(10px)}.btn-ghost:hover{background:rgba(255,255,255,.2);color:#fff}
header{position:sticky;top:0;z-index:40;background:rgba(2,6,23,.7);backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;height:60px;gap:12px}
.brand{display:flex;align-items:center;gap:9px;text-decoration:none;font-weight:700;font-size:16px;color:#fff}
.brand svg{width:32px;height:32px}
.brand small{display:block;font-weight:400;font-size:11px;color:var(--muted)}
.nav-right{display:flex;align-items:center;gap:10px}
.nav-phone{display:flex;align-items:center;gap:8px;font-weight:600;font-size:14px;text-decoration:none;padding:9px 12px;border-radius:10px;border:1px solid var(--line);color:#fff}
.nav-phone span{display:none}@media(min-width:640px){.nav-phone span{display:inline}}
.nav-cta{display:none}@media(min-width:860px){.nav-cta{display:inline-flex;min-height:40px;padding:0 20px}}
.hero{position:relative;overflow:hidden;background:linear-gradient(160deg,#0C1527 0%,#0C4A6E 45%,#0284C7 100%);color:#fff;padding:44px 0 40px}
@media(min-width:860px){.hero{padding:88px 0 80px}}
.hero::before{content:"";position:absolute;inset:0;background:radial-gradient(600px 300px at 90% 10%,rgba(124,58,237,.35),transparent 60%),radial-gradient(500px 300px at 10% 90%,rgba(96,165,250,.25),transparent 60%);pointer-events:none}
.stars{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(1.5px 1.5px at 12% 22%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 38% 68%,rgba(255,255,255,.6),transparent),radial-gradient(1.5px 1.5px at 72% 32%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 88% 78%,rgba(255,255,255,.6),transparent),radial-gradient(1px 1px at 55% 12%,rgba(255,255,255,.5),transparent),radial-gradient(1.2px 1.2px at 25% 85%,rgba(255,255,255,.6),transparent)}
.hero-grid{position:relative;display:grid;gap:26px;align-items:end}
@media(min-width:960px){.hero-grid{grid-template-columns:1.2fr .8fr;gap:56px}}
.chip{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(10px);color:#fff;font-size:12px;font-weight:600;padding:7px 14px;border-radius:100px;margin-bottom:22px;max-width:100%}
.chip::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--mist);flex:none}
h1{font-size:clamp(38px,6vw,72px);font-weight:700;line-height:.98;letter-spacing:-.04em;margin-bottom:22px;color:#fff}
h1 .g{color:var(--mist)}
p.lead{font-size:16px;line-height:1.65;color:rgba(255,255,255,.85);max-width:560px;margin-bottom:26px}
.hero-actions{display:flex;flex-wrap:wrap;gap:12px}
.hero-actions .btn{flex:1 1 100%}@media(min-width:640px){.hero-actions .btn{flex:0 0 auto;min-width:200px}}
.hero-photo{position:relative;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,.2);box-shadow:0 30px 60px rgba(0,0,0,.4)}
.hero-photo img{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:{{hero_pos}}}
@media(min-width:960px){.hero-photo img{aspect-ratio:4/4.2}}
.hero-badge{position:absolute;left:14px;bottom:14px;right:14px;background:rgba(2,6,23,.72);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:12px 16px;display:flex;gap:12px;align-items:center}
.hero-badge b{font-family:var(--font-h);font-size:24px;font-weight:700;color:var(--mist);line-height:1}.hero-badge span{font-size:12px;color:rgba(255,255,255,.7)}
.facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:20px 0 0}
@media(max-width:400px){.facts{grid-template-columns:1fr 1fr}.fact:last-child{grid-column:1/-1}}
.fact{background:var(--card);border:1px solid var(--line);border-radius:var(--card-r);padding:18px 16px;min-width:0;transition:border-color .3s,transform .3s}
.fact:hover{border-color:rgba(29,78,216,.5);transform:translateY(-2px)}
.fact b{display:block;font-family:var(--font-h);font-size:clamp(20px,3vw,30px);font-weight:700;color:var(--accent-lt);letter-spacing:-.02em;line-height:1.1}
.fact span{display:block;font-size:12px;color:var(--muted);margin-top:4px}
.stats{padding:24px 0 0}
.stats .wrap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.stat b{display:block;font-family:var(--font-h);font-size:clamp(26px,4vw,44px);font-weight:700;letter-spacing:-.03em;line-height:1;color:#fff}
.stat b i{font-style:normal;color:var(--violet)}
.stat span{display:block;font-size:12px;color:var(--muted);margin-top:6px}
.stats-note{font-size:11px;color:var(--muted);padding-top:12px}
section{padding:56px 0}@media(min-width:860px){section{padding:84px 0}}
.sec-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;color:var(--accent-lt);margin-bottom:10px}
h2{font-size:clamp(26px,3.6vw,40px);font-weight:700;margin-bottom:24px;color:#fff}
.why-grid{display:grid;gap:12px}@media(min-width:640px){.why-grid{grid-template-columns:1fr 1fr}}@media(min-width:1000px){.why-grid{grid-template-columns:repeat(4,1fr)}}
.why{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:26px 22px;position:relative;overflow:hidden;transition:border-color .3s,transform .3s}
.why::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(29,78,216,.12),transparent 60%);opacity:0;transition:opacity .3s}
.why:hover{border-color:rgba(29,78,216,.4);transform:translateY(-3px)}.why:hover::before{opacity:1}
.why .ic{width:42px;height:42px;border-radius:12px;background:var(--accent-soft);display:grid;place-items:center;margin-bottom:16px;position:relative}
.why .ic svg{width:22px;height:22px;stroke:var(--accent-lt)}
.why h3{font-size:17px;font-weight:700;margin-bottom:8px;color:#fff;position:relative}.why p{font-size:14px;color:var(--muted);position:relative}
.vac-grid{display:grid;gap:14px}@media(min-width:860px){.vac-grid{grid-template-columns:1fr 1fr}}
.vac{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:14px;transition:border-color .3s}
.vac:hover{border-color:rgba(96,165,250,.45)}
.vac-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}
.vac h3{font-size:20px;font-weight:700;color:#fff}
.rate{text-align:right}
.rate b{display:block;font-family:var(--font-h);font-size:24px;font-weight:700;color:var(--mist);white-space:nowrap;line-height:1}
.rate b.tbd{font-size:13px;font-family:Inter,sans-serif;color:var(--accent-lt);white-space:normal;max-width:150px}
.rate span{display:block;font-size:12px;color:var(--muted);margin-top:4px}
.meta div{background:rgba(255,255,255,.04);border:1px solid var(--line);color:var(--ink2)}
.meta div small{color:var(--muted)}
.vac ul{color:var(--ink2)}
.vac ul li::before{content:"";position:absolute;left:0;top:7px;width:8px;height:8px;border-radius:50%;background:var(--accent-lt)}
.vac ul.req li::before{background:transparent;border:2px solid var(--violet)}
.vac .btn{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.25)}.vac .btn:hover{background:linear-gradient(135deg,#1D4ED8,#7C3AED);border-color:transparent}
@media(max-width:859px){.vac .btn{background:linear-gradient(135deg,#1D4ED8,#7C3AED);border-color:transparent}}
.partners{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:44px 0;background:rgba(255,255,255,.02)}
.partners h2{font-size:22px;text-align:center;margin-bottom:6px}
.partners p{text-align:center;color:var(--muted);margin-bottom:26px;font-size:14px}
.logos img{filter:grayscale(1) brightness(0) invert(1);opacity:.55}.logos img:hover{opacity:.9;filter:grayscale(1) brightness(0) invert(1)}
.steps{display:grid;gap:12px}@media(min-width:860px){.steps{grid-template-columns:repeat(4,1fr)}}
.step{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:24px 22px;position:relative}
.step i{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#1D4ED8,#7C3AED);color:#fff;font-style:normal;font-weight:700;font-size:14px;margin-bottom:16px;font-family:var(--font-h)}
.step h3{font-size:17px;font-weight:700;margin-bottom:6px;color:#fff}.step p{font-size:14px;color:var(--muted)}
.form-sec{background:linear-gradient(160deg,#0C1527,#0C4A6E);border-top:1px solid var(--line)}
.form-grid{display:grid;gap:28px;align-items:center}@media(min-width:860px){.form-grid{grid-template-columns:1fr 1fr;gap:56px}}
.form-sec p.lead{color:rgba(255,255,255,.75)}
.contact-lines{display:grid;gap:10px;font-weight:600}
.contact-lines a{text-decoration:none;display:flex;gap:10px;align-items:center;color:#fff}
.contact-lines svg{color:var(--accent-lt)}
form.lead{background:#fff;color:#111827;border-radius:20px;padding:28px 24px;box-shadow:0 30px 60px rgba(0,0,0,.4)}@media(min-width:640px){form.lead{padding:34px 32px}}
form.lead h3{font-size:22px;margin-bottom:4px;color:#111827}form.lead .hint{font-size:14px;color:#6B7280;margin-bottom:18px}
form.lead .field label{color:#374151}form.lead .field input{border-color:#E5E7EB;color:#111827}
form.lead .consent{color:#6B7280}form.lead .consent a{color:#6B7280}
.modal .box{background:#fff;color:#111827}.modal .x{background:#F3F4F6}.modal .hint{color:#6B7280}.modal .field label{color:#374151}.modal .field input{border-color:#E5E7EB;color:#111827}.modal .consent,.modal .consent a{color:#6B7280}
.modal .vac-name{background:#EEF2FF;color:#1D4ED8}
.bar{background:rgba(2,6,23,.9);border-top:1px solid var(--line)}.bar .call{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#fff}
footer{border-top:1px solid var(--line);color:var(--muted);padding:24px 0;font-size:12px}
footer .row{display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between;align-items:center}
footer .brand{color:rgba(255,255,255,.5);font-size:14px}footer .brand svg{width:24px;height:24px}footer a{text-decoration:none}
"""

ORION_BODY = f'''
<header>
  <div class="wrap nav">
    <a class="brand" href="#top" aria-label="{{{{brand_name}}}}">{{{{brand_logo}}}}<span>{{{{brand_name}}}}<small>вакансии рядом с домом</small></span></a>
    <div class="nav-right">
      <a class="nav-phone" href="tel:{{{{phone_link}}}}" data-ym="phone_click">{PHONE_SVG}<span>{{{{phone_display}}}}</span></a>
      <button class="btn btn-primary nav-cta" data-open="">Откликнуться</button>
    </div>
  </div>
</header>
<main id="top">
<section class="hero">
  <div class="stars" aria-hidden="true"></div>
  <div class="wrap hero-grid">
    <div>
      <div class="chip">{{{{eyebrow}}}}</div>
      <h1>{{{{h1_accent}}}}</h1>
      <p class="lead">{{{{sub}}}}</p>
      <div class="hero-actions">{{{{hero_buttons}}}}</div>
    </div>
    <div class="hero-photo">
      <img src="{{{{hero_photo}}}}" alt="" loading="eager" fetchpriority="high" onerror="this.parentNode.remove()">
      <div class="hero-badge"><b>{{{{fact1_b}}}}</b><span>{{{{fact1_s}}}}</span></div>
    </div>
  </div>
</section>
<div class="wrap facts">{{{{facts_html}}}}</div>
<div class="stats"><div class="wrap">{{{{stats_html}}}}</div><div class="wrap stats-note">«{{{{brand_name}}}}» входит в группу компаний «РМ Групп»</div></div>
<section id="about"><div class="wrap"><div class="sec-label">Почему мы</div><h2>Почему с нами</h2><div class="why-grid">{{{{why_html}}}}</div></div></section>
<section id="vacancies" style="padding-top:0"><div class="wrap"><div class="sec-label">Вакансии</div><h2>{{{{vacancies_title}}}}</h2><div class="vac-grid">{{{{vacancies_html}}}}</div></div></section>
<div class="partners"><div class="wrap"><h2>Наши сотрудники работают в</h2><p>Смены в крупных сетях и на складах, официально через «{{{{brand_name}}}}»</p><div class="logos">{{{{partners_html}}}}</div></div></div>
<section id="steps"><div class="wrap"><div class="sec-label">Этапы</div><h2>Как выйти на работу</h2><div class="steps">{{{{steps_html}}}}</div></div></section>
<section class="form-sec" id="form"><div class="wrap form-grid">
  <div>
    <div class="sec-label">Контакты</div><h2>Ответим на все вопросы</h2>
    <p class="lead">Оставьте номер: перезвоним, подберём смены рядом с домом и расскажем, что взять с собой в первый день.</p>
    {CONTACT_LINES}
  </div>
  {FORM_MAIN}
</div></section>
</main>
<footer><div class="wrap row">
  <a class="brand" href="#top">{{{{brand_logo}}}}<span>{{{{brand_name}}}}</span></a>
  <div>{{{{legal}}}} · {{{{address}}}}</div>
  <div><a href="tel:{{{{phone_link}}}}">{{{{phone_display}}}}</a> · <a href="mailto:{{{{email}}}}">{{{{email}}}}</a></div>
</div></footer>
{BAR}
'''

# =====================================================================================
# АРКАДА — индустриальная медь (arkada-landing.html): бежевый #FAF6EE, тёмно-коричневая шапка, Oswald капсом,
# H1 с медной второй строкой и контурной третьей, короткая медная линия, прямоугольные кнопки капсом, контурные теги,
# белая полоса цифр с медными суффиксами, шестерёнки контуром на фоне hero.
# =====================================================================================
ARKADA_CSS = r"""
:root{--ink:#3A2C1C;--ink2:#5A4632;--muted:#A89880;--mid:#7A6858;--line:rgba(58,44,28,.12);--bg:#FAF6EE;--bg2:#F0E8D4;--bg3:#E4D8C4;--dark:#2E2318;--accent:#B07040;--accent-d:#8A5530;--accent-lt:#C98F60;--accent-soft:#F0E8D4;
--font-h:Oswald,'Arial Narrow',Arial,sans-serif;--font-btn:Inter,system-ui,sans-serif;--h-case:uppercase;--h-ls:.01em;--btn-r:2px;--in-r:2px;--card-r:2px;--max:1140px}
body{background:var(--bg)}
.btn{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.14em}
.btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{background:var(--accent-lt)}
.btn-ghost{background:transparent;color:var(--mid);border:1px solid rgba(58,44,28,.25)}.btn-ghost:hover{background:var(--dark);color:#fff;border-color:var(--dark)}
header{position:sticky;top:0;z-index:40;background:var(--dark);border-bottom:1px solid rgba(255,255,255,.08)}
.nav{display:flex;align-items:center;justify-content:space-between;height:58px;gap:12px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--accent-lt);font-family:var(--font-h);font-weight:700;font-size:18px;letter-spacing:.14em;text-transform:uppercase}
.brand svg{width:30px;height:30px}
.brand small{display:block;font-family:Inter,sans-serif;font-weight:500;font-size:10px;letter-spacing:.06em;color:rgba(255,255,255,.5);text-transform:none}
.nav-right{display:flex;align-items:center;gap:10px}
.nav-phone{display:flex;align-items:center;gap:8px;font-weight:600;font-size:13px;letter-spacing:.06em;text-decoration:none;padding:9px 12px;border:1px solid rgba(255,255,255,.2);color:#fff}
.nav-phone svg{color:var(--accent-lt)}.nav-phone span{display:none}@media(min-width:640px){.nav-phone span{display:inline}}
.nav-cta{display:none}@media(min-width:860px){.nav-cta{display:inline-flex;min-height:40px;padding:0 22px}}
.hero{position:relative;overflow:hidden;background:var(--bg2);padding:44px 0 36px}
@media(min-width:860px){.hero{padding:80px 0 64px}}
.gears{position:absolute;left:-40px;top:-30px;width:560px;height:520px;opacity:.55;pointer-events:none}
@media(max-width:859px){.gears{width:360px;height:340px;left:-80px;top:auto;bottom:-60px;opacity:.35}}
.hero-grid{position:relative;display:grid;gap:26px;align-items:center}
@media(min-width:960px){.hero-grid{grid-template-columns:1fr 1fr;gap:56px}}
.kicker{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:18px}
h1{font-size:clamp(34px,5.6vw,66px);font-weight:700;line-height:1;margin-bottom:18px}
h1 .cu{color:var(--accent)}
h1 .outline{-webkit-text-stroke:2px rgba(158,84,20,.55);color:transparent}
.rule{width:48px;height:2px;background:var(--accent);margin:0 0 22px}
p.lead{font-size:16px;line-height:1.6;color:var(--ink2);max-width:520px;margin-bottom:24px}
.hero-actions{display:flex;flex-wrap:wrap;gap:12px}
.hero-actions .btn{flex:1 1 100%}@media(min-width:640px){.hero-actions .btn{flex:0 0 auto;min-width:200px}}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.tag{border:1px solid var(--accent);color:var(--accent-d);background:rgba(255,255,255,.4);font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding:6px 12px}
.hero-photo{position:relative;border:1px solid var(--line);background:#fff;padding:8px}
.hero-photo img{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:{{hero_pos}};filter:sepia(.18) contrast(1.02)}
@media(min-width:960px){.hero-photo img{aspect-ratio:4/3.6}}
.hero-badge{position:absolute;left:8px;bottom:8px;background:var(--dark);color:#fff;padding:12px 16px;display:flex;gap:12px;align-items:center}
.hero-badge b{font-family:var(--font-h);font-size:26px;font-weight:700;color:var(--accent-lt);line-height:1;text-transform:uppercase}.hero-badge span{font-size:12px;color:rgba(255,255,255,.7)}
.facts{background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.facts .wrap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;padding-left:0;padding-right:0}
.fact{padding:26px 20px;border-right:1px solid var(--line);min-width:0}.fact:last-child{border-right:0}
@media(max-width:480px){.facts .wrap{grid-template-columns:1fr 1fr}.fact:nth-child(2){border-right:0}.fact:last-child{grid-column:1/-1;border-top:1px solid var(--line)}}
.fact b{display:block;font-family:var(--font-h);font-size:clamp(28px,4vw,48px);font-weight:700;color:var(--ink);line-height:1;text-transform:uppercase;letter-spacing:.01em}
.fact b i{font-style:normal;color:var(--accent);font-size:.55em}
.fact span{display:block;font-size:12px;color:var(--mid);margin-top:6px}
.stats{padding:26px 0 0}
.stats .wrap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.stat b{display:block;font-family:var(--font-h);font-size:clamp(26px,4vw,44px);font-weight:700;line-height:1;color:var(--ink)}
.stat b i{font-style:normal;color:var(--accent)}
.stat span{display:block;font-size:12px;color:var(--mid);margin-top:6px}
.stats-note{font-size:11px;color:var(--muted);padding-top:12px;letter-spacing:.04em}
section{padding:56px 0}@media(min-width:860px){section{padding:88px 0}}
.sec-label{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:14px}
h2{font-size:clamp(26px,3.5vw,42px);font-weight:700;margin-bottom:26px;line-height:1.08}
.why-grid{display:grid;gap:0;border-top:1px dashed var(--line)}
@media(min-width:760px){.why-grid{grid-template-columns:1fr 1fr}}@media(min-width:1000px){.why-grid{grid-template-columns:repeat(4,1fr)}}
.why{padding:22px 0;border-bottom:1px dashed var(--line);display:grid;grid-template-columns:44px 1fr;gap:4px 14px;align-content:start}
.why .ic{grid-row:1/3}.why h3,.why p{grid-column:2}
@media(min-width:760px){.why{padding:24px 20px 24px 0}.why+.why{padding-left:20px}}
.why .ic{width:36px;height:36px;background:var(--bg2);display:grid;place-items:center}
.why .ic svg{width:18px;height:18px;stroke:var(--accent)}
.why h3{font-size:15px;font-weight:700;margin-bottom:5px;font-family:Inter,sans-serif;text-transform:none;letter-spacing:0}.why p{font-size:13.5px;color:var(--mid)}
.vac-grid{display:grid;gap:16px}@media(min-width:860px){.vac-grid{grid-template-columns:1fr 1fr}}
.vac{background:#fff;border:1px solid var(--line);padding:24px;display:flex;flex-direction:column;gap:14px;position:relative}
.vac::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--accent)}
.vac-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}
.vac h3{font-size:22px;font-weight:600}
.rate{text-align:right}
.rate b{display:block;font-family:var(--font-h);font-size:26px;font-weight:700;color:var(--accent);white-space:nowrap;line-height:1}
.rate b.tbd{font-size:13px;font-family:Inter,sans-serif;font-weight:600;white-space:normal;max-width:150px}
.rate span{display:block;font-size:12px;color:var(--mid);margin-top:4px}
.meta div{background:var(--bg);border:1px solid var(--line)}
.vac ul li::before{content:"";position:absolute;left:0;top:8px;width:7px;height:7px;background:var(--accent)}
.vac ul.req li::before{background:transparent;border:1.5px solid var(--ink)}
.vac .btn{background:transparent;color:var(--ink);border:1px solid rgba(58,44,28,.35)}.vac .btn:hover{background:var(--accent);border-color:var(--accent);color:#fff}
@media(max-width:859px){.vac .btn{background:var(--accent);border-color:var(--accent);color:#fff}}
.partners{background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:44px 0}
.partners h2{font-size:24px;text-align:center;margin-bottom:6px}
.partners p{text-align:center;color:var(--mid);margin-bottom:26px;font-size:14px}
.logos img{filter:grayscale(1) sepia(.4);opacity:.6}
.steps{display:grid;gap:0;border-top:1px solid var(--line)}
@media(min-width:860px){.steps{grid-template-columns:repeat(4,1fr)}}
.step{padding:24px 0;border-bottom:1px solid var(--line);display:grid;grid-template-columns:56px 1fr;gap:12px;align-items:start}
@media(min-width:860px){.step{display:block;padding:28px 20px 28px 0;border-bottom:0}.step+.step{padding-left:20px;border-left:1px solid var(--line)}}
.step i{font-family:var(--font-h);font-style:normal;font-weight:700;font-size:40px;line-height:1;color:var(--accent);display:block;margin-bottom:12px}
.step i::before{content:"0"}
.step h3{font-size:15px;font-weight:700;font-family:Inter,sans-serif;text-transform:none;letter-spacing:0;margin-bottom:4px}.step p{font-size:13.5px;color:var(--mid)}
.form-sec{background:var(--dark);color:#fff}
.form-sec h2{color:#fff}
.form-grid{display:grid;gap:28px;align-items:center}@media(min-width:860px){.form-grid{grid-template-columns:1fr 1fr;gap:56px}}
.form-sec p.lead{color:rgba(255,255,255,.7)}
.contact-lines{display:grid;gap:10px;font-weight:600}
.contact-lines a{text-decoration:none;display:flex;gap:10px;align-items:center}
.contact-lines svg{color:var(--accent-lt)}
form.lead{background:var(--bg);color:var(--ink);padding:28px 24px;border-top:4px solid var(--accent)}@media(min-width:640px){form.lead{padding:34px 32px}}
form.lead h3{font-size:24px;margin-bottom:4px}form.lead .hint{font-size:14px;color:var(--mid);margin-bottom:18px}
.field input{background:#fff}
.modal .box{background:var(--bg)}
footer{background:var(--dark);color:rgba(255,255,255,.5);padding:22px 0;font-size:12px;border-top:1px solid rgba(255,255,255,.08)}
footer .row{display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between;align-items:center}
footer .brand{font-size:15px;opacity:.85}footer a{text-decoration:none}
.bar{background:rgba(250,246,238,.97)}.bar .call{background:var(--dark)}
"""

GEARS_SVG = '''<svg class="gears" viewBox="0 0 560 520" fill="none" stroke="#B07040" stroke-width="1.2" aria-hidden="true">
<g transform="translate(150,190)"><path d="M0-120 l16 0 4 24 22 8 18-16 12 12-16 18 8 22 24 4 0 16-24 4-8 22 16 18-12 12-18-16-22 8-4 24-16 0-4-24-22-8-18 16-12-12 16-18-8-22-24-4 0-16 24-4 8-22-16-18 12-12 18 16 22-8z" transform="scale(1.05)"/><circle r="34"/><circle r="10"/><path d="M0-34V-10M0 10V34M-34 0H-10M10 0H34" opacity=".5"/></g>
<g transform="translate(400,110)"><path d="M0-84 l11 0 3 17 15 6 13-11 8 8-11 13 6 15 17 3 0 11-17 3-6 15 11 13-8 8-13-11-15 6-3 17-11 0-3-17-15-6-13 11-8-8 11-13-6-15-17-3 0-11 17-3 6-15-11-13 8-8 13 11 15-6z"/><circle r="22"/><circle r="7"/></g>
<g transform="translate(330,380)"><path d="M0-62 l8 0 2 12 11 5 10-8 6 6-8 10 5 11 12 2 0 8-12 2-5 11 8 10-6 6-10-8-11 5-2 12-8 0-2-12-11-5-10 8-6-6 8-10-5-11-12-2 0-8 12-2 5-11-8-10 6-6 10 8 11-5z"/><circle r="16"/><circle r="5"/></g>
<g fill="#B07040" stroke="none" opacity=".5"><circle cx="60" cy="40" r="2"/><circle cx="480" cy="300" r="2"/><circle cx="250" cy="470" r="2"/><circle cx="520" cy="60" r="1.5"/><circle cx="30" cy="330" r="1.5"/></g>
</svg>'''

ARKADA_BODY = f'''
<header>
  <div class="wrap nav">
    <a class="brand" href="#top" aria-label="{{{{brand_name}}}}">{{{{brand_logo}}}}<span>{{{{brand_name}}}}<small>вакансии рядом с домом</small></span></a>
    <div class="nav-right">
      <a class="nav-phone" href="tel:{{{{phone_link}}}}" data-ym="phone_click">{PHONE_SVG}<span>{{{{phone_display}}}}</span></a>
      <button class="btn btn-primary nav-cta" data-open="">Откликнуться</button>
    </div>
  </div>
</header>
<main id="top">
<section class="hero">
  {GEARS_SVG}
  <div class="wrap hero-grid">
    <div>
      <div class="kicker">{{{{eyebrow}}}}</div>
      <h1>{{{{h1_arkada}}}}</h1>
      <div class="rule"></div>
      <p class="lead">{{{{sub}}}}</p>
      <div class="hero-actions">{{{{hero_buttons}}}}</div>
      <div class="tags">{{{{tags_html}}}}</div>
    </div>
    <div class="hero-photo">
      <img src="{{{{hero_photo}}}}" alt="" loading="eager" fetchpriority="high" onerror="this.parentNode.remove()">
      <div class="hero-badge"><b>{{{{fact1_b}}}}</b><span>{{{{fact1_s}}}}</span></div>
    </div>
  </div>
</section>
<div class="facts"><div class="wrap">{{{{facts_html}}}}</div></div>
<div class="stats"><div class="wrap">{{{{stats_html}}}}</div><div class="wrap stats-note">«{{{{brand_name}}}}» входит в группу компаний «РМ Групп»</div></div>
<section id="about"><div class="wrap"><div class="sec-label">Почему мы</div><h2>Почему с нами</h2><div class="why-grid">{{{{why_html}}}}</div></div></section>
<section id="vacancies" style="padding-top:0"><div class="wrap"><div class="sec-label">Вакансии</div><h2>{{{{vacancies_title}}}}</h2><div class="vac-grid">{{{{vacancies_html}}}}</div></div></section>
<div class="partners"><div class="wrap"><h2>Наши сотрудники работают в</h2><p>Смены в крупных сетях и на складах, официально через «{{{{brand_name}}}}»</p><div class="logos">{{{{partners_html}}}}</div></div></div>
<section id="steps"><div class="wrap"><div class="sec-label">Этапы</div><h2>Как выйти на работу</h2><div class="steps">{{{{steps_html}}}}</div></div></section>
<section class="form-sec" id="form"><div class="wrap form-grid">
  <div>
    <div class="sec-label">Контакты</div><h2>Ответим на все вопросы</h2>
    <p class="lead">Оставьте номер: перезвоним, подберём смены рядом с домом и расскажем, что взять с собой в первый день.</p>
    {CONTACT_LINES}
  </div>
  {FORM_MAIN}
</div></section>
</main>
<footer><div class="wrap row">
  <a class="brand" href="#top">{{{{brand_logo}}}}<span>{{{{brand_name}}}}</span></a>
  <div>{{{{legal}}}} · {{{{address}}}}</div>
  <div><a href="tel:{{{{phone_link}}}}">{{{{phone_display}}}}</a> · <a href="mailto:{{{{email}}}}">{{{{email}}}}</a></div>
</div></footer>
{BAR}
'''

SKINS['orion']  = dict(css=ORION_CSS,  body=ORION_BODY)
SKINS['arkada'] = dict(css=ARKADA_CSS, body=ARKADA_BODY)
