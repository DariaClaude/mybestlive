"""Обложка эфира LUIS+ 1280×720 в стиле подкаст-превью: спикеры по краям, текст в центре, средняя строка на красной плашке."""
import sys, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
B = sys.argv[1]; OUT = sys.argv[2]
TOOL = sys.argv[3]
W, H = 1280, 720
RED = (0xBE, 0x17, 0x30); BLUE = (0x7D, 0x98, 0xAB)
F = lambda n, s: ImageFont.truetype(f"{B}/fonts/{n}.ttf", s) if n.startswith("Exo2-") and n not in ("Exo2-Bold", "Exo2-SemiBold") else ImageFont.truetype(f"{TOOL}/fonts/{n}.ttf", s)
det = cv2.FaceDetectorYN.create(f"{B}/../reels/models/yunet.onnx", "", (1920, 1080), 0.7, 0.3, 50)

def face(path):
    im = Image.open(path).convert("RGB"); _, f = det.detect(cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR))
    x, y, w, h = [float(v) for v in max(f, key=lambda q: q[2] * q[3])[:4]]; return im, x + w / 2, y + h / 2, h

def panel(path, pw, head_px, face_x, face_y, flip=False):
    im, cx, cy, fh = face(path)
    s = head_px / (fh * 1.35)                                # высота головы с волосами ≈ 1.35 × бокс лица
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS); cx, cy = cx * s, cy * s
    left, top = cx - face_x, cy - face_y
    crop = im.crop((round(left), round(top), round(left) + pw, round(top) + H))
    # грейд: темнее, контрастнее, чуть меньше цвета; виньетка вокруг лица уводит фон в темноту
    crop = ImageEnhance.Color(crop).enhance(0.93); crop = ImageEnhance.Contrast(crop).enhance(1.08); crop = ImageEnhance.Brightness(crop).enhance(1.0)
    a = np.array(crop).astype(np.float32)
    yy, xx = np.mgrid[0:H, 0:pw]; d = np.sqrt(((xx - face_x) / (pw * 0.55)) ** 2 + ((yy - (face_y + 60)) / (H * 0.6)) ** 2)
    a *= np.clip(1.25 - 0.95 * d, 0.16, 1.0)[..., None]
    glow = cv2.GaussianBlur(a, (0, 0), 18); a = a + np.clip(glow - 140, 0, None) * 0.18          # мягкое свечение светлых участков
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

def fade_mask(pw, inner_right, fade=230):
    m = np.ones((H, pw), np.float32); r = np.arange(pw)
    ramp = np.clip((pw - r) / fade, 0, 1) if inner_right else np.clip(r / fade, 0, 1)
    m *= ramp[None, :]; m[-90:] *= np.linspace(1, 0.55, 90)[:, None]
    return Image.fromarray((m * 255).astype(np.uint8))

canvas = Image.new("RGB", (W, H), (16, 11, 12))
pw = 600
L = panel(f"{B}/cand/f03_r.png", pw, 340, 272, 250)             # Анастасия слева, смотрит вправо
R = panel(f"{B}/cand/f16_r.png", pw, 340, 335, 250)             # Ольга справа, смотрит влево
canvas.paste(L, (-40, 0), fade_mask(pw, True)); canvas.paste(R, (W - pw + 40, 0), fade_mask(pw, False))
# затемнение по центру под текст и снизу под подписи
ov = np.array(canvas).astype(np.float32); yy, xx = np.mgrid[0:H, 0:W]
c = np.exp(-((xx - W / 2) / 300.0) ** 2) * 0.55; b = np.clip((yy - 560) / 160, 0, 1) * 0.6
ov *= (1 - np.maximum(c, b))[..., None]; canvas = Image.fromarray(ov.astype(np.uint8))
d = ImageDraw.Draw(canvas)

def text_c(y, s, font, fill=(255, 255, 255), shadow=True):
    bb = d.textbbox((0, 0), s, font=font); w = bb[2] - bb[0]; x = (W - w) / 2 - bb[0]
    if shadow:
        sh = Image.new("L", (W, H), 0); ImageDraw.Draw(sh).text((x + 3, y + 4), s, font=font, fill=170)
        canvas.paste((0, 0, 0), (0, 0), sh.filter(ImageFilter.GaussianBlur(6)))
    d.text((x, y), s, font=font, fill=fill); return bb

