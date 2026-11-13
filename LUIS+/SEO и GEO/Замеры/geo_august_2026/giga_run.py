# -*- coding: utf-8 -*-
"""GEO-замер ГигаЧат: позиция luis.ru в топ-10 ответа по каждому запросу.
Пишет прогресс в giga_progress.json {query: {'pos': int|'-', 'ok': True}}.
Только подтверждённые ответы (ok=True); сбои API ретраятся с бэкоффом."""
import json, os, re, ssl, sys, time, uuid, urllib.request, urllib.error

SCRATCH = os.path.dirname(os.path.abspath(__file__))
KEY = open('/Users/daria/Desktop/Сlaude Code/keys/gigachat_key.txt').read().strip()
PROGRESS = os.path.join(SCRATCH, 'giga_progress.json')
ROWMAP = os.path.join(SCRATCH, 'august_row_map.json')
CTX = ssl.create_default_context(); CTX.check_hostname = False; CTX.verify_mode = ssl.CERT_NONE

_token = {'v': None, 't': 0}

def auth():
    req = urllib.request.Request('https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        data=b'scope=GIGACHAT_API_PERS',
        headers={'Authorization': 'Basic ' + KEY, 'RqUID': str(uuid.uuid4()),
                 'Content-Type': 'application/x-www-form-urlencoded'})
    with urllib.request.urlopen(req, context=CTX, timeout=30) as r:
        _token['v'] = json.loads(r.read())['access_token']
        _token['t'] = time.time()

def ask(q):
    """Возвращает (ok, text|err)."""
    if not _token['v'] or time.time() - _token['t'] > 1500:
        auth()
    prompt = ('Перечисли топ-10 поставщиков или дистрибьюторов по запросу "' + q +
              '" на российском рынке. Строго нумерованный список 1-10, формат "N. Название — сайт", только список.')
    body = json.dumps({'model': 'GigaChat', 'temperature': 0,
                       'messages': [{'role': 'user', 'content': prompt}]}).encode()
    req = urllib.request.Request('https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
        data=body, headers={'Authorization': 'Bearer ' + _token['v'], 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=60) as r:
            d = json.loads(r.read())
            return True, d['choices'][0]['message']['content']
    except urllib.error.HTTPError as e:
        if e.code == 401:
            _token['v'] = None
        return False, f'HTTP {e.code}'
    except Exception as e:
        return False, str(e)[:100]

def find_pos(text):
    for line in str(text).splitlines():
        line = line.strip()
        m = re.match(r'^(\d{1,2})[\.\)]\s*', line)
        if not m: continue
        n = int(m.group(1))
        if n < 1 or n > 10: continue
        if re.search(r'luis|луис', line, re.I): return n
    return '-'

def main():
    smoke = '--smoke' in sys.argv
    with open(ROWMAP) as f:
        rows = json.load(f)['rows']
    queries = list(rows.values())
    done = {}
    if os.path.exists(PROGRESS):
        with open(PROGRESS) as f: done = json.load(f)
    todo = [q for q in queries if q not in done]
    if smoke: todo = todo[:3]
    print(f'всего {len(queries)}, готово {len(done)}, осталось {len(todo)}', flush=True)
    fails = 0
    for i, q in enumerate(todo):
        ok, res = False, ''
        for attempt in range(8):
            ok, res = ask(q)
            if ok: break
            time.sleep(min(5 * 2 ** attempt, 60))
        if ok:
            done[q] = {'pos': find_pos(res), 'ok': True}
            fails = 0
            if smoke: print(f'  «{q}» → {done[q]["pos"]} | ответ: {res[:120]!r}', flush=True)
        else:
            print(f'  СБОЙ «{q}»: {res}', flush=True)
            fails += 1
            if fails >= 5:
                print('5 сбоев подряд — остановка', flush=True); break
        if (i + 1) % 25 == 0 or i == len(todo) - 1:
            with open(PROGRESS, 'w') as f: json.dump(done, f, ensure_ascii=False)
            print(f'[{i+1}/{len(todo)}] сохранено, найдено позиций: '
                  f'{sum(1 for v in done.values() if v["pos"] != "-")}', flush=True)
        time.sleep(0.4)
    with open(PROGRESS, 'w') as f: json.dump(done, f, ensure_ascii=False)
    print('ГОТОВО. всего в прогрессе:', len(done), flush=True)

if __name__ == '__main__':
    main()
