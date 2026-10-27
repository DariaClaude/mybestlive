#!/usr/bin/env python3
"""Собирает превью страницы /service-map/ с блоком экспресс-диагностики.

Источник: живой снимок https://pmexcellence.com/service-map/ (скачивается заново при каждом запуске).
Фирменные CSS Битрикса вшиваются inline (url() → абсолютные, шрифты Gotham Pro → base64),
чтобы снимок не зависел от пересборки кэша Битрикса. Блок берётся из diag_widget.html
и вставляется перед <h2>Карта сервисов PM Excellence</h2>.
Результат: index.html (для деплоя на Vercel).
"""
import base64, posixpath, re, sys, urllib.request

SITE = 'https://pmexcellence.com'
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36'

def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    return urllib.request.urlopen(req, timeout=60).read()

html = get(SITE + '/service-map/').decode('utf-8')

def absolutize_css(css):
    """url(/local/static/css/../img/x.png) → url(https://pmexcellence.com/local/static/img/x.png); woff/ttf → base64."""
    def rep(m):
        raw = m.group(1).strip().strip('\'"')
        if raw.startswith(('data:', 'http', '//')):
            return m.group(0)
        path, _, query = raw.partition('?')
        if path.startswith('/'):
            path = posixpath.normpath(path)
        url = SITE + path + (('?' + query) if query else '')
        if path.endswith(('.woff', '.ttf')):
            try:
                data = get(url)
                mime = 'font/woff' if path.endswith('.woff') else 'font/ttf'
                return 'url(data:%s;base64,%s)' % (mime, base64.b64encode(data).decode())
            except Exception as e:
                print('font fail', url, e, file=sys.stderr)
        return 'url(%s)' % url
    return re.sub(r'url\(([^)]+)\)', rep, css)

# 1. CSS Битрикса → inline
def inline_link(m):
    href = m.group(1).split('?')[0]
    css = get(SITE + href).decode('utf-8')
    kind = 'template' if 'template_' in href else 'page'
    return '<style data-inlined="%s">\n%s\n</style>' % (kind, absolutize_css(css))
html = re.sub(r'<link href="(/bitrix/cache/css/[^"]+)"[^>]*>', inline_link, html)

# 2. Относительные ссылки/ассеты → абсолютные на боевой сайт
html = re.sub(r'(src|href|action)="/(?!/)', r'\1="%s/' % SITE, html)
html = html.replace('url("images/image.svg")', 'url("%s/service-map/images/image.svg")' % SITE)
html = re.sub(r"url\('(/local[^']+)'\)", lambda m: "url('%s%s')" % (SITE, m.group(1)), html)

# 3. Блок диагностики перед картой сервисов
widget = open('diag_widget.html', encoding='utf-8').read()
anchor = '<h2>Карта сервисов PM Excellence</h2>'
assert anchor in html, 'якорь карты сервисов не найден'
html = html.replace(anchor, widget + '\n' + anchor, 1)

# Виджет должен ссылаться на боевой сайт с превью (форма, политика)
html = html.replace('action="/ajax/form/send/" method="post" id="pmx-diag-form"',
                    'action="%s/ajax/form/send/" method="post" id="pmx-diag-form"' % SITE)
html = html.replace('href="/politika/" target="_blank">условиями</a> обработки персональных данных</span>',
                    'href="%s/politika/" target="_blank">условиями</a> обработки персональных данных</span>' % SITE)

open('index.html', 'w', encoding='utf-8').write(html)
print('index.html', len(html.encode()), 'bytes')
