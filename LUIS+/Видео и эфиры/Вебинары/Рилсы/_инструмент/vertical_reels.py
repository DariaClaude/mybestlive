"""Вертикальные рилсы 9:16 с автокадрированием по говорящему.

Поверх make_reels.py (Астра): берём оттуда хук-плашки, субтитры ASS, loudnorm и превью.
Новое: детекция лиц (YuNet), определение говорящего по движению губ, кроп 9:16 за спикером,
медленные наезды, переключения между спикерами на границах фраз, смена кадра на монтажных склейках.
"""
import json, math, subprocess, sys
from pathlib import Path
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
import make_reels as mr

S = mr.SETTINGS
S.update(output="out_v", work=".work_v",
         subtitle_size=84, subtitle_top=1330, subtitle_bottom=1640, subtitle_outline=5,
         subtitle_shadow=0, subtitle_margin=60, group_words_max=3, subtitle_lines=3,
         hook_top=150, hook_bottom=620, hook_size=64)
ROOT = Path(__file__).resolve().parent
FF = str(ROOT / "tools" / "ffmpeg"); FP = str(ROOT / "tools" / "ffprobe")
W, H, FPS = 1080, 1920, 30
ASPECT = W / H
MODEL = str(ROOT.parent / "models" / "yunet.onnx")
SAMPLE = 2            # детекция на каждом 2-м кадре
MAX_ZOOM = 1.35       # предел наезда в общих планах (720p не тянет больше)
PUSH = 0.08           # медленный наезд внутри плана, доля
FACE_FRAC = 0.22      # желаемая высота лица относительно высоты кропа
FACE_Y = 0.42         # положение центра лица по вертикали кропа
HOLD = 1.6            # минимум секунд между переключениями спикера
ONLY = sys.argv[1:]   # опционально: id рилсов для рендера


def run(cmd, **kw):
    r = subprocess.run([str(c) for c in cmd], cwd=str(ROOT), stdout=subprocess.PIPE, stderr=subprocess.PIPE, **kw)
    if r.returncode:
        raise RuntimeError("ffmpeg: " + r.stderr.decode("utf-8", "ignore")[-1500:])
    return r


