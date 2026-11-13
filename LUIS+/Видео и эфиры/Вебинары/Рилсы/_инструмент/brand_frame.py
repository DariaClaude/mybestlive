"""Фирменная рамка LUIS+ поверх вертикальных рилсов (13.10.2026): логотип на красной наклонной плашке справа сверху,
заголовок (hook из config.json) на красной плашке снизу слева, субтитры над ней. Берёт base.mp4 (кроп 9:16 без надписей)
и loudness_pass1.json из .work_v/<id>/ (результат vertical_reels.py), субтитры генерирует заново через make_reels.
Запуск из папки инструмента:  python3 -W ignore brand_frame.py [01 02 …]   → out/reel_<id>_<slug>.mp4 + preview_<id>.jpg
Переменные окружения: BASE_DIR (папка с .work_v, по умолчанию — папка скрипта), OUT_DIR (out), LIFT (подъём нижней плашки, px),
SUBC (центр зоны субтитров, 1275), TOP_S / TOP_Y0 (масштаб и верх плашки логотипа, 0.78 / 48 — подобраны так, чтобы не задевать голову)."""
import json, os, sys, subprocess, shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import make_reels as mr

HERE = Path(__file__).resolve().parent
OLD = Path(os.environ.get("BASE_DIR", str(HERE)))   # где лежит .work_v/<id>/base.mp4 + loudness_pass1.json (результат vertical_reels.py)
LIFT = int(os.environ.get("LIFT", "0"))
OUT = HERE / os.environ.get("OUT_DIR", "out"); OUT.mkdir(exist_ok=True)
FF = "/Users/daria/Library/Python/3.9/lib/python/site-packages/static_ffmpeg/bin/darwin_arm64/ffmpeg"
W, H, FPS = 1080, 1920, 30
RED = (190, 23, 48)              # #BE1730 — фирменный
SS = 2                           # суперсэмплинг для гладких наклонных краёв
K = W / 720                      # шаблон 720×1280 → 1080×1920

# геометрия шаблона (измерено по картинке, в px 720×1280, переведено ×1.5)
TOP_S = float(os.environ.get("TOP_S", "0.78")); TOP_Y0 = int(os.environ.get("TOP_Y0", "48"))   # верхняя плашка: масштаб от шаблона и верхняя кромка
TOP = dict(y0=TOP_Y0, y1=TOP_Y0 + 161*TOP_S, x0_top=W - 432*TOP_S, x0_bot=W - 382*TOP_S)       # форма шаблона (432/382 px ширина сверху/снизу, высота 161), уменьшена
LOGO = dict(w=219*TOP_S, dx=126*TOP_S)   # логотип по шаблону: ширина 219, отступ от верхнего левого угла плашки 126, по вертикали по центру
BOT = dict(y0=1010*K - LIFT, y1=1183*K - LIFT, x1_top=356*K, x1_bot=329*K)          # плашка заголовка: от левого края кадра до наклонного правого
HOOK_SIZE, HOOK_MIN, HOOK_LINES = 58, 40, 3
PAD_L, PAD_R, PAD_Y, GAP = 60, 44, 0, 10
MAX_PLATE = 800                  # до какой ширины разрешено удлинять плашку под длинный заголовок
SUBC = int(os.environ.get("SUBC", "1275")); SUB_TOP, SUB_BOTTOM = SUBC - 165, SUBC + 165 # зона субтитров — над плашкой

S = mr.SETTINGS
S.update(subtitle_outline=5, subtitle_shadow=0, subtitle_margin=60, group_words_max=3, subtitle_lines=3,
         subtitle_top=SUB_TOP, subtitle_bottom=SUB_BOTTOM)


def logo_white():
    with Image.open(mr.local_path(S["logo"])) as src:
        a = src.convert("RGBA").getchannel("A")
    white = Image.new("RGBA", a.size, (255, 255, 255, 255)); white.putalpha(a)
    return white


ORPHANS = {"а","и","в","к","с","не","на","но","или","что","как","о","у","за","по","от","до","из","—","–"}


def best_partition(text, n, fits):
    """Все разбиения на ≤ n строк, которые помещаются; лучшее — без висячих союзов/предлогов, с разрывом по знаку препинания, ровное."""
    from itertools import combinations
    words = text.split(); best = None
    for count in range(1, min(len(words), n) + 1):
        for cuts in combinations(range(1, len(words)), count - 1):
            b = (0,) + cuts + (len(words),)
            lines = [" ".join(words[i:j]) for i, j in zip(b, b[1:])]
            if not all(fits(l) for l in lines):
                continue
            orphans = sum(l.split()[-1].lower() in ORPHANS for l in lines[:-1])
            punct = sum(l[-1] in ".,:;!?" for l in lines[:-1])
            lens = [len(l) for l in lines]
            score = (orphans, -punct, len(lines), max(lens) - min(lens))
            if best is None or score < best[0]:
                best = (score, lines)
    return best


