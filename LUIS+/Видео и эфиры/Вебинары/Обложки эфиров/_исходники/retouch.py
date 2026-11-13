"""Мягкая ретушь портрета в кадре: ровная кожа (частотное разложение по маске кожи), светлее под глазами,
резче глаза, мягкий свет на лицо, чуть теплее тон. python3 retouch.py <in.png> <out.png> <yunet.onnx>"""
import sys, cv2, numpy as np
src, dst, model = sys.argv[1:4]
img = cv2.imread(src); H, W = img.shape[:2]
det = cv2.FaceDetectorYN.create(model, "", (W, H), 0.7, 0.3, 50)
_, faces = det.detect(img); f = max(faces, key=lambda q: q[2] * q[3])
x, y, w, h = f[:4]; le, re_ = (f[4], f[5]), (f[6], f[7]); nose = (f[8], f[9]); mr, ml = (f[10], f[11]), (f[12], f[13])
fimg = img.astype(np.float32)

# 1) маска кожи: цвет щёк (между глазом и уголком рта) → расстояние в YCrCb, только в зоне лица и шеи
ycc = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb).astype(np.float32)
pts = []
for e, m in ((le, ml), (re_, mr)):
    cx, cy = int(e[0] * 0.55 + m[0] * 0.45), int(e[1] * 0.4 + m[1] * 0.6); r = int(w * 0.06)
    pts.append(ycc[cy - r:cy + r, cx - r:cx + r, 1:].reshape(-1, 2))
p = np.concatenate(pts); mu, cov = p.mean(0), np.cov(p.T) + np.eye(2) * 4
d = ycc[..., 1:] - mu; md = np.einsum("...i,ij,...j->...", d, np.linalg.inv(cov), d)
skin = np.clip(1.6 - md / 6.0, 0, 1)
roi = np.zeros((H, W), np.float32)
cv2.ellipse(roi, (int(x + w / 2), int(y + h * 0.55)), (int(w * 0.62), int(h * 0.78)), 0, 0, 360, 1, -1)   # лицо
cv2.ellipse(roi, (int(x + w / 2), int(y + h * 1.25)), (int(w * 0.45), int(h * 0.45)), 0, 0, 360, 1, -1)   # шея
skin *= roi
excl = np.zeros((H, W), np.float32)
for e in (le, re_):
    cv2.ellipse(excl, (int(e[0]), int(e[1])), (int(w * 0.15), int(h * 0.075)), 0, 0, 360, 1, -1)         # глаза
cv2.ellipse(excl, (int((ml[0] + mr[0]) / 2), int((ml[1] + mr[1]) / 2)), (int(abs(ml[0] - mr[0]) * 0.72), int(h * 0.085)), 0, 0, 360, 1, -1)  # губы
excl = cv2.GaussianBlur(excl, (0, 0), w * 0.02)
mask = cv2.GaussianBlur(skin * (1 - excl), (0, 0), w * 0.012)[..., None]

# 2) частотное разложение: низкие частоты выравниваем, высокие (поры) оставляем на 35 %
low = cv2.GaussianBlur(fimg, (0, 0), w * 0.012); high = fimg - low
smooth_low = cv2.bilateralFilter(cv2.bilateralFilter(low.astype(np.uint8), 0, 22, w * 0.03), 0, 18, w * 0.02).astype(np.float32)
fine = fimg - cv2.GaussianBlur(fimg, (0, 0), 1.0)
ret = smooth_low + high * 0.35 + fine * 0.25
out = fimg * (1 - mask * 0.85) + ret * (mask * 0.85)

# 2б) зона под глазами и «гусиные лапки»: мелкие морщины мягче (текстура остаётся на 15 %)
wz = np.zeros((H, W), np.float32); fcx = x + w / 2
for e in (le, re_):
    cv2.ellipse(wz, (int(e[0]), int(e[1] + h * 0.10)), (int(w * 0.16), int(h * 0.07)), 0, 0, 360, 1, -1)
    side = 1 if e[0] > fcx else -1
    cv2.ellipse(wz, (int(e[0] + side * w * 0.17), int(e[1] + h * 0.02)), (int(w * 0.07), int(h * 0.075)), 0, 0, 360, 1, -1)
wz = (cv2.GaussianBlur(wz, (0, 0), w * 0.025) * (1 - excl))[..., None] * mask
ret2 = smooth_low + high * 0.15 + fine * 0.15
out = out * (1 - wz * 0.7) + ret2 * (wz * 0.7)

# 3) под глазами светлее и ровнее
ue = np.zeros((H, W), np.float32)
for e in (le, re_):
    cv2.ellipse(ue, (int(e[0]), int(e[1] + h * 0.12)), (int(w * 0.14), int(h * 0.06)), 0, 0, 360, 1, -1)
ue = cv2.GaussianBlur(ue, (0, 0), w * 0.03)[..., None] * mask
lab = cv2.cvtColor(np.clip(out, 0, 255).astype(np.uint8), cv2.COLOR_BGR2LAB).astype(np.float32)
lab[..., 0] += ue[..., 0] * 9
# 4) мягкий свет на лицо (+ к яркости с плавным спадом) и чуть теплее кожа
yy, xx = np.mgrid[0:H, 0:W]
light = np.exp(-(((xx - (x + w / 2)) / (w * 1.1)) ** 2 + ((yy - (y + h * 0.5)) / (h * 1.2)) ** 2))
lab[..., 0] += light * 9
lab[..., 1] += mask[..., 0] * 1.5; lab[..., 2] += mask[..., 0] * 2.0
out = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.float32)
# 5) глаза: локальная резкость и капля яркости
eye = np.zeros((H, W), np.float32)
for e in (le, re_):
    cv2.ellipse(eye, (int(e[0]), int(e[1])), (int(w * 0.11), int(h * 0.055)), 0, 0, 360, 1, -1)
eye = cv2.GaussianBlur(eye, (0, 0), w * 0.012)[..., None]
sharp = out + (out - cv2.GaussianBlur(out, (0, 0), 1.4)) * 0.9
out = out * (1 - eye) + (sharp * 1.04) * eye
cv2.imwrite(dst, np.clip(out, 0, 255).astype(np.uint8))
# превью до/после
s = int(h * 1.9); cx, cy = int(x + w / 2), int(y + h * 0.55)
a = img[max(0, cy - s):cy + s, max(0, cx - s):cx + s]; b = np.clip(out, 0, 255).astype(np.uint8)[max(0, cy - s):cy + s, max(0, cx - s):cx + s]
cv2.imwrite(dst.replace(".png", "_cmp.jpg"), cv2.resize(np.hstack([a, b]), None, fx=0.6, fy=0.6), [cv2.IMWRITE_JPEG_QUALITY, 90])
print("ok", dst)
