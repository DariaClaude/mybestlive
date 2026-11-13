# -*- coding: utf-8 -*-
"""Снятие SEO-позиций из PR-CY API и запись в лист «Август 2026».

Использование:
  python3 prcy_seo.py fetch                 # скачать свежий JSON → prcy_raw.json
  python3 prcy_seo.py write etm.ru=57049 rsvet.ru=57050 rubezh.ru=57051 dssl.ru=57052 bolid.ru=57053

Маппинг domain=projectCompetitorId передаётся аргументами: после смены состава
конкурентов в проекте PR-CY у новых доменов будут НОВЫЕ id — определить по
опорным ключам (сверить позиции на странице «Конкуренты» с prcy_raw.json).
Cookie: keys/prcy_cookie.txt (обновляется ежемесячно, Copy as cURL).
Правило: позиция -1 или отсутствует → «100+». Дата: берётся последний замер.
Колонки листа: D=luis.ru; конкуренты P..AC в порядке: etm, rsvet, rubezh, dssl,
bolid, tinko, layta, satro-paladin.com, rutektd, iss, dean, mossb, garantgroup, argus-spectr.
"""
import json, os, re, sys, urllib.parse, urllib.request, gzip
import importlib.util
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('wa', os.path.join(HERE, 'write_august.py'))
wa = importlib.util.module_from_spec(spec); sys.modules['wa'] = wa
spec.loader.exec_module(wa)

SHEET = 'Август 2026'
PROJECT_ID = '155277'
SEARCH_OPTION = 127670
COOKIE_FILE = '/Users/daria/Desktop/Сlaude Code/keys/prcy_cookie.txt'
RAW = os.path.join(HERE, 'prcy_raw.json')
COL_ORDER = ['etm.ru','rsvet.ru','rubezh.ru','dssl.ru','bolid.ru','tinko.ru','layta.ru',
             'satro-paladin.com','rutektd.ru','iss.ru','dean.ru','mossb.ru','garantgroup.com','argus-spectr.ru']
COL_LETTER = {d: chr(ord('P')+i) if i < 11 else 'A'+chr(ord('A')+i-11) for i, d in enumerate(COL_ORDER)}
# P Q R S T U V W X Y Z AA AB AC

def fetch():
    cookie = open(COOKIE_FILE).read().strip()
    import datetime
    today = datetime.date.today()
    params = {'filter[projectId]': PROJECT_ID, 'filter[searchOptionsIds]': str(SEARCH_OPTION),
              'filter[dateFrom]': (today - datetime.timedelta(days=7)).isoformat(),
              'filter[dateTo]': today.isoformat()}
    url = 'https://a.pr-cy.ru/api/v3.1.0/keywords/extended?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={
        'Accept': 'application/vnd.api+json', 'Accept-Language': 'ru', 'X-Csr': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0.1 Safari/605.1.15',
        'Referer': 'https://a.pr-cy.ru/keywords/competitors/luis.ru/', 'Cookie': cookie})
    with urllib.request.urlopen(req, timeout=120) as r:
        raw = r.read()
        if r.headers.get('Content-Encoding') == 'gzip': raw = gzip.decompress(raw)
    d = json.loads(raw)
    with open(RAW, 'w') as f: json.dump(d, f, ensure_ascii=False)
    print('ключей:', len(d.get('keywords', [])), '| даты:', d.get('dateFrom'), '—', d.get('dateTo'))

def normq(s): return ' '.join(str(s).lower().replace('ё','е').split())
def aggr(s):
    s = re.sub(r'[-.,/()+]', ' ', normq(s)).replace(' мм', ' mm')
    return ' '.join(s.split())
def latest(recs):
    best = None
    for p in recs:
        if p.get('searchOptionsId') != SEARCH_OPTION: continue
        if best is None or p['dateCreated'] > best['dateCreated']: best = p
    return best
def conv(p): return '100+' if p is None or p == -1 else p

def write(mapping):
    with open(RAW) as f: d = json.load(f)
    kw_data = {}
    for kw in d['keywords']:
        per_id = defaultdict(list)
        for c in kw.get('competitorsPositions', []):
            per_id[c['projectCompetitorId']].append(c)
        lp = latest(kw.get('positions', []))
        comp = {dom: (latest(per_id.get(cid, [])) or {}).get('position') for dom, cid in mapping.items()}
        kw_data[normq(kw['keyword'])] = (lp['position'] if lp else None, comp)
    with open(os.path.join(HERE, 'august_row_map.json')) as f: rm = json.load(f)
    # два прохода: точный + агрессивный (уникальный)
    agg_kw = defaultdict(list)
    for k in kw_data: agg_kw[aggr(k)].append(k)
    data, hit = [], 0
    for r, q in rm['rows'].items():
        nq = normq(q)
        key = nq if nq in kw_data else (agg_kw[aggr(q)][0] if len(agg_kw.get(aggr(q), [])) == 1 else None)
        if key is None: continue
        luis, comp = kw_data[key]
        hit += 1
        data.append({'range': f"'{SHEET}'!D{int(r)}", 'values': [[conv(luis)]]})
        for dom in mapping:
            data.append({'range': f"'{SHEET}'!{COL_LETTER[dom]}{int(r)}", 'values': [[conv(comp[dom])]]})
    token = wa.get_token()
    total = 0
    for i in range(0, len(data), 500):
        body = {'valueInputOption': 'RAW', 'data': data[i:i+500]}
        url = f'https://sheets.googleapis.com/v4/spreadsheets/{wa.SPREADSHEET_ID}/values:batchUpdate'
        req = urllib.request.Request(url, data=json.dumps(body).encode(),
            headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as resp:
            total += json.loads(resp.read()).get('totalUpdatedCells', 0)
    print(f'строк покрыто: {hit}, ячеек записано: {total}')

if __name__ == '__main__':
    if sys.argv[1:2] == ['fetch']:
        fetch()
    elif sys.argv[1:2] == ['write']:
        mapping = {}
        for a in sys.argv[2:]:
            dom, cid = a.split('=')
            mapping[dom] = int(cid)
        write(mapping)
    else:
        print(__doc__)
