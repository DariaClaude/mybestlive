"""Пересборка только верхнего слоя (хук/лого/субтитры) поверх готовой базы base.mp4."""
import json, sys
from PIL import Image, ImageDraw, ImageFont
import make_reels as mr, vertical_reels as vr
S = mr.SETTINGS
reels = mr.load_config(); notes = []
bold, semi, ass_name, ass_bold = mr.select_fonts(ImageFont, notes)
fonts_dir = mr.local_path(S["fonts_dir"]).relative_to(vr.ROOT).as_posix()
for reel in reels:
    if sys.argv[1:] and reel["id"] not in sys.argv[1:]: continue
    work = mr.local_path(S["work"]) / reel["id"]
    _, _, dur = mr.clip_range(reel)
    rn = []
    mr.make_overlay(reel, work, bold, Image, ImageDraw, ImageFont, rn)
    measurement = json.load(open(work / "loudness_pass1.json"))
    out = vr.compose(reel, work, work / "base.mp4", dur, measurement, fonts_dir)
    vr.contact_sheet(out, dur, mr.local_path(S["output"]) / f"sheet_{reel['id']}.jpg")
    print(reel["id"], out.name, rn)
