#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Генератор лендингов вакансий РМ Групп.
  python3 build_landings.py            → собирает все лендинги из landings.json в sites/rabota/<slug>/index.html
Правки контента — только в landings.json. Дизайн/логика — в TEMPLATE ниже.
"""
import json, os, sys, html, re
from skins import SKINS, BASE_CSS, CITY_CSS, CITY_CSS_BRAND

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))          # корень репозитория (Сlaude Code)
OUT_DIR = os.path.join(ROOT, 'sites', 'rabota')
CFG = json.load(open(os.path.join(HERE, 'landings.json'), encoding='utf-8'))

def esc(s):
    return html.escape(str(s if s is not None else ''), quote=True)

def slug_id(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

# ---------------------------------------------------------------- template
HEAD = r"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{{page_title}}</title>
<meta name="description" content="{{description}}">
<meta property="og:title" content="{{h1}} — {{brand_name}}">
<meta property="og:description" content="{{description}}">
<meta property="og:image" content="{{og_image}}">
<meta name="theme-color" content="{{c_ink}}">
<link rel="icon" href="{{favicon}}" type="image/svg+xml">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon-{{brand_key}}-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="../assets/favicon-{{brand_key}}-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Oswald:wght@500;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
<style>
{{skin_css}}
</style>

</head>
<body>
"""