def cut_source(reel, work):
    start, end, dur = mr.clip_range(reel)
    out = work / "cut.mp4"
    run([FF, "-y", "-nostdin", "-hide_banner", "-ss", f"{start:.3f}", "-t", f"{dur:.3f}", "-i", mr.local_path(reel["src"]),
         "-r", FPS, "-c:v", "libx264", "-crf", "16", "-preset", "fast", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", out])
    return out, dur


def analyse(video):
    """Лица и склейки по сэмплам. Возвращает (samples, cuts, size)."""
    cap = cv2.VideoCapture(str(video))
    w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    det = cv2.FaceDetectorYN.create(MODEL, "", (w, h), 0.7, 0.3, 50)
    samples, cuts, prev_hist, prev_small, i, metrics = [], [0], None, None, 0, []
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if i % SAMPLE == 0:
            hsv = cv2.cvtColor(cv2.resize(frame, (320, 180)), cv2.COLOR_BGR2HSV)
            hist = cv2.calcHist([hsv], [0, 1], None, [32, 32], [0, 180, 0, 256])
            cv2.normalize(hist, hist)
            small = cv2.cvtColor(cv2.resize(frame, (64, 36)), cv2.COLOR_BGR2GRAY).astype(np.float32)
            if prev_hist is not None:
                corr = cv2.compareHist(prev_hist, hist, cv2.HISTCMP_CORREL)
                diff = float(np.mean(np.abs(small - prev_small)))
                metrics.append((i, round(corr, 3), round(diff, 1)))
                if (corr < 0.6 or diff > 26) and i - cuts[-1] > FPS // 2:
                    cuts.append(i)
            prev_hist, prev_small = hist, small
            _, faces = det.detect(frame)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            found = []
            for f in ([] if faces is None else faces):
                x, y, fw, fh = f[:4]
                mx, my = (f[10] + f[12]) / 2, (f[11] + f[13]) / 2   # середина рта
                bw, bh = max(8, fw * 0.55), max(6, fw * 0.32)
                x0, y0 = int(max(0, mx - bw / 2)), int(max(0, my - bh / 2))
                mouth = gray[y0:int(y0 + bh), x0:int(x0 + bw)]
                face = gray[int(max(0, y)):int(y + fh), int(max(0, x)):int(x + fw)]
                if mouth.size == 0 or face.size == 0:
                    continue
                found.append(dict(x=float(x), y=float(y), w=float(fw), h=float(fh), score=float(f[14]),
                                  mouth=cv2.resize(mouth, (48, 24)).astype(np.float32),
                                  face=cv2.resize(face, (32, 32)).astype(np.float32)))
            samples.append(dict(frame=i, faces=found))
        i += 1
    cap.release()
    analyse.metrics = metrics
    return samples, cuts, (w, h), i


def build_tracks(samples, cuts, total):
    """Треки лиц внутри каждого плана + активность рта по кадрам."""
    bounds = cuts + [total]
    shots = []
    for a, b in zip(bounds[:-1], bounds[1:]):
        shot = dict(start=a, end=b, tracks=[])
        for s in samples:
            if not (a <= s["frame"] < b):
                continue
            for f in s["faces"]:
                cx, cy = f["x"] + f["w"] / 2, f["y"] + f["h"] / 2
                best = None
                for t in shot["tracks"]:
                    last = t["pts"][-1]
                    if s["frame"] - last["frame"] > SAMPLE * 12:
                        continue
                    lx, ly = last["x"] + last["w"] / 2, last["y"] + last["h"] / 2
                    d = math.hypot(cx - lx, cy - ly)
                    if d < 0.7 * max(f["w"], last["w"]) and (best is None or d < best[0]):
                        best = (d, t)
                pt = dict(frame=s["frame"], x=f["x"], y=f["y"], w=f["w"], h=f["h"], act=0.0)
                if best:
                    last = best[1]["pts"][-1]
                    md = float(np.mean(np.abs(f["mouth"] - best[1]["mouth"])))
                    fd = float(np.mean(np.abs(f["face"] - best[1]["face"])))
                    pt["act"] = max(0.0, md - 0.6 * fd)
                    best[1]["pts"].append(pt); best[1]["mouth"], best[1]["face"] = f["mouth"], f["face"]
                else:
                    shot["tracks"].append(dict(pts=[pt], mouth=f["mouth"], face=f["face"]))
        shot["tracks"] = [t for t in shot["tracks"] if len(t["pts"]) >= 3]
        for t in shot["tracks"]:
            acts = np.array([p["act"] for p in t["pts"]])
            k = 7
            sm = np.convolve(acts, np.ones(k) / k, mode="same") if len(acts) >= k else acts
            for p, a_ in zip(t["pts"], sm):
                p["act_s"] = float(a_)
            t["size"] = float(np.median([p["h"] for p in t["pts"]]))
        shots.append(shot)
    return shots


def track_at(track, frame):
    pts = track["pts"]
    if frame <= pts[0]["frame"]:
        return pts[0]
    for p0, p1 in zip(pts[:-1], pts[1:]):
        if p0["frame"] <= frame <= p1["frame"]:
            u = (frame - p0["frame"]) / max(1, p1["frame"] - p0["frame"])
            return {k: p0[k] + (p1[k] - p0[k]) * u for k in ("x", "y", "w", "h")}
    return pts[-1]


def mean_activity(track, f0, f1):
    vals = [p["act_s"] for p in track["pts"] if f0 <= p["frame"] < f1]
    vis = len(vals) * SAMPLE / max(1, f1 - f0)
    return (float(np.mean(vals)) if vals else 0.0), vis


def choose_speakers(shots, phrase_frames, speaker_x=None, width=None):
    """Для каждого плана — список (кадр_начала, трек|None). speaker_x (0..1 ширины) — принудительно держать спикера,
    чьё лицо ближе к этой доле ширины кадра (для фрагментов с одним говорящим и общими планами)."""
    plan = []
    if speaker_x is not None and width:
        for shot in shots:
            if shot["tracks"]:
                pick = min(shot["tracks"], key=lambda t: abs(float(np.median([q["x"] + q["w"] / 2 for q in t["pts"]])) / width - speaker_x))
            else:
                pick = None
            plan.append((shot["start"], pick))
        return plan
    for shot in shots:
        marks = [shot["start"]] + [f for f in phrase_frames if shot["start"] < f < shot["end"]] + [shot["end"]]
        current, since = None, shot["start"]
        for a, b in zip(marks[:-1], marks[1:]):
            cands = []
            for t in shot["tracks"]:
                act, vis = mean_activity(t, a, b)
                if vis >= 0.4:
                    cands.append((act, t["size"], t))
            if not cands:
                pick = current if current and mean_activity(current, a, b)[1] > 0 else None
                if pick is None and shot["tracks"]:
                    pick = max(shot["tracks"], key=lambda t: t["size"])
            else:
                cands.sort(key=lambda c: (c[0], c[1]), reverse=True)
                pick = cands[0][2]
                if current is not None and current is not pick:
                    cur_act = mean_activity(current, a, b)[0]
                    if cands[0][0] < 1.3 * cur_act + 0.4 or (a - since) / FPS < HOLD:
                        pick = current
            if pick is not current or not plan or plan[-1][0] != shot["start"] and a == shot["start"]:
                plan.append((a, pick)); since = a
            current = pick
    plan.sort(key=lambda x: x[0])
    dedup = []
    for p in plan:
        if dedup and dedup[-1][0] == p[0]:
            dedup[-1] = p
        else:
            dedup.append(p)
    return dedup


def camera_path(plan, total, size):
    sw, sh = size
    segs = [(a, t, (plan[i + 1][0] if i + 1 < len(plan) else total)) for i, (a, t) in enumerate(plan)]
    path = np.zeros((total, 3), dtype=np.float64)   # cx, cy, crop_h
    state = None
    for a, track, b in segs:
        for f in range(a, b):
            if track is None:
                tcx, tcy, th = sw / 2, sh / 2, sh / 1.0
            else:
                p = track_at(track, f)
                fh = p["h"]
                th = min(sh, max(sh / MAX_ZOOM, fh / FACE_FRAC))
                tcx = p["x"] + p["w"] / 2
                tcy = (p["y"] + p["h"] / 2) - FACE_Y * th + th / 2
            u = (f - a) / max(1, b - a)
            push = 1.0 + PUSH * (1 - (1 - u) ** 2)          # ease-out наезд
            th = th / push
            tw = th * ASPECT
            tcx = min(max(tcx, tw / 2), sw - tw / 2)
            tcy = min(max(tcy, th / 2), sh - th / 2)
            if state is None or f == a:
                state = np.array([tcx, tcy, th])            # склейка/переключение — резко
            else:
                alpha = 0.07
                state = state + alpha * (np.array([tcx, tcy, th]) - state)
            path[f] = state
    return path


def render_base(cut, path, size, work):
    sw, sh = size
    cap = cv2.VideoCapture(str(cut))
    out = work / "base.mp4"
    ff = subprocess.Popen([FF, "-y", "-nostdin", "-hide_banner", "-loglevel", "error",
                           "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                           "-i", str(cut), "-map", "0:v", "-map", "1:a:0", "-c:v", "libx264", "-crf", "18",
                           "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "copy", "-shortest", str(out)],
                          stdin=subprocess.PIPE, cwd=str(ROOT))
    i = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        cx, cy, ch = path[min(i, len(path) - 1)]
        cw = ch * ASPECT
        x0, y0 = cx - cw / 2, cy - ch / 2
        M = np.array([[W / cw, 0, -x0 * W / cw], [0, H / ch, -y0 * H / ch]], dtype=np.float32)
        img = cv2.warpAffine(frame, M, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
        blur = cv2.GaussianBlur(img, (0, 0), 1.3)
        img = cv2.addWeighted(img, 1.55, blur, -0.55, 0)
        ff.stdin.write(img.tobytes())
        i += 1
    ff.stdin.close(); ff.wait(); cap.release()
    if ff.returncode:
        raise RuntimeError("base render failed")
    return out, i


def compose(reel, work, base, dur, measurement, fonts_dir):
    overlay = work / "overlay.png"; ass = work / "captions.ass"
    rel = lambda p: p.relative_to(ROOT).as_posix()
    vf = (f"[0:v][1:v]overlay=0:0,ass=filename='{rel(ass)}':fontsdir='{fonts_dir}',"
          f"fade=t=in:st=0:d={S['fade']},fade=t=out:st={dur - S['fade']:.3f}:d={S['fade']},format=yuv420p")
    af = (f"afade=t=in:st=0:d={S['fade']},afade=t=out:st={dur - S['fade']:.3f}:d={S['fade']},"
          + mr.loudnorm_filter(measurement))
    out = mr.local_path(S["output"]) / f"reel_{reel['id']}_{reel['slug']}_v.mp4"
    run([FF, "-y", "-nostdin", "-hide_banner", "-i", base, "-i", overlay, "-filter_complex", vf, "-af", af,
         "-c:v", "libx264", "-crf", "20", "-preset", "medium", "-r", FPS, "-c:a", "aac", "-b:a", "160k", "-ar", "48000",
         "-movflags", "+faststart", "-shortest", out])
    return out


def contact_sheet(video, dur, dest, n=6):
    width = 300; height = round(width * H / W)
    sheet = Image.new("RGB", (n * width, height))
    for k in range(n):
        t = dur * (k + 0.5) / n
        r = run([FF, "-v", "error", "-nostdin", "-ss", f"{t:.3f}", "-i", video, "-frames:v", "1",
                 "-vf", f"scale={width}:{height}:flags=lanczos", "-f", "image2pipe", "-vcodec", "png", "-"])
        import io
        sheet.paste(Image.open(io.BytesIO(r.stdout)).convert("RGB"), (k * width, 0))
    sheet.save(str(dest), "JPEG", quality=90)


def main():
    reels = mr.load_config()
    notes = []
    bold, semi, ass_name, ass_bold = mr.select_fonts(ImageFont, notes)
    sub_font = ImageFont.truetype(str(semi), S["subtitle_size"])
    mr.local_path(S["output"]).mkdir(parents=True, exist_ok=True)
    fonts_dir = mr.local_path(S["fonts_dir"]).relative_to(ROOT).as_posix()
    for reel in reels:
        if ONLY and reel["id"] not in ONLY:
            continue
        rid = reel["id"]; work = mr.local_path(S["work"]) / rid; work.mkdir(parents=True, exist_ok=True)
        print(f"[{rid}] рез…", flush=True)
        cut, dur = cut_source(reel, work)
        start, _, _ = mr.clip_range(reel)
        groups = mr.subtitle_groups(reel["words"])
        phrase_frames = sorted({int(round((g[0]["s"] - start) * FPS)) for g in groups[1:]})
        print(f"[{rid}] анализ лиц…", flush=True)
        samples, cuts, size, total = analyse(cut)
        shots = build_tracks(samples, cuts, total)
        plan = choose_speakers(shots, phrase_frames, reel.get("speaker_x"), size[0])
        info = dict(frames=total, cuts=cuts, shots=[len(s["tracks"]) for s in shots],
                    switches=[(round(a / FPS, 2), None if t is None else round(t["size"])) for a, t in plan])
        m = analyse.metrics
        top = sorted(m, key=lambda x: x[2], reverse=True)[:4]
        print(f"[{rid}] кадров {total}, склеек {len(cuts) - 1} {[round(c / FPS, 2) for c in cuts[1:]]}, max diff {top}, переключений {len(plan)}: {info['switches']}", flush=True)
        path = camera_path(plan, total, size)
        print(f"[{rid}] рендер базы…", flush=True)
        base, n = render_base(cut, path, size, work)
        rn = []
        mr.make_overlay(reel, work, bold, Image, ImageDraw, ImageFont, rn)
        for size in (S["subtitle_size"], 78, 72, 66, 60):
            S["subtitle_size"] = size
            try:
                mr.make_ass(reel, groups, work / "captions.ass", ImageFont.truetype(str(semi), size), ass_name, ass_bold, rn)
                break
            except ValueError as exc:
                if size == 60:
                    raise
        if size != 84:
            rn.append(f"кегль субтитров снижен до {size}")
        S["subtitle_size"] = 84
        measurement = mr.measure_audio(FF, reel, work)
        out = compose(reel, work, base, dur, measurement, fonts_dir)
        contact_sheet(out, dur, mr.local_path(S["output"]) / f"sheet_{rid}.jpg")
        mr.write_json(work / "camera.json", info)
        print(f"[{rid}] готово: {out.name}  {rn}", flush=True)


if __name__ == "__main__":
    main()
