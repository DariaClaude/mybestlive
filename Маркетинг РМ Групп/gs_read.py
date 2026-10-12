# -*- coding: utf-8 -*-
"""Чтение Google Sheets через сервисный аккаунт claude-writer-59 (JWT + openssl, без библиотек).
Использование: from gs_read import token, get; tok = token(); get(url, tok).
Ключ лежит в keys/ (в .gitignore), в этом файле секретов нет."""
import json,base64,time,subprocess,tempfile,os,urllib.request,urllib.parse,urllib.error
KEY=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'keys','pme-sheets-0591ecbcdf46.json')
def b64(b): return base64.urlsafe_b64encode(b).rstrip(b'=')
def token():
    k=json.load(open(KEY)); now=int(time.time())
    seg=b64(json.dumps({"alg":"RS256","typ":"JWT"}).encode())+b'.'+b64(json.dumps({"iss":k["client_email"],"scope":"https://www.googleapis.com/auth/spreadsheets","aud":"https://oauth2.googleapis.com/token","iat":now,"exp":now+3600}).encode())
    with tempfile.NamedTemporaryFile('w',suffix='.pem',delete=False) as f: f.write(k["private_key"]); pem=f.name
    try: sig=subprocess.run(['openssl','dgst','-sha256','-sign',pem],input=seg,capture_output=True,check=True).stdout
    finally: os.unlink(pem)
    data=urllib.parse.urlencode({"grant_type":"urn:ietf:params:oauth:grant-type:jwt-bearer","assertion":(seg+b'.'+b64(sig)).decode()}).encode()
    return json.load(urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token",data=data)))["access_token"]
def get(url,tok):
    try: return json.load(urllib.request.urlopen(urllib.request.Request(url,headers={"Authorization":"Bearer "+tok})))
    except urllib.error.HTTPError as e: return {"_error":e.code,"_body":e.read().decode()[:300]}
def tab(sid,name,rng='A1:L40'):
    """Строки вкладки (UNFORMATTED_VALUE)."""
    tok=token(); q=urllib.parse.quote("'"+name+"'!"+rng)
    return get(f"https://sheets.googleapis.com/v4/spreadsheets/{sid}/values/{q}?valueRenderOption=UNFORMATTED_VALUE",tok).get("values",[])