TAIL = r"""
<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">
  <div class="box">
    <button class="x" type="button" data-close aria-label="Закрыть">×</button>
    <div class="vac-name" id="m-vac"></div>
    <h3 id="m-title">Заявка на вакансию</h3>
    <p class="hint">Перезвоним в течение 15 минут в рабочее время</p>
    <form class="lead-modal" id="modalForm" novalidate>
      <div class="field"><label for="m-name">Ваше имя</label><input id="m-name" name="name" type="text" autocomplete="name" placeholder="Как к вам обращаться"></div>
      <div class="field"><label for="m-phone">Телефон</label><input id="m-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required></div>{{modal_city}}
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off">
      <input type="hidden" name="vacancy" value="{{sheet_vacancy}}">
      <button class="btn btn-primary btn-block" type="submit">{{modal_btn}}</button>
      <div class="form-msg"></div>
      <p class="consent">Нажимая кнопку, вы соглашаетесь с <a href="{{policy_url}}" target="_blank" rel="noopener">политикой конфиденциальности</a> и даёте <a href="{{consent_url}}" target="_blank" rel="noopener">согласие на обработку ПД</a>.</p>
    </form>
  </div>
</div>

<script>
(function(){
  var ENDPOINTS = [{{endpoints_js}}];
  var REGION = "{{region}}";
  var GOAL = "{{metrika_goal}}";
  var TG = "{{max_url}}";
  var PHONE_LINK = "{{phone_link}}";
  var PHONE = "{{phone_display}}";

  function ym_(goal){ try{ if(window.ym && GOAL){ ym({{metrika_id}}, 'reachGoal', goal); } }catch(e){} }

  /* phone mask */
  function mask(input){
    input.addEventListener('input', function(){
      var d = input.value.replace(/\D/g,'');
      if(d.charAt(0)==='8') d = '7'+d.slice(1);
      if(d.charAt(0)!=='7' && d.length) d = '7'+d;
      d = d.slice(0,11);
      var out = '+7';
      if(d.length>1) out += ' ('+d.slice(1,4);
      if(d.length>=4) out += ') '+d.slice(4,7);
      if(d.length>=7) out += '-'+d.slice(7,9);
      if(d.length>=9) out += '-'+d.slice(9,11);
      input.value = out;
    });
    input.addEventListener('focus', function(){ if(!input.value) input.value='+7 ('; });
    input.addEventListener('blur', function(){ if(input.value==='+7 (') input.value=''; });
  }
  document.querySelectorAll('input[type=tel]').forEach(mask);

  /* modal */
  var modal = document.getElementById('modal'), bar = document.getElementById('bar');
  var mVac = document.getElementById('m-vac'), mVacInput = document.querySelector('#modalForm input[name=vacancy]');
  var defaultVac = mVacInput.value;
  function openModal(vac){
    mVac.textContent = vac || defaultVac; mVacInput.value = vac || defaultVac;
    modal.classList.add('open'); document.body.style.overflow='hidden';
    setTimeout(function(){ document.getElementById('m-name').focus(); }, 250);
    ym_('form_open');
  }
  function closeModal(){ modal.classList.remove('open'); document.body.style.overflow=''; }
  document.querySelectorAll('[data-open]').forEach(function(b){ b.addEventListener('click', function(){ openModal(b.getAttribute('data-open')); }); });
  document.querySelectorAll('[data-close]').forEach(function(b){ b.addEventListener('click', closeModal); });
  modal.addEventListener('click', function(e){ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

  /* hide sticky bar when the big form is on screen */
  var formSec = document.getElementById('form');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ es.forEach(function(e){ bar.classList.toggle('hide', e.isIntersecting); }); }, {threshold:.25}).observe(formSec);
    var ro = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target);} }); }, {threshold:.15});
    document.querySelectorAll('.reveal').forEach(function(el){ ro.observe(el); });
  } else { document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); }); }

  /* submit */
  function utm(){ return (location.search||'').slice(1).slice(0,300); }
  function submit(form){
    var phoneEl = form.querySelector('input[name=phone]'), nameEl = form.querySelector('input[name=name]');
    var msg = form.querySelector('.form-msg'), btn = form.querySelector('button[type=submit]');
    var digits = phoneEl.value.replace(/\D/g,'');
    phoneEl.classList.remove('err'); msg.className='form-msg';
    if(digits.length!==11){ phoneEl.classList.add('err'); phoneEl.focus(); msg.textContent='Введите номер полностью: +7 (___) ___-__-__'; msg.className='form-msg show bad'; return; }{{city_check}}
    if(form.querySelector('input[name=website]').value){ done(form); return; }
    var body = new URLSearchParams({
      name: nameEl.value.trim(), phone: '+'+digits, vacancy: form.querySelector('input[name=vacancy]').value,
      region: {{region_expr}}, page: location.host + location.pathname, utm: utm()
    }).toString();
    btn.disabled = true; var old = btn.textContent; btn.textContent = 'Отправляем…';
    if(!ENDPOINTS.length){ console.warn('ENDPOINTS не заданы (demo)'); setTimeout(function(){ btn.disabled=false; btn.textContent=old; done(form); }, 600); return; }
    function post(url, ms){
      var ctl = ('AbortController' in window) ? new AbortController() : null;
      var timer = setTimeout(function(){ if(ctl) ctl.abort(); }, ms);
      var opts = {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: body};
      if(ctl) opts.signal = ctl.signal;
      if(url.indexOf('script.google.com')>-1){ opts.mode='no-cors'; opts.redirect='follow'; }
      return fetch(url, opts).then(function(r){
        clearTimeout(timer);
        if(r.type==='opaque') return {ok:true};
        return r.json();
      }).then(function(j){ if(!j.ok) throw new Error(j.error||'bad'); return true; })
        .catch(function(e){ clearTimeout(timer); throw e; });
    }
    var i = 0;
    function next(){
      if(i >= ENDPOINTS.length){
        btn.disabled=false; btn.textContent=old;
        msg.innerHTML = 'Не получилось отправить. Позвоните <a href="tel:'+PHONE_LINK+'">'+PHONE+'</a> или напишите в <a href="'+TG+'" target="_blank" rel="noopener">MAX</a>.';
        msg.className='form-msg show bad'; return;
      }
      var url = ENDPOINTS[i++];
      post(url, i===1 ? 7000 : 12000).then(function(){ done(form); }).catch(function(){ next(); });
    }
    next();
  }
  function done(form){
    ym_(GOAL);
    form.innerHTML = '<div class="success"><div class="ok-ic"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></div>'+
      '<h3>{{ok_title}}</h3><p>{{ok_text}}</p>'+
      '<a class="btn btn-tg btn-block" href="'+TG+'" target="_blank" rel="noopener">Написать в MAX</a></div>';
  }
  document.querySelectorAll('form').forEach(function(f){ f.addEventListener('submit', function(e){ e.preventDefault(); submit(f); }); });
  document.querySelectorAll('[data-ym]').forEach(function(a){ a.addEventListener('click', function(){ ym_(a.getAttribute('data-ym')); }); });{{city_js}}
})();
</script>
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym({{metrika_id}}, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/{{metrika_id}}" style="position:absolute;left:-9999px" alt=""></div></noscript>
<!-- /Yandex.Metrika counter -->
</body>
</html>
"""

# Режим «вакансии по городам» (ТЗ sbor 27.10.2026): включается, если у вакансий есть ключ cities.
# Город из списка уходит в колонку «Регион» таблицы «Отклики», приёмники заявок не меняются.
CITY_CHECK_JS = ("\n    var cityEl = form.querySelector('select[name=city]'); if(cityEl){ cityEl.classList.remove('err'); "
                 "if(!cityEl.value){ cityEl.classList.add('err'); cityEl.focus(); msg.textContent='Выберите город'; msg.className='form-msg show bad'; return; } }")