l1, l2, l3 = "ЧТО ЖДЁТ", "МОНТАЖНЫЙ БИЗНЕС", "В 2027 ГОДУ"
big = F("Exo2-Black", 92); mid = F("Exo2-Black", 64)
for size in range(64, 40, -2):
    mid = F("Exo2-Black", size); bb = d.textbbox((0, 0), l2, font=mid)
    if bb[2] - bb[0] <= 530: break
G = 20                                                        # одинаковый зазор между строками и плашкой
b1 = d.textbbox((0, 0), l1, font=big); h1 = b1[3] - b1[1]
bb = d.textbbox((0, 0), l2, font=mid); tw, th = bb[2] - bb[0], bb[3] - bb[1]; ph = th + 30
b3 = d.textbbox((0, 0), l3, font=big); h3 = b3[3] - b3[1]
top = 360 - (h1 + G + ph + G + h3) / 2 + 12
text_c(top - b1[1], l1, big)
py = top + h1 + G; px0, px1 = (W - tw) / 2 - 22, (W + tw) / 2 + 22
d.rectangle((px0, py, px1, py + ph), fill=RED)
d.text(((W - tw) / 2 - bb[0], py + 15 - bb[1]), l2, font=mid, fill=(255, 255, 255))
text_c(py + ph + G - b3[1], l3, big)

# логотип LUIS+ Практика сверху по центру
logo = Image.open(f"{TOOL}/luis_logo.png").convert("RGBA"); a = logo.getchannel("A")
lw = 150; lh = round(a.size[1] * lw / a.size[0]); a = a.resize((lw, lh), Image.LANCZOS)
pr = F("Exo2-BoldItalic", 20); pb = d.textbbox((0, 0), "ПРАКТИКА", font=pr); pwid = pb[2] - pb[0] + 26
total = lw + 12 + pwid; lx = (W - total) // 2; ly = 46
canvas.paste((255, 255, 255), (lx, ly), a)
px = lx + lw + 12; d.polygon([(px + 8, ly + 14), (px + pwid + 8, ly + 14), (px + pwid, ly + lh - 2), (px, ly + lh - 2)], fill=BLUE)
d.text((px + 13 - pb[0], ly + 14 + (lh - 16 - (pb[3] - pb[1])) / 2 - pb[1]), "ПРАКТИКА", font=pr, fill=(255, 255, 255))

# подписи спикеров внизу
nm = F("Exo2-Bold", 28); rl = F("Exo2-SemiBold", 17); tag = F("Exo2-BoldItalic", 15)
def sign(x, align, name, role, label, col):
    nb = d.textbbox((0, 0), name, font=nm); rb = d.textbbox((0, 0), role, font=rl); tb = d.textbbox((0, 0), label, font=tag)
    nx = x if align == "l" else x - (nb[2] - nb[0]); rx = x if align == "l" else x - (rb[2] - rb[0])
    tw_ = tb[2] - tb[0] + 20; tx = x if align == "l" else x - tw_
    d.polygon([(tx + 6, 592), (tx + tw_ + 6, 592), (tx + tw_, 614), (tx, 614)], fill=col)
    d.text((tx + 10 - tb[0], 603 - (tb[3] - tb[1]) / 2 - tb[1]), label, font=tag, fill=(255, 255, 255))
    d.text((nx - nb[0], 624 - nb[1]), name, font=nm, fill=(255, 255, 255))
    d.text((rx - rb[0], 662 - rb[1]), role, font=rl, fill=(205, 205, 205))
sign(48, "l", "Анастасия Кондрич", "заместитель технического директора LUIS+", "СПИКЕР", BLUE)
sign(W - 48, "r", "Ольга Полякова", "директор по маркетингу LUIS+", "МОДЕРАТОР", RED)
canvas.save(OUT, quality=93)
print("ok", OUT)
