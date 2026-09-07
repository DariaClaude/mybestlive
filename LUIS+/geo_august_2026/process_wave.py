# -*- coding: utf-8 -*-
"""Обработка волны веб-замера: merge сырых JSON агентов → geo_results.json → запись в лист.
Использование: python3 process_wave.py wave1_a.json wave1_b.json ..."""
import json, os, sys, urllib.parse, urllib.request
import importlib.util

SCRATCH = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('wa', os.path.join(SCRATCH, 'write_august.py'))
wa = importlib.util.module_from_spec(spec); sys.modules['wa'] = wa
spec.loader.exec_module(wa)

SHEET = 'Август 2026'
RESULTS = os.path.join(SCRATCH, 'geo_results.json')
COMPS = ['etm.ru','rsvet.ru','rubezh.ru','dssl.ru','bolid.ru','tinko.ru','layta.ru',
         'satro-paladin.com','rutektd.ru','iss.ru','dean.ru','mossb.ru','garantgroup.com','argus-spectr.ru']

def norm_q(s):
    return ' '.join(str(s).lower().split())

def dom_match(d, target):
    d = d.lower().lstrip('.')
    if d.startswith('www.'): d = d[4:]
    return d == target or d.endswith('.' + target)

def find_pos(domains, target):
    for i, d in enumerate(domains[:10]):
        if dom_match(d, target):
            return i + 1
    return '-'

def main():
    files = sys.argv[1:]
    with open(os.path.join(SCRATCH, 'august_row_map.json')) as f:
        rm = json.load(f)
    q2row = {norm_q(q): int(r) for r, q in rm['rows'].items()}

    results = {}
    if os.path.exists(RESULTS):
        with open(RESULTS) as f: results = json.load(f)

    new_items = {}
    bad_keys = []
    for fp in files:
        with open(os.path.join(SCRATCH, fp)) as f:
            raw = f.read().strip()
        # снять возможную обёртку ```json
        if raw.startswith('```'):
            raw = raw.split('\n', 1)[1].rsplit('```', 1)[0]
        d = json.loads(raw)
        for q, domains in d.items():
            nq = norm_q(q)
            if nq not in q2row:
                bad_keys.append(q); continue
            if nq in results: continue
            if not isinstance(domains, list) or not domains:
                continue  # пустой список = «поиск не выполнялся» (лимит), НЕ записываем «-»
            new_items[nq] = [str(x) for x in domains]
    if bad_keys:
        print('НЕ НАЙДЕНЫ в таблице (пропущены):', bad_keys[:10], f'... всего {len(bad_keys)}' if len(bad_keys)>10 else '')

    if not new_items:
        print('новых результатов нет'); return

    # запись в лист
    token = wa.get_token()
    data = []
    for nq, domains in new_items.items():
        r = q2row[nq]
        luis = find_pos(domains, 'luis.ru')
        data.append({'range': f"'{SHEET}'!F{r}:J{r}",
                     'values': [[luis, None, luis, None, luis]]})
        data.append({'range': f"'{SHEET}'!AT{r}:BG{r}",
                     'values': [[find_pos(domains, c) for c in COMPS]]})
    body = {'valueInputOption': 'RAW', 'data': data}
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{wa.SPREADSHEET_ID}/values:batchUpdate'
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        rr = json.loads(resp.read())
    print(f'записано строк: {len(new_items)} (ranges: {rr.get("totalUpdatedCells", "?")} ячеек)')

    results.update(new_items)
    with open(RESULTS, 'w') as f:
        json.dump(results, f, ensure_ascii=False)
    with_pos = sum(1 for d in results.values() if find_pos(d, 'luis.ru') != '-')
    print(f'итого замерено: {len(results)}/1309, luis.ru в топ-10: {with_pos}')

if __name__ == '__main__':
    main()