CITY_REGION_JS = "(form.querySelector('select[name=city]') ? form.querySelector('select[name=city]').value : REGION)"
CITY_JS = r"""

  /* вакансии по городам: город из карточки подставляется в форму отклика */
  var ALL_CITIES = __ALL__;
  var mTitle = document.getElementById('m-title');
  function fillCities(sel, list, pre){
    if(!sel) return;
    sel.innerHTML = '';
    if(list.length !== 1){ var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'Выберите город'; sel.appendChild(o0); }
    list.forEach(function(c){ var o = document.createElement('option'); o.value = c; o.textContent = c; sel.appendChild(o); });
    sel.value = list.length === 1 ? list[0] : (pre || '');
    sel.classList.remove('err');
  }
  document.querySelectorAll('[data-open]').forEach(function(b){ b.addEventListener('click', function(){
    var vac = b.getAttribute('data-open'), list = ALL_CITIES, pre = '';
    if(b.getAttribute('data-cities')){ try{ list = JSON.parse(b.getAttribute('data-cities')); }catch(e){} }
    var card = b.closest ? b.closest('.vac') : null, cs = card ? card.querySelector('select') : null;
    if(cs) pre = cs.value;
    mTitle.textContent = vac ? 'Отклик на вакансию «' + vac + '»' : 'Оставить заявку';
    mVac.style.display = 'none';
    fillCities(document.getElementById('m-city'), list, pre);
  }); });
  document.querySelectorAll('select').forEach(function(s){ s.addEventListener('change', function(){ s.classList.remove('err'); }); });
  document.querySelectorAll('a[data-scroll]').forEach(function(a){ a.addEventListener('click', function(e){
    var t = document.querySelector(a.getAttribute('href')); if(!t) return;
    e.preventDefault();
    var hd = document.querySelector('header'), off = hd ? hd.offsetHeight + 8 : 0;
    window.scrollTo({top: t.getBoundingClientRect().top + window.pageYOffset - off, behavior: 'smooth'});
  }); });"""

def city_select(id_, name, cities):
    opts = ('' if len(cities) == 1 else '<option value="">Выберите город</option>') + ''.join(f'<option>{esc(c)}</option>' for c in cities)
    nm = f' name="{name}" required' if name else ' aria-label="Город"'
    return f'<select id="{id_}"{nm}>{opts}</select>'


ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="#1C1C2E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="#1C1C2E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="#1C1C2E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="#1C1C2E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/></svg>',
]

# ---------------------------------------------------------------- бренды юрлиц
URBAN_MARK = ('<svg viewBox="20 30 80 66" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="us-g" x1="0" y1="0" x2="0" y2="1">'
  '<stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#059669"/></linearGradient></defs>'
  '<g fill="url(#us-g)"><rect x="30" y="54" width="18" height="32" rx="3"/><rect x="51" y="36" width="18" height="50" rx="3"/><rect x="72" y="46" width="18" height="40" rx="3"/></g>'
  '<g fill="#FFFFFF"><rect x="35" y="60" width="7" height="7" rx="1.5"/><rect x="35" y="71" width="7" height="7" rx="1.5"/><rect x="56" y="43" width="7" height="7" rx="1.5"/><rect x="56" y="54" width="7" height="7" rx="1.5"/><rect x="56" y="65" width="7" height="7" rx="1.5"/><rect x="77" y="53" width="7" height="7" rx="1.5"/><rect x="77" y="64" width="7" height="7" rx="1.5"/></g>'
  '<rect x="26" y="88" width="68" height="5" rx="2.5" fill="#059669"/></svg>')
RMGK_MARK = ('<svg viewBox="16 12 88 98" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="rm-or" x1="0" y1="0" x2="1" y2="1">'
  '<stop offset="0%" stop-color="#FF5B1F"/><stop offset="100%" stop-color="#E04A0F"/></linearGradient></defs>'
  '<path d="M60 16 L99 38.5 V83.5 L60 106 L21 83.5 V38.5 Z" fill="url(#rm-or)"/>'
  '<g fill="#FFFFFF"><circle cx="60" cy="61" r="9"/><circle cx="60" cy="36" r="5.5"/><circle cx="60" cy="86" r="5.5"/><circle cx="38" cy="48.5" r="5.5"/><circle cx="82" cy="48.5" r="5.5"/><circle cx="38" cy="73.5" r="5.5"/><circle cx="82" cy="73.5" r="5.5"/></g>'
  '<g stroke="#FFFFFF" stroke-width="2.5" opacity="0.85"><line x1="60" y1="61" x2="60" y2="36"/><line x1="60" y1="61" x2="60" y2="86"/><line x1="60" y1="61" x2="38" y2="48.5"/><line x1="60" y1="61" x2="82" y2="48.5"/><line x1="60" y1="61" x2="38" y2="73.5"/><line x1="60" y1="61" x2="82" y2="73.5"/></g></svg>')
