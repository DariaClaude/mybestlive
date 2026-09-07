# -*- coding: utf-8 -*-
"""Создание вкладки «Август» в таблице SEO_GEO позиции LUIS+ из среза 20.08.2026."""
import json, base64, subprocess, tempfile, os, time, urllib.request, urllib.error, sys

KEY_FILE = '/Users/daria/Desktop/Сlaude Code/keys/pme-sheets-0591ecbcdf46.json'
SPREADSHEET_ID = '16GXxvAtU4JnG9OxYRpTXkYxSKgwGbp1chMH87rHx8YA'
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'srez_data.json')
SHEET_TITLE = 'Август'

def b64url(b):
    return base64.urlsafe_b64encode(b).rstrip(b'=').decode()

def get_token():
    with open(KEY_FILE) as f:
        key = json.load(f)
    header = b64url(json.dumps({'alg': 'RS256', 'typ': 'JWT'}).encode())
    now = int(time.time())
    claims = b64url(json.dumps({
        'iss': key['client_email'],
        'scope': 'https://www.googleapis.com/auth/spreadsheets',
        'aud': 'https://oauth2.googleapis.com/token',
        'iat': now, 'exp': now + 3600,
    }).encode())
    signing_input = f'{header}.{claims}'.encode()
    with tempfile.NamedTemporaryFile('w', suffix='.pem', delete=False) as pf:
        pf.write(key['private_key'])
        pem_path = pf.name
    try:
        sig = subprocess.run(['openssl', 'dgst', '-sha256', '-sign', pem_path],
                             input=signing_input, capture_output=True, check=True).stdout
    finally:
        os.unlink(pem_path)
    jwt = f'{header}.{claims}.{b64url(sig)}'
    body = ('grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt).encode()
    req = urllib.request.Request('https://oauth2.googleapis.com/token', data=body,
                                 headers={'Content-Type': 'application/x-www-form-urlencoded'})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())['access_token']

