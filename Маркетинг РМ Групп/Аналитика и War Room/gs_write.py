# -*- coding: utf-8 -*-
"""Запись в Google Sheets через сервисный аккаунт claude-writer-59 (тот же JWT, что в gs_read).
add_sheet(sid, title) -> sheetId; write_rows(sid, title, rows, start='A1'); set_widths/wrap по желанию."""
import json, urllib.request, urllib.parse
from gs_read import token, get
def _post(url, body, tok, method="POST"):
    req=urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Authorization":"Bearer "+tok,"Content-Type":"application/json"}, method=method)
    try: return json.load(urllib.request.urlopen(req, timeout=120))
    except urllib.error.HTTPError as e: return {"_error":e.code,"_body":e.read().decode()[:500]}
def sheet_id(sid, title, tok):
    meta=get(f"https://sheets.googleapis.com/v4/spreadsheets/{sid}?fields=sheets.properties", tok)
    for s in meta.get("sheets",[]):
        if s["properties"]["title"]==title: return s["properties"]["sheetId"]
    return None
def add_sheet(sid, title, rows=1000, cols=20, frozen=1):
    tok=token(); existing=sheet_id(sid,title,tok)
    if existing is not None: return existing
    r=_post(f"https://sheets.googleapis.com/v4/spreadsheets/{sid}:batchUpdate", {"requests":[{"addSheet":{"properties":{"title":title,"gridProperties":{"rowCount":rows,"columnCount":cols,"frozenRowCount":frozen}}}}]}, tok)
    return r["replies"][0]["addSheet"]["properties"]["sheetId"] if "replies" in r else r
def write_rows(sid, title, rows, start="A1"):
    tok=token(); rng=urllib.parse.quote(f"'{title}'!{start}")
    return _post(f"https://sheets.googleapis.com/v4/spreadsheets/{sid}/values/{rng}?valueInputOption=RAW", {"range":f"'{title}'!{start}","majorDimension":"ROWS","values":rows}, tok, method="PUT")
def format_sheet(sid, title, widths=None, wrap_cols=None, header_color=(0.85,0.92,0.83)):
    tok=token(); gid=sheet_id(sid,title,tok); reqs=[]
    reqs.append({"repeatCell":{"range":{"sheetId":gid,"startRowIndex":0,"endRowIndex":1},"cell":{"userEnteredFormat":{"backgroundColor":{"red":header_color[0],"green":header_color[1],"blue":header_color[2]},"textFormat":{"bold":True}}},"fields":"userEnteredFormat(backgroundColor,textFormat)"}})
    for i,w in (widths or {}).items():
        reqs.append({"updateDimensionProperties":{"range":{"sheetId":gid,"dimension":"COLUMNS","startIndex":i,"endIndex":i+1},"properties":{"pixelSize":w},"fields":"pixelSize"}})
    for i in (wrap_cols or []):
        reqs.append({"repeatCell":{"range":{"sheetId":gid,"startColumnIndex":i,"endColumnIndex":i+1},"cell":{"userEnteredFormat":{"wrapStrategy":"WRAP","verticalAlignment":"TOP"}},"fields":"userEnteredFormat(wrapStrategy,verticalAlignment)"}})
    return _post(f"https://sheets.googleapis.com/v4/spreadsheets/{sid}:batchUpdate", {"requests":reqs}, tok)