# Инстафф: словесный знак с сайта in-staff.ru — IN тёмный + STAFF стальной синий, Oswald
INSTAFF_MARK = ('<svg viewBox="0 0 150 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
  '<text x="0" y="33" font-family="Oswald,Arial Narrow,Arial,sans-serif" font-size="38" font-weight="700" letter-spacing="1"><tspan fill="#2B2B2B">IN</tspan><tspan fill="#5B8BD0">STAFF</tspan></text></svg>')

ORION_MARK = ('<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="lg-or" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#A78BFA"/></linearGradient></defs>'
  '<g stroke="url(#lg-or)" stroke-width=".7" stroke-opacity=".5"><line x1="8" y1="6" x2="22" y2="9"/><line x1="8" y1="6" x2="11" y2="16"/><line x1="22" y1="9" x2="22" y2="16"/><line x1="11" y1="16" x2="16" y2="17.5"/><line x1="16" y1="17.5" x2="22" y2="16"/><line x1="22" y1="16" x2="25" y2="27"/><line x1="11" y1="16" x2="8" y2="27"/></g>'
  '<circle cx="8" cy="6" r="2.4" fill="url(#lg-or)"/><circle cx="22" cy="9" r="1.5" fill="url(#lg-or)"/><circle cx="11" cy="16" r="1.1" fill="#60A5FA"/><circle cx="16" cy="17.5" r="1.1" fill="#60A5FA"/><circle cx="22" cy="16" r="1.1" fill="#60A5FA"/><circle cx="8" cy="27" r="2" fill="url(#lg-or)"/><circle cx="25" cy="27" r="1.6" fill="url(#lg-or)"/></svg>')
ARKADA_MARK = ('<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g transform="translate(18,18)">'
  + ''.join(f'<rect x="-3" y="-16.5" width="6" height="6" rx="1" fill="#C98F60" transform="rotate({a})"/>' for a in (0,60,120,180,240,300)) +
  '<circle r="11" fill="#C98F60"/><circle r="5" fill="#2E2318"/><path d="M-2.4 3.8 L0 -4 L2.4 3.8 M-1.2 1.2 L1.2 1.2" stroke="#C98F60" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></svg>')
ORION_ICON = ('<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="10" fill="#0C1527"/><g transform="translate(16,16) scale(1)">' + ORION_MARK.split('aria-hidden="true">',1)[1].replace('</svg>','') + '</g></svg>')
ARKADA_ICON = ('<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="6" fill="#2E2318"/><g transform="translate(14,14)">' + ARKADA_MARK.split('aria-hidden="true">',1)[1].replace('</svg>','') + '</g></svg>')

BRANDS = {
  'orion': dict(brand_name='Орион', brand_name_head='Орион', brand_logo=ORION_MARK,
    c_ink='#F8FAFC', c_ink2='#CBD5E1', c_muted='#8A97B0', c_line='rgba(255,255,255,.13)', c_bg='#0C1527',
    c_accent='#1D4ED8', c_accent_rgb='29,78,216', c_accent_d='#1E40AF', c_accent_lt='#60A5FA', c_accent_soft='rgba(29,78,216,.18)',
    c_hi='#BAE6FD', c_hi_d='#7DD3FC', c_hi_soft='rgba(186,230,253,.15)', c_hi_ink='#0C1527',
    font_h='"Space Grotesk",Inter,sans-serif', h_case='none', h_ls='-.04em', h_w='700'),
  'arkada': dict(brand_name='Аркада', brand_name_head='Аркада', brand_logo=ARKADA_MARK,
    c_ink='#3A2C1C', c_ink2='#5A4632', c_muted='#A89880', c_line='rgba(58,44,28,.12)', c_bg='#FAF6EE',
    c_accent='#B07040', c_accent_rgb='176,112,64', c_accent_d='#8A5530', c_accent_lt='#C98F60', c_accent_soft='#F0E8D4',
    c_hi='#F0E8D4', c_hi_d='#E4D8C4', c_hi_soft='#FAF6EE', c_hi_ink='#3A2C1C',
    font_h="Oswald,'Arial Narrow',Arial,sans-serif", h_case='uppercase', h_ls='.01em', h_w='700'),
  'instaff': dict(brand_name='Инстафф', brand_name_head='', brand_logo=INSTAFF_MARK,
    c_ink='#2B2B2B', c_ink2='#444444', c_muted='#6B6F78', c_line='#E3E6EC', c_bg='#F5F5F5',
    c_accent='#5B8BD0', c_accent_rgb='91,139,208', c_accent_d='#4574B8', c_accent_lt='#9DBDEB', c_accent_soft='#E4EDF9',
    c_hi='#D3E2F7', c_hi_d='#BDD3F2', c_hi_soft='#EDF3FC', c_hi_ink='#1F3E66',
    font_h="Oswald,'Arial Narrow',Arial,sans-serif", h_case='uppercase', h_ls='.01em', h_w='700'),
  'urban': dict(brand_name='Урбан Сервис', brand_name_head='Урбан Сервис', brand_logo=URBAN_MARK,
    c_ink='#1D1D1F', c_ink2='#3A3A3C', c_muted='#6E6E73', c_line='#E5E5EA', c_bg='#F5F5F7',
    c_accent='#10B981', c_accent_rgb='16,185,129', c_accent_d='#059669', c_accent_lt='#34D399', c_accent_soft='#D1FAE5',
    c_hi='#D1FAE5', c_hi_d='#A7F3D0', c_hi_soft='#ECFDF5', c_hi_ink='#064E3B',
    font_h='Inter,system-ui,sans-serif', h_case='none', h_ls='-.02em', h_w='800'),
  'rmgk': dict(brand_name='РМГК', brand_name_head='РМГК', brand_logo=RMGK_MARK,
    c_ink='#111827', c_ink2='#374151', c_muted='#6B7280', c_line='#E5E7EB', c_bg='#F9FAFB',
    c_accent='#FF5B1F', c_accent_rgb='255,91,31', c_accent_d='#E04A0F', c_accent_lt='#FF8A5C', c_accent_soft='#FFE6DB',
    c_hi='#FFD9C7', c_hi_d='#FFC3A8', c_hi_soft='#FFF2EB', c_hi_ink='#7A2A0C',
    font_h='Inter,system-ui,sans-serif', h_case='none', h_ls='-.02em', h_w='900'),
}
import urllib.parse
# фавиконы: знак бренда (у Инстафф словесный знак нечитаем в 16px — отдельная иконка «IN» на синем)
INSTAFF_ICON = ('<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="8" fill="#5B8BD0"/>'
  '<text x="32" y="46" text-anchor="middle" font-family="Oswald,Arial Narrow,Arial,sans-serif" font-size="40" font-weight="700" fill="#fff">IN</text></svg>')
