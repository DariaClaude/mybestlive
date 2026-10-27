#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Управление Safari Дарьи через osascript (do JavaScript). Секретов нет.
Команды:
  open <url>                 — новая вкладка в переднем окне
  list                       — URL всех вкладок
  evalcur <js>               — JS в текущей вкладке переднего окна
  evalcurfile <file.js>      — то же, JS из файла
  eval <url-prefix> <js>     — JS во вкладке, URL которой начинается с префикса
  closecur                   — закрыть текущую вкладку
  close <url-prefix>         — закрыть вкладки по префиксу
  wait <сек>                 — пауза
do JavaScript синхронный: промисы не ждёт — для fetch класть результат в window.__x и читать вторым вызовом."""
import sys, subprocess, time

def osa(script):
    r = subprocess.run(['osascript', '-e', script], capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stderr)
    return r.stdout.rstrip('\n')

def q(s):
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'

def main():
    cmd = sys.argv[1]
    if cmd == 'open':
        print(osa('tell application "Safari" to tell front window to set current tab to (make new tab with properties {URL:%s})' % q(sys.argv[2])))
    elif cmd == 'list':
        print(osa('tell application "Safari" to get URL of every tab of every window'))
    elif cmd == 'evalcur':
        print(osa('tell application "Safari" to do JavaScript %s in current tab of front window' % q(sys.argv[2])))
    elif cmd == 'evalcurfile':
        js = open(sys.argv[2], encoding='utf-8').read()
        print(osa('tell application "Safari" to do JavaScript %s in current tab of front window' % q(js)))
    elif cmd == 'eval':
        script = ('tell application "Safari"\n repeat with w in windows\n  repeat with t in tabs of w\n'
                  '   if URL of t starts with %s then return do JavaScript %s in t\n'
                  '  end repeat\n end repeat\n return "NO_TAB"\nend tell') % (q(sys.argv[2]), q(sys.argv[3]))
        print(osa(script))
    elif cmd == 'closecur':
        osa('tell application "Safari" to close current tab of front window')
    elif cmd == 'close':
        osa('tell application "Safari"\n repeat with w in windows\n  close (every tab of w whose URL starts with %s)\n end repeat\nend tell' % q(sys.argv[2]))
    elif cmd == 'wait':
        time.sleep(float(sys.argv[2]))
    else:
        sys.exit('неизвестная команда: ' + cmd)

if __name__ == '__main__':
    main()
