import re, sys, os, unicodedata

def slug(name):
    s = unicodedata.normalize('NFKD', name)
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower()
    return (s or 'site')

def prefix_css(css, root):
    out, stack = [], []
    for line in css.split('\n'):
        st = line.strip(); work = line
        sel_ctx = (len(stack) == 0) or (stack[-1] == 'media')
        if '{' in st and not st.startswith('@') and not st.startswith('/*') and sel_ctx and 'kf' not in stack:
            i = work.find('{'); sel_part, rest = work[:i], work[i:]
            indent = re.match(r'\s*', sel_part).group(0)
            new = []
            for s in [x.strip() for x in sel_part.split(',') if x.strip()]:
                if s == '&ROOT&': new.append('.' + root)
                elif s == '&RESET&': new.append(f'.{root}, .{root} *, .{root} *::before, .{root} *::after')
                elif s.startswith('.' + root): new.append(s)
                else: new.append(f'.{root} ' + s)
            work = indent + ', '.join(new) + ' ' + rest
        for ch in line:
            if ch == '{':
                stack.append('kf' if '@keyframes' in st else ('media' if st.startswith('@media') else 'x')); st = ''
            elif ch == '}':
                if stack: stack.pop()
        out.append(work)
    return '\n'.join(out)

def add_important(css):
    PROPS = r'(color|background|background-color|background-image|border-color|font-family|-webkit-text-fill-color)'
    res, stack = [], []
    for line in css.split('\n'):
        st = line.strip(); work = line
        if 'kf' not in stack:
            work = re.sub(PROPS + r'(\s*:\s*)([^;{}]+?)(\s*;)',
                lambda m: m.group(0) if '!important' in m.group(3)
                else f"{m.group(1)}{m.group(2)}{m.group(3)} !important{m.group(4)}", work)
        for ch in line:
            if ch == '{': stack.append('kf' if '@keyframes' in st else 'x'); st = ''
            elif ch == '}':
                if stack: stack.pop()
        res.append(work)
    return '\n'.join(res)

def minify_css(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};:,>])\s*', r'\1', css)
    return css.strip()

def compact_html(html):
    html = re.sub(r'<!--(?!\[).*?-->', '', html, flags=re.S)
    return '\n'.join([l.strip() for l in html.split('\n') if l.strip()])

def convert(path, out_path):
    src = open(path, encoding='utf-8').read()
    base = os.path.splitext(os.path.basename(path))[0].replace('-landing', '')
    root = slug(base) + '-root'
    title_m = re.search(r'<title>([^<]+)</title>', src)
    site_name = (title_m.group(1).split('—')[0].split('–')[0].strip() if title_m else base)
    css = re.search(r'<style>(.*?)</style>', src, re.S).group(1)
    bg_m = re.search(r'body\s*\{[^}]*background:\s*(#[0-9A-Fa-f]{3,8})', css)
    dark_bg = bg_m.group(1) if bg_m else '#0A0F1E'
    css = re.sub(r'\*\s*,\s*\*::before\s*,\s*\*::after(\s*\{)', r'&RESET&\1', css)
    css = re.sub(r'(^|\n)\s*html\s*\{[^}]*\}', '', css)
    css = re.sub(r'(^|\n)(\s*)body\s*\{', r'\1\2&ROOT& {', css)
    css = css.replace('&ROOT& {', '&ROOT& { position: relative; overflow-x: clip;', 1)
    css = css.replace('overflow-x: hidden;', '')
    css = css.replace('background: ' + dark_bg + ' !important', 'background: ' + dark_bg)
    css = css.replace('position: fixed; top: 0; left: 0; right: 0; z-index: 100;',
                      'position: sticky; top: 0; z-index: 100;')
    css = css.replace('position: fixed; inset: 0;', 'position: absolute; inset: 0;')
    css = re.sub(r'padding:\s*1[2-9]0px 64px', 'padding: 90px 64px', css)
    css = re.sub(r'padding:\s*1[0-9]0px 28px', 'padding: 70px 28px', css)
    css = re.sub(r'(min-height:\s*100vh;)', r'\1 min-height: 100svh;', css, count=1)
    css = prefix_css(css, root)
    css = add_important(css)
    css += f'\nhtml, body {{ background: {dark_bg} !important; }}\n.{root} a {{ text-decoration: none !important; }}\n'
    css = minify_css(css)
    gated = False
    if f'.{root} .reveal{{opacity:0' in css:
        css = css.replace(f'.{root} .reveal{{opacity:0', f'.{root}.js-anim .reveal{{opacity:0')
        gated = True
    body = src[src.find('<body>') + 6: src.rfind('</body>')]
    body = re.sub(r"var siteName\s*=\s*\(document\.title[^;]+;", f"var siteName = '{site_name}';", body)
    js_extra = f"\ntry {{ document.documentElement.style.setProperty('background','{dark_bg}','important'); document.body.style.setProperty('background','{dark_bg}','important'); var __ar=document.getElementById('allrecords'); if(__ar) __ar.style.setProperty('background','{dark_bg}','important'); }} catch(e) {{}}"
    if gated:
        js_extra += f"\ntry {{ var __r=document.querySelector('.{root}'); if(__r) __r.classList.add('js-anim'); setTimeout(function(){{ document.querySelectorAll('.{root} .reveal').forEach(function(el){{ el.classList.add('visible'); }}); }}, 2500); }} catch(e) {{}}"
    body = body.replace('</script>', js_extra + '\n</script>', 1)
    body = compact_html(body)
    fonts_m = re.search(r'href="(https://fonts\.googleapis\.com/css2[^"]+)"', src)
    fonts = f'<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="{fonts_m.group(1)}" rel="stylesheet">' if fonts_m else ''
    final = f'<!-- {site_name} — код для Тильды. -->\n{fonts}\n<style>{css}</style>\n<div class="{root}">\n{body}\n</div>\n'
    open(out_path, 'w', encoding='utf-8').write(final)
    assert final.count('{') == final.count('}')
    assert '&ROOT&' not in final and '<!DOCTYPE' not in final and '<body>' not in final
    print(f'OK: {out_path} ({len(final)})')

convert('Маркетинг РМ Групп/Сайты для ЮЛ/Сайты/fabrika-resheniy-landing.html', 'tilda/fabrika-v2.html')
convert('Маркетинг РМ Групп/Сайты для ЮЛ/Сайты/orion-landing.html', 'tilda/orion-v2.html')