FAVICONS = {'instaff': INSTAFF_ICON, 'urban': URBAN_MARK, 'rmgk': RMGK_MARK, 'orion': ORION_ICON, 'arkada': ARKADA_ICON}

def favicon(svg):
    return 'data:image/svg+xml,' + urllib.parse.quote(svg)

def render(l):
    g = CFG
    ctx = {k: esc(v) for k, v in g.items() if isinstance(v, str)}
    ctx.update({k: esc(v) for k, v in l.items() if isinstance(v, str)})
    ctx['metrika_id'] = g['metrika_id']
    b = BRANDS[l.get('brand','rmgk')]
    ctx.update({k: (v if k=='brand_logo' else esc(v)) for k, v in b.items()})
    ctx['favicon'] = favicon(FAVICONS[l.get('brand','rmgk')])
    ctx['brand_key'] = l.get('brand','rmgk')
    ctx['hero_pos'] = esc(l.get('hero_pos', 'center 22%'))
    ctx['og_image'] = esc(CFG.get('base_url','') + 'assets/hero-' + l['slug'] + '.jpg')
    if l.get('policy_local'):
        ctx['policy_url'] = esc(l.get('policy_abs') or 'policy/'); ctx['consent_url'] = ctx['policy_url']
    ctx['metrika_goal'] = g['metrika_goal']
    eps = [g.get('endpoint_gs',''), g.get('endpoint','')]
    ctx['endpoints_js'] = ', '.join('"' + esc(e) + '"' for e in eps if e)

    ctx['facts_html'] = ''.join(f'<div class="fact"><b>{esc(a)}</b><span>{esc(b)}</span></div>' for a, b in l['facts'])
    ctx['stats_html'] = ''.join(f'<div class="stat"><b>{esc(n).replace("+","<i>+</i>")} <small style="font-size:.45em;font-weight:700">{esc(u)}</small></b><span>{esc(t)}</span></div>' for n, u, t in g['stats'])
    ctx['why_html'] = ''.join(f'<div class="why reveal"><div class="ic">{ICONS[i % len(ICONS)]}</div><h3>{esc(t)}</h3><p>{esc(d)}</p></div>' for i, (t, d) in enumerate(g['why']))
    ctx['steps_html'] = ''.join(f'<div class="step reveal"><i>{i+1}</i><h3>{esc(t)}</h3><p>{esc(d)}</p></div>' for i, (t, d) in enumerate(g['steps']))
    ctx['partners_html'] = ''.join(f'<img src="../assets/{p}.png" alt="{p}" loading="lazy">' for p in g['partners'])

    max_btn = (f'<a class="btn btn-ghost" href="{esc(l.get("max_url", g["max_url"]))}" target="_blank" rel="noopener" data-ym="max_click">'
               f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/></svg>Написать в MAX</a>')
    if l.get('general'):
        ctx['hero_buttons'] = (f'<a class="btn btn-primary" href="#vacancies">{esc(l["cta"])}</a>'
                               f'<a class="btn btn-ghost" href="#about">{esc(l.get("cta_secondary","Узнать больше"))}</a>')
    elif l.get('cta_href'):
        # кнопка первого экрана ведёт к блоку на странице (sbor: «Посмотреть вакансии» → #vacancies)
        ctx['hero_buttons'] = f'<a class="btn btn-primary" href="{esc(l["cta_href"])}" data-scroll>{esc(l["cta"])}</a>' + max_btn
    else:
        ctx['hero_buttons'] = f'<button class="btn btn-primary" data-open="">{esc(l["cta"])}</button>' + max_btn

    # бейдж на фото: первый факт
    ctx['badge_b'], ctx['badge_s'] = esc(l['facts'][0][0]), esc(l['facts'][0][1])

    # режим «вакансии по городам»: значения по умолчанию дают прежнюю разметку остальных лендингов
    ctx.update(main_city='', modal_city='', city_check='', city_js='', vacancies_intro='', region_expr='REGION',
               modal_btn=esc(l.get('modal_btn', 'Отправить заявку')),
               ok_title=esc(l.get('ok_title', 'Заявка принята')),
               ok_text=esc(l.get('ok_text', 'Перезвоним в течение 15 минут в рабочее время. Если удобнее, напишите нам в MAX.')))
    cities_mode = any('cities' in v for v in l['vacancies'])
    all_cities = []
    if cities_mode:
        for v in l['vacancies']:
            for c in v.get('cities', []):
                if c not in all_cities: all_cities.append(c)
        ctx['main_city'] = '\n      <div class="field"><label for="f-city">Город</label>' + city_select('f-city', 'city', all_cities) + '</div>'
        ctx['modal_city'] = '\n      <div class="field"><label for="m-city">Город</label>' + city_select('m-city', 'city', all_cities) + '</div>'
        ctx['city_check'] = CITY_CHECK_JS
        ctx['region_expr'] = CITY_REGION_JS
        ctx['city_js'] = CITY_JS.replace('__ALL__', json.dumps(all_cities, ensure_ascii=False))
        if l.get('vacancies_intro'):
            ctx['vacancies_intro'] = f'<p class="vac-intro">{esc(l["vacancies_intro"])}</p>'

    cards = []
    for i, v in enumerate(l['vacancies']):
        if 'cities' in v:
            cs = v['cities']
            city = (f'<div class="vac-city"><small>Город</small>{esc(cs[0])}</div>' if len(cs) == 1
                    else f'<div class="field">{city_select(f"c-{i+1}", "", cs)}</div>')
            cards.append(f'''<article class="vac reveal">
  <h3>{esc(v["name"])}</h3>
  <p class="vac-desc">{esc(v.get("desc",""))}</p>
  {city}
  <button class="btn btn-block" data-open="{esc(v["name"])}" data-cities="{esc(json.dumps(cs, ensure_ascii=False))}">Откликнуться</button>
</article>''')
            continue
        rate = (f'<b>{esc(v["rate"])}</b><span>{esc(v.get("rate_note",""))}</span>' if v.get('rate')
                else f'<b class="tbd">{esc(v.get("rate_note","ставку уточним по телефону"))}</b>')
        cond = ''.join(f'<li>{esc(c)}</li>' for c in v.get('conditions', []))
        req = ''.join(f'<li>{esc(c)}</li>' for c in v.get('requirements', []))
        cards.append(f'''<article class="vac reveal">
  <div class="vac-head"><h3>{esc(v["name"])}</h3><div class="rate">{rate}</div></div>
  <div class="meta">
    <div><small>График</small>{esc(v.get("schedule",""))}</div>
    <div><small>Выплаты</small>{esc(v.get("pay",""))}</div>
    <div class="full"><small>{esc(v.get("metro",""))}</small>{esc(v.get("address",""))}</div>
  </div>
  {f'<div><div class="lbl">Условия</div><ul>{cond}</ul></div>' if cond else ''}
  {f'<div><div class="lbl">Требования</div><ul class="req">{req}</ul></div>' if req else ''}
  <button class="btn btn-block" data-open="{esc(v["name"])}">Оставить заявку на вакансию</button>
</article>''')
    ctx['vacancies_html'] = ''.join(cards)

    skin = SKINS[l.get('brand','rmgk')]
    ctx['skin_css'] = (BASE_CSS + skin['css']).replace('{{hero_pos}}', ctx['hero_pos'])
    if cities_mode:
        ctx['skin_css'] += CITY_CSS.replace('ACCENT_HEX', b['c_accent'].lstrip('#')) + CITY_CSS_BRAND.get(l.get('brand', 'rmgk'), '')
    f = l['facts'] + [['',''],['',''],['','']]
    for i in range(3):
        ctx[f'fact{i+1}_b'], ctx[f'fact{i+1}_s'] = esc(f[i][0]), esc(f[i][1])
    ctx['facts_li'] = ''.join(f'<li>{esc(a)} — {esc(b)}</li>' for a, b in l['facts'][1:]) or '<li>Официальный договор</li>'
    names = []
    for v in l['vacancies']:
        if v['name'] not in names: names.append(v['name'])
    for extra in ['Без опыта', 'Выплаты каждую неделю', l.get('region_label','')]:
        if extra and len(names) < 5: names.append(extra)
    if 'tags' in l: names = list(l['tags'])
    ctx['tags_html'] = ''.join(f'<span class="tag">{esc(n)}</span>' for n in names[:5])
    words = l['h1'].split(' ')
    ctx['h1_accent'] = esc(' '.join(words[:-1])) + ' <span class="g">' + esc(words[-1]) + '</span>' if len(words) > 1 else esc(l['h1'])
    h1c = l['h1'].replace('(', '').replace(')', '')
    parts = [x.strip() for x in h1c.split(',') if x.strip()]
    w = h1c.split(' ')
    if len(parts) >= 3:
        lines = [parts[0], parts[1], ', '.join(parts[2:])]
    elif len(w) == 3 and len(w[1]) <= 2:
        lines = [w[0] + ' ' + w[1], w[2]]
    elif len(w) >= 3:
        lines = [w[0], w[1], ' '.join(w[2:])]
    else:
        lines = w
    if l.get('h1_lines'): lines = l['h1_lines']   # ручная разбивка H1 на 3 строки (тёмная / медная / контурная)
    cls = ['', 'cu', 'outline']
    ctx['h1_arkada'] = '<br>'.join((f'<span class="{cls[i]}">' + esc(t) + '</span>') if i else esc(t) for i, t in enumerate(lines[:3]))
    out = HEAD + skin['body'] + TAIL
    for k, v in ctx.items():
        out = out.replace('{{' + k + '}}', v)
    if l.get('hero_badge') is False:   # без плашки на фото (sbor, Орион: ставки к новым вакансиям не относятся)
        out = re.sub(r'\s*<div class="hero-badge">.*?</div>', '', out, count=1, flags=re.S)
    left = re.findall(r'\{\{(\w+)\}\}', out)
    if left:
        raise SystemExit(f'Незаполненные плейсхолдеры в {l["slug"]}: {sorted(set(left))}')
    return out

# ---------------------------------------------------------------- tilda
TILDA_DIR = os.path.join(HERE, 'tilda')
ASSETS_URL = CFG.get('base_url', '') + 'assets/'

def tilda_version(html_full, l=None):
    """Фрагмент для блока Tilda T123 (HTML-код): стили + разметка + скрипты, без doctype/head/body и без счётчика Метрики."""
    body = html_full.split('<body>', 1)[1].rsplit('</body>', 1)[0]
    head = html_full.split('<head>', 1)[1].split('</head>', 1)[0]
    style = head[head.index('<style>'):head.index('</style>') + len('</style>')]
    fonts = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Oswald:wght@500;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">'
    # счётчик Метрики убираем: в Tilda он подключается в настройках сайта, цели ym() из скрипта продолжат работать
    a = body.index('<!-- Yandex.Metrika counter -->'); b = body.index('<!-- /Yandex.Metrika counter -->') + len('<!-- /Yandex.Metrika counter -->')
    body = body[:a] + body[b:]
    out = fonts + '\n' + style + '\n' + body
    # в Тильде может стоять свой счётчик (sbor: 113315490) — цели шлём в него, иначе они теряются
    if l and l.get('tilda_metrika_id'):
        out = out.replace(f"ym({CFG['metrika_id']}, 'reachGoal'", f"ym({l['tilda_metrika_id']}, 'reachGoal'")
    return out.replace('../assets/', ASSETS_URL)

def build_tilda():
    os.makedirs(TILDA_DIR, exist_ok=True)
    for l in CFG['landings']:
        html_full = render(l)
        p = os.path.join(TILDA_DIR, l['slug'] + '.html')
        open(p, 'w', encoding='utf-8').write(tilda_version(html_full, l))
        print('✓ tilda/' + l['slug'] + '.html', f'({os.path.getsize(p)//1024} KB)')

# ---------------------------------------------------------------- политика ПД (страница /<slug>/policy/)
POLICY_TPL = r"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Политика в отношении обработки персональных данных — {{brand_name}}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="{{favicon}}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Oswald:wght@500;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
<style>
{{skin_css}}
.policy{max-width:820px;margin:0 auto;padding:40px 20px 80px}
.policy h1{font-size:clamp(24px,3.6vw,38px);margin:0 0 8px}
.policy .sub{color:var(--muted);font-size:14px;margin-bottom:28px}
.policy h2{font-size:18px;margin:30px 0 10px;text-transform:none;letter-spacing:0}
.policy p{font-size:15px;line-height:1.65;color:var(--ink2);margin:0 0 10px}
.policy a{color:var(--accent-d,var(--accent))}
.policy .back{display:inline-block;margin-bottom:24px;font-size:14px;font-weight:600;text-decoration:none;color:var(--accent-d,var(--accent))}
body{padding-bottom:0}
</style>
</head>
<body>
<header>
  <div class="wrap nav">
    {{brand_head}}
    <div class="nav-right"><a class="nav-phone" href="tel:{{phone_link}}">{{phone_svg}}<span>{{phone_display}}</span></a></div>
  </div>
</header>
<main class="policy">
  <a class="back" href="../">← Вернуться к вакансиям</a>
  <h1>{{title}}</h1>
  <div class="sub">{{legal}} · {{address}}</div>
  {{body_html}}
</main>
<footer><div class="wrap row">
  <div>{{legal}} · {{address}}</div>
  <div><a href="tel:{{phone_link}}">{{phone_display}}</a> · <a href="mailto:{{email}}">{{email}}</a></div>
</div></footer>
</body>
</html>
"""

def policy_html(text):
    lines = [x.rstrip() for x in text.split('\n')]
    title = lines[0].strip(); out = []
    for ln in lines[1:]:
        if not ln.strip(): continue
        if re.match(r'^\d+\. ', ln) and not re.match(r'^\d+\.\d', ln):
            out.append(f'<h2>{esc(ln)}</h2>')
        else:
            h = esc(ln)
            h = re.sub(r'(https?://[^\s,]+)', r'<a href="\1" target="_blank" rel="noopener">\1</a>', h)
            h = re.sub(r'([\w.-]+@[\w.-]+\.\w+)', r'<a href="mailto:\1">\1</a>', h)
            out.append(f'<p>{h}</p>')
    return title, '\n'.join(out)

def build_policies():
    from skins import PHONE_SVG
    pol_path = os.path.join(HERE, 'policies.json')
    if not os.path.exists(pol_path): return {}
    pols = json.load(open(pol_path, encoding='utf-8'))
    g = CFG; done = {}
    for l in g['landings']:
        if l['slug'] not in pols: continue
        b = BRANDS[l.get('brand','rmgk')]; skin = SKINS[l.get('brand','rmgk')]
        title, body = policy_html(pols[l['slug']])
        # шапка бренда — вырезаем из body скина
        m = re.search(r'<a class="brand".*?</a>', skin['body'], re.S)
        head = m.group(0) if m else ''
        ctx = {k: esc(v) for k, v in g.items() if isinstance(v, str)}
        ctx.update({k: esc(v) for k, v in l.items() if isinstance(v, str)})
        ctx.update({k: (v if k=='brand_logo' else esc(v)) for k, v in b.items()})
        ctx['favicon'] = favicon(FAVICONS[l.get('brand','rmgk')])
        ctx['skin_css'] = (BASE_CSS + skin['css']).replace('{{hero_pos}}', 'center')
        ctx['brand_head'] = head; ctx['phone_svg'] = PHONE_SVG
        ctx['title'] = esc(title); ctx['body_html'] = body
        out = POLICY_TPL
        for k, v in ctx.items(): out = out.replace('{{' + k + '}}', v)
        for k, v in ctx.items(): out = out.replace('{{' + k + '}}', v)   # плейсхолдеры внутри brand_head
        d = os.path.join(OUT_DIR, l['slug'], 'policy'); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(out)
        done[l['slug']] = 'policy/'
        print('✓', os.path.relpath(os.path.join(d, 'index.html'), ROOT))
    return done

def main():
    pol = build_policies()
    for l in CFG['landings']:
        if l['slug'] in pol: l['policy_local'] = True; l['policy_abs'] = CFG.get('base_url','') + l['slug'] + '/policy/'
    if not (CFG.get('endpoint') or CFG.get('endpoint_gs')):
        print('⚠️  endpoint пуст: формы работают в demo-режиме, заявки НЕ уходят в таблицу. Заполните "endpoint" в landings.json после деплоя leads_webapp.gs.')
    for l in CFG['landings']:
        d = os.path.join(OUT_DIR, l['slug']); os.makedirs(d, exist_ok=True)
        p = os.path.join(d, 'index.html')
        open(p, 'w', encoding='utf-8').write(render(l))
        print('✓', os.path.relpath(p, ROOT), f'({os.path.getsize(p)//1024} KB)')

if __name__ == '__main__':
    main()
    if '--tilda' in sys.argv: build_tilda()