def hook_lines(text, bold):
    """Сначала 2 строки (плашка может удлиняться до MAX_PLATE), затем 3; кегль снижается последним."""
    base_w = BOT["x1_bot"]
    widths = (base_w, *range(int(base_w) + 40, MAX_PLATE + 1, 40))
    for size in range(HOOK_SIZE, HOOK_MIN - 1, -2):
        font = ImageFont.truetype(str(bold), size)
        for n in (2, 3):
            cands = []
            for plate_w in widths:
                avail = plate_w - PAD_L - PAD_R
                r = best_partition(text, n, lambda l: mr.font_width(font, l) <= avail)
                if r:
                    cands.append((r[0][:2] + (plate_w,) + r[0][2:], r[1], plate_w))
            if cands:
                sc, lines, plate_w = min(cands, key=lambda c: c[0])
                return lines, font, size, plate_w
    raise ValueError("Заголовок не помещается: " + text)


def make_overlay(reel, bold, work):
    lines, font, size, plate_w = hook_lines(reel["hook"], bold)
    extra = plate_w - BOT["x1_bot"]
    img = Image.new("RGBA", (W*SS, H*SS), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    # верхняя плашка с логотипом
    d.polygon([(TOP["x0_top"]*SS, TOP["y0"]*SS), (W*SS, TOP["y0"]*SS), (W*SS, TOP["y1"]*SS), (TOP["x0_bot"]*SS, TOP["y1"]*SS)], fill=RED)
    logo = logo_white(); lw = round(LOGO["w"] * SS); lh = round(logo.height * lw / logo.width)
    logo = logo.resize((lw, lh), Image.Resampling.LANCZOS)
    img.alpha_composite(logo, (round((TOP["x0_top"] + LOGO["dx"]) * SS), round((TOP["y0"] + TOP["y1"]) / 2 * SS - lh / 2)))
    # нижняя плашка с заголовком (при длинном заголовке удлиняется вправо с тем же наклоном)
    d.polygon([(0, BOT["y0"]*SS), ((BOT["x1_top"]+extra)*SS, BOT["y0"]*SS), ((BOT["x1_bot"]+extra)*SS, BOT["y1"]*SS), (0, BOT["y1"]*SS)], fill=RED)
    f2 = ImageFont.truetype(str(bold), size*SS)
    heights = [d.textbbox((0, 0), l, font=f2)[3] - d.textbbox((0, 0), l, font=f2)[1] for l in lines]
    asc = d.textbbox((0, 0), "Йр", font=f2); line_h = asc[3] - asc[1]
    block = len(lines) * line_h + (len(lines) - 1) * GAP*SS
    y = (BOT["y0"] + BOT["y1"]) / 2 * SS - block / 2
    for l in lines:
        bb = d.textbbox((0, 0), l, font=f2)
        d.text((PAD_L*SS - bb[0], y - asc[1]), l, font=f2, fill=(255, 255, 255, 255))
        y += line_h + GAP*SS
    img = img.resize((W, H), Image.Resampling.LANCZOS)
    img.save(work / "overlay.png")
    return dict(lines=lines, size=size, plate_w=round(plate_w))


def main(only):
    reels = json.load(open(mr.local_path(S["config"]), encoding="utf-8")); notes = []
    bold, semi, ass_name, ass_bold = mr.select_fonts(ImageFont, notes)
    for reel in reels:
        rid = reel["id"]
        if only and rid not in only: continue
        src = OLD / ".work_v" / rid
        work = OUT / ".work" / rid; work.mkdir(parents=True, exist_ok=True)
        if not (work / "fonts").exists(): shutil.copytree(mr.local_path(S["fonts_dir"]), work / "fonts")
        info = make_overlay(reel, bold, work)
        groups = mr.subtitle_groups(reel["words"]); rn = []
        for size in (84, 78, 72, 66, 60):
            S["subtitle_size"] = size
            try:
                mr.make_ass(reel, groups, work / "captions.ass", ImageFont.truetype(str(semi), size), ass_name, ass_bold, rn); break
            except ValueError:
                if size == 60: raise
        _, _, dur = mr.clip_range(reel)
        measurement = json.load(open(src / "loudness_pass1.json"))
        fade = S["fade"]
        vf = (f"[0:v][1:v]overlay=0:0,ass=filename=captions.ass:fontsdir=fonts,"
              f"fade=t=in:st=0:d={fade},fade=t=out:st={dur - fade:.3f}:d={fade},format=yuv420p")
        af = f"afade=t=in:st=0:d={fade},afade=t=out:st={dur - fade:.3f}:d={fade}," + mr.loudnorm_filter(measurement)
        out = OUT / f"reel_{rid}_{reel['slug']}.mp4"
        r = subprocess.run([FF, "-y", "-nostdin", "-hide_banner", "-loglevel", "error", "-i", str(src / "base.mp4"), "-i", "overlay.png",
                            "-filter_complex", vf, "-af", af, "-c:v", "libx264", "-crf", "20", "-preset", "medium", "-r", str(FPS),
                            "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-movflags", "+faststart", "-shortest", str(out)],
                           cwd=str(work), stderr=subprocess.PIPE)
        if r.returncode: raise RuntimeError(r.stderr.decode("utf-8", "ignore")[-1500:])
        # превью: кадр из середины
        subprocess.run([FF, "-y", "-loglevel", "error", "-ss", f"{dur*0.45:.2f}", "-i", str(out), "-frames:v", "1", str(OUT / f"preview_{rid}.jpg")], check=True)
        print(rid, out.name, "субтитры", size, info, flush=True)


if __name__ == "__main__":
    main(sys.argv[1:])