def api(token, path, payload=None, method=None):
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}{path}'
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method or ('POST' if data else 'GET'),
                                 headers={'Authorization': f'Bearer {token}',
                                          'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        print('HTTP', e.code, e.read().decode()[:800])
        raise

def rgb(hex6):
    return {'red': int(hex6[0:2], 16) / 255, 'green': int(hex6[2:4], 16) / 255, 'blue': int(hex6[4:6], 16) / 255}

C_DARK, C_BLUE, C_GREEN_HDR, C_GRAY = rgb('1A1A1A'), rgb('1F4E79'), rgb('375623'), rgb('7F7F7F')
C_GREEN, C_BORDER, C_WHITE = rgb('D9EAD3'), rgb('D0D0D0'), rgb('FFFFFF')
THIN = {'style': 'SOLID', 'color': C_BORDER}

def cell_format(r, c, has_value_fill):
    """r, c — 1-базные. Возвращает userEnteredFormat."""
    fmt = {'textFormat': {'fontSize': 9}}
    if r == 1:
        if c <= 2: bg = C_DARK
        elif c == 3: bg = C_BLUE
        elif c <= 8: bg = C_GREEN_HDR
        else: bg = C_GRAY
        fmt['backgroundColor'] = bg
        fmt['textFormat'].update({'bold': True, 'foregroundColor': C_WHITE})
        fmt['horizontalAlignment'] = 'CENTER'
    elif r == 2:
        fmt['backgroundColor'] = C_DARK
        fmt['textFormat'].update({'bold': True, 'foregroundColor': C_WHITE})
        fmt['horizontalAlignment'] = 'CENTER'
        fmt['wrapStrategy'] = 'WRAP'
        fmt['borders'] = {'top': THIN, 'bottom': THIN, 'left': THIN, 'right': THIN}
    else:
        if c == 1:
            fmt['horizontalAlignment'] = 'LEFT'
            fmt['wrapStrategy'] = 'WRAP'
        else:
            fmt['horizontalAlignment'] = 'CENTER'
        if has_value_fill:
            fmt['backgroundColor'] = C_GREEN
        fmt['borders'] = {'top': THIN, 'bottom': THIN, 'left': THIN, 'right': THIN}
        fmt['verticalAlignment'] = 'MIDDLE'
    return fmt

def main():
    with open(DATA_FILE) as f:
        data = json.load(f)  # 28 строк x 50 колонок, [value, fill]

    token = get_token()
    meta = api(token, '?fields=sheets.properties')
    titles = {s['properties']['title']: s['properties']['sheetId'] for s in meta['sheets']}
    print('Вкладки:', list(titles))
    if SHEET_TITLE in titles:
        print(f'Вкладка «{SHEET_TITLE}» уже существует (id={titles[SHEET_TITLE]}) — останавливаюсь.')
        sys.exit(1)

    # 1) создать лист первым в списке
    res = api(token, ':batchUpdate', {'requests': [{'addSheet': {'properties': {
        'title': SHEET_TITLE, 'index': 0,
        'gridProperties': {'rowCount': 28, 'columnCount': 50,
                           'frozenRowCount': 2, 'frozenColumnCount': 1}}}}]})
    sheet_id = res['replies'][0]['addSheet']['properties']['sheetId']
    print('Создан лист id=', sheet_id)

    # 2) значения + форматы
    rows = []
    for ri, row in enumerate(data, start=1):
        vals = []
        for ci, (value, fill) in enumerate(row, start=1):
            cd = {'userEnteredFormat': cell_format(ri, ci, fill == '00D9EAD3')}
            if value is not None:
                if isinstance(value, (int, float)):
                    cd['userEnteredValue'] = {'numberValue': value}
                else:
                    cd['userEnteredValue'] = {'stringValue': str(value)}
            vals.append(cd)
        rows.append({'values': vals})

    requests = [{'updateCells': {
        'range': {'sheetId': sheet_id, 'startRowIndex': 0, 'endRowIndex': 28,
                  'startColumnIndex': 0, 'endColumnIndex': 50},
        'rows': rows,
        'fields': 'userEnteredValue,userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy,borders)'}}]

    # 3) объединения шапки: D1:H1, I1:V1, W1:AJ1, AK1:AX1
    for a, b in [(3, 8), (8, 22), (22, 36), (36, 50)]:
        requests.append({'mergeCells': {'mergeType': 'MERGE_ALL', 'range': {
            'sheetId': sheet_id, 'startRowIndex': 0, 'endRowIndex': 1,
            'startColumnIndex': a, 'endColumnIndex': b}}})

    # 4) размеры: колонка A шире, остальные узкие; высоты строк
    requests += [
        {'updateDimensionProperties': {'range': {'sheetId': sheet_id, 'dimension': 'COLUMNS', 'startIndex': 0, 'endIndex': 1},
                                       'properties': {'pixelSize': 420}, 'fields': 'pixelSize'}},
        {'updateDimensionProperties': {'range': {'sheetId': sheet_id, 'dimension': 'COLUMNS', 'startIndex': 1, 'endIndex': 50},
                                       'properties': {'pixelSize': 80}, 'fields': 'pixelSize'}},
        {'updateDimensionProperties': {'range': {'sheetId': sheet_id, 'dimension': 'ROWS', 'startIndex': 0, 'endIndex': 1},
                                       'properties': {'pixelSize': 28}, 'fields': 'pixelSize'}},
        {'updateDimensionProperties': {'range': {'sheetId': sheet_id, 'dimension': 'ROWS', 'startIndex': 1, 'endIndex': 2},
                                       'properties': {'pixelSize': 56}, 'fields': 'pixelSize'}},
        {'updateDimensionProperties': {'range': {'sheetId': sheet_id, 'dimension': 'ROWS', 'startIndex': 2, 'endIndex': 28},
                                       'properties': {'pixelSize': 40}, 'fields': 'pixelSize'}},
    ]

    api(token, ':batchUpdate', {'requests': requests})
    print('Данные и форматирование записаны.')

    # 5) проверка чтением
    chk = api(token, f"/values/{urllib.parse.quote(SHEET_TITLE)}!A1:AX28?valueRenderOption=UNFORMATTED_VALUE")
    got = chk.get('values', [])
    n_rows = len(got)
    filled = sum(1 for r in got for v in r if v not in ('', None))
    print(f'Проверка: строк {n_rows}, непустых ячеек {filled}')
    print('A3 =', got[2][0][:60] if n_rows > 2 else '?')
    print('строка 16 (A,B,C):', got[15][:3] if n_rows > 15 else '?')

if __name__ == '__main__':
    main()
