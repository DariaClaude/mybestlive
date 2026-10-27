#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Монтаж LUIS+. Python 3.6+, Pillow и FFmpeg с libass; сеть не используется."""

import argparse
import io
import json
import math
import os
import re
import shutil
import struct
import subprocess
import sys
from fractions import Fraction
from itertools import combinations
from pathlib import Path


# Все параметры оформления и экспорта находятся здесь.
ROOT = Path(__file__).resolve().parent
SETTINGS = {
    "config": "config.json", "output": "out", "work": ".work",
    "logo": "luis_logo.png", "fonts_dir": "fonts",
    "bold_font": "fonts/Exo2-Bold.ttf",
    "semibold_font": "fonts/Exo2-SemiBold.ttf",
    "fallback_font": "fonts/DejaVuSans-Bold.ttf",
    "system_fallback": "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf",
    "width": 1080, "height": 1920, "fps": 30,
    "lead": 0.25, "tail": 0.35, "fade": 0.25,
    "foreground_center_y": 860,
    "blur_radius": 20, "blur_power": 2, "background_dim": 0.35,
    "hook_size": 66, "hook_color": "#FFFFFF", "brand_color": "#BE1730",
    "hook_left": 72, "hook_right": 72, "hook_top": 190, "hook_bottom": 640,
    "hook_pad_x": 22, "hook_pad_y": 10, "hook_gap": 12,
    "hook_chars": 20, "hook_lines": 3, "hook_min_size": 40,
    "subtitle_size": 60, "subtitle_color": "&H00FFFFFF",
    "subtitle_outline_color": "&H00000000", "subtitle_outline": 3,
    "subtitle_shadow": 3, "subtitle_top": 1240, "subtitle_bottom": 1520,
    "subtitle_margin": 72, "subtitle_lines": 2,
    "group_words_min": 2, "group_words_max": 4, "group_seconds_min": 0.6,
    "logo_width": 200, "logo_opacity": 0.85, "logo_margin": 60,
    "codec": "libx264", "crf": 20, "preset": "medium", "pixel_format": "yuv420p",
    "audio_codec": "aac", "audio_bitrate": "160k", "audio_rate": 48000,
    "loudness_i": -16, "loudness_tp": -1.5, "loudness_lra": 11,
    "threads": 2, "duration_tolerance": 0.3,
    "preview_width": 360, "preview_quality": 92, "preview_edge_seconds": 0.5,
}

CRITIQUE = """КРИТИКА ФРАГМЕНТОВ (по текстам config.json, без оценки исполнения в кадре)
01 — слабый старт: около 23 секунд вступления до обращения к ИИ. Шутка может
восприниматься как снисходительность к аудитории. Начать с «Ребята, обратитесь…»
и быстрее перейти к конкретному применению ИИ в бизнесе.
Новый хук: «Бизнес буксует? Попробуйте спросить ИИ» (5 слов).

02 — понятный анекдот с развязкой, но начало «смысл был в том» зависит от контекста,
а повтор вопросов затягивает подводку. Начать со студента и запрета GPT.
Новый хук: «Запретили GPT — пришлось думать самому» (5 слов).
В расшифровке есть «забою вопрос»: сверить с аудио; автоматически не исправлено.

03 — самый ясный обучающий фрагмент: различие консультанта и исполнителя.
После «И приносит вам ответ» основная мысль уже закончена; перечисление профессий
ослабляет темп. Оставить первую аналогию и один наглядный пример результата.
Новый хук: «Чат советует. Агент выполняет задачу» (5 слов).

04 — короткая конфликтная ситуация, но имя Виктории, «языка», «этого госуслуг»
и фантазия про квартиру требуют контекста. В хуке лучше обозначить чужие команды
в письме; не обещать зрителю, что письмо само по себе способно переоформить жильё.
Новый хук: «Чужое письмо может обмануть вашего ИИ-агента» (6 слов).

05 — слабее остальных: 38 секунд абстрактного тезиса, многократное «инструмент»,
поздний вывод и обесценивающая концовка. Утверждение про рост в 10–20 раз
внутри этого фрагмента не подкреплено примером. Нужна конкретная задача и результат.
Новый хук: «Что ИИ усиливает: мышление или поток отписок?» (7 слов).

На замену — 05. Найти в эфире конкретный кейс: задача → действие агента → результат.
В имеющихся окнах такой замены не установлено; новый таймкод не придуман.
Предложенные хуки и сокращения — рекомендации, config.json не изменён.
"""


def write_text(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def write_json(path, value):
    write_text(path, json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def local_path(value):
    path = (ROOT / value).resolve()
    if path != ROOT and ROOT not in path.parents:
        raise ValueError("Путь выходит за пределы reels/: " + str(value))
    return path


def clip_range(reel):
    start = float(reel["in_rel"]) - SETTINGS["lead"]
    end = float(reel["out_rel"]) + SETTINGS["tail"]
    if start < 0 or end <= start:
        raise ValueError("Недостаточный запас или неверный рез: " + reel["id"])
    return start, end, end - start


def load_config():
    reels = json.loads(local_path(SETTINGS["config"]).read_text(encoding="utf-8"))
    if not isinstance(reels, list) or len(reels) != 5:
        raise ValueError("Ожидается список из пяти рилсов")
    ids = set()
    for reel in reels:
        ident = reel["id"]
        if not re.fullmatch(r"\d{2}", ident) or ident in ids:
            raise ValueError("Некорректный или повторяющийся id")
        ids.add(ident)
        if not re.fullmatch(r"[a-z0-9_]+", reel["slug"]):
            raise ValueError("Некорректный slug: " + ident)
        if not local_path(reel["src"]).is_file() or not reel["hook"].strip():
            raise ValueError("Нет исходника или заголовка: " + ident)
        if not all(math.isfinite(float(reel[k])) for k in ("in_rel", "out_rel")):
            raise ValueError("Нечисловой таймкод: " + ident)
        clip_range(reel)
        previous_end = float(reel["in_rel"])
        if not reel["words"]:
            raise ValueError("Нет пословных таймкодов: " + ident)
        for word in reel["words"]:
            start, end = float(word["s"]), float(word["e"])
            if (not math.isfinite(start) or not math.isfinite(end) or end < start
                    or start < previous_end - 0.001 or end > reel["out_rel"] + 0.001
                    or not isinstance(word["w"], str) or not word["w"].strip()):
                raise ValueError("Неверный интервал слова: {} {!r}".format(ident, word))
            previous_end = end
    return reels


def word_count(group):
    return sum(bool(re.search(r"\w", word["w"])) for word in group)


def group_duration(group):
    return float(group[-1]["e"]) - float(group[0]["s"])


def subtitle_groups(words):
    # Паузы сохраняются; короткие группы склеиваются, а не растягиваются.
    groups, current = [], []
    for word in words:
        current.append(dict(word))
        punctuation = re.search(r"[,.;:!?…][»\"')]*$", word["w"])
        if punctuation or word_count(current) >= SETTINGS["group_words_max"]:
            groups.append(current)
            current = []
    if current:
        groups.append(current)
    index = 0
    while index < len(groups) and len(groups) > 1:
        group = groups[index]
        if (group_duration(group) + 1e-8 >= SETTINGS["group_seconds_min"]
                and word_count(group) >= SETTINGS["group_words_min"]):
            index += 1
            continue
        choices = []
        for left in (index - 1, index):
            if 0 <= left < len(groups) - 1:
                merged = groups[left] + groups[left + 1]
                gap = groups[left + 1][0]["s"] - groups[left][-1]["e"]
                score = (max(0, word_count(merged) - SETTINGS["group_words_max"]),
                         gap, group_duration(merged), -left)
                choices.append((score, left, merged))
        _, left, merged = min(choices)
        groups[left:left + 2] = [merged]
        index = max(0, left - 1)
    return groups


def caption_text(group):
    text = " ".join(word["w"] for word in group)
    # Убираем пробелы перед присоединёнными дефисами, не правим распознавание.
    text = re.sub(r"(?<=\w)\s+-(?=\w)", "-", text)
    return re.sub(r"[.]+(?=[»\"')]*$)", "", text).strip()


def ass_time(seconds):
    value = int(round(max(0, seconds) * 100))
    hours, value = divmod(value, 360000)
    minutes, value = divmod(value, 6000)
    seconds, cents = divmod(value, 100)
    return "{}:{:02d}:{:02d}.{:02d}".format(hours, minutes, seconds, cents)


def ass_escape(text):
    return text.replace("\\", r"\e").replace("{", r"\{").replace("}", r"\}")


def partition_lines(text, max_lines, fits):
    words = text.split()
    for count in range(1, min(len(words), max_lines) + 1):
        candidates = []
        for cuts in combinations(range(1, len(words)), count - 1):
            bounds = (0,) + cuts + (len(words),)
            lines = [" ".join(words[a:b]) for a, b in zip(bounds, bounds[1:])]
            if all(fits(line) for line in lines):
                lengths = [len(line) for line in lines]
                orphan = sum(line.endswith((" —", " –", " в", " к", " с", " не"))
                             for line in lines[:-1])
                score = (max(lengths), orphan, max(lengths) - min(lengths))
                candidates.append((score, lines))
        if candidates:
            return min(candidates, key=lambda item: item[0])[1]
    return None


def font_width(font, text):
    bbox = font.getbbox(text)
    return max(font.getlength(text), bbox[2] - bbox[0])


def hook_layout(text, load_font, notes):
    available = (SETTINGS["width"] - SETTINGS["hook_left"] - SETTINGS["hook_right"]
                 - 2 * SETTINGS["hook_pad_x"])
    size = SETTINGS["hook_size"]
    font = load_font(size)
    lines = partition_lines(text, SETTINGS["hook_lines"],
                            lambda line: len(line) <= SETTINGS["hook_chars"]
                            and font_width(font, line) <= available)
    if lines is None:
        # При конфликте лимитов сохраняем весь хук и явно описываем уступку.
        notes.append("Хук не помещается в 3 строки по 20 символов; текст сохранён, "
                     "лимит символов для него увеличен.")
        for size in range(SETTINGS["hook_size"], SETTINGS["hook_min_size"] - 1, -1):
            font = load_font(size)
            lines = partition_lines(text, SETTINGS["hook_lines"],
                                    lambda line: font_width(font, line) <= available)
            if lines:
                break
        if not lines:
            raise ValueError("Хук не помещается в верхнюю зону: " + text)
        if size != SETTINGS["hook_size"]:
            notes.append("Размер длинного хука уменьшен с {} до {} px, чтобы "
                         "избежать обрезки текста.".format(SETTINGS["hook_size"], size))
    return lines, font, size


def import_pillow():
    sys.path.insert(0, str(ROOT / ".deps"))
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        raise RuntimeError("Не установлен Pillow. Выполните python3 setup_tools.py "
                           "при доступной сети или установите Pillow в reels/.deps/.")
    return Image, ImageDraw, ImageFont


def select_fonts(ImageFont, notes):
    bold, semi = local_path(SETTINGS["bold_font"]), local_path(SETTINGS["semibold_font"])
    if bold.is_file() and semi.is_file():
        # Полное имя начертания позволяет libass отличить SemiBold от Bold.
        semibold = ImageFont.truetype(str(semi), SETTINGS["subtitle_size"])
        family, style = semibold.getname()
        ass_name = family if style.lower() == "regular" else family + " " + style
        return bold, semi, ass_name, 0
    fallback = local_path(SETTINGS["fallback_font"])
    if not fallback.is_file():
        source = Path(SETTINGS["system_fallback"])
        if not source.is_file():
            raise RuntimeError("Нет Exo 2 и резервного DejaVu Sans Bold")
        fallback.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(str(source), str(fallback))
    notes.append("Exo 2 Bold/SemiBold недоступны: используется DejaVu Sans Bold "
                 "для заголовков и субтитров.")
    return fallback, fallback, "DejaVu Sans", -1


def make_overlay(reel, work, bold, Image, ImageDraw, ImageFont, notes):
    image = Image.new("RGBA", (SETTINGS["width"], SETTINGS["height"]), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    lines, font, size = hook_layout(
        reel["hook"], lambda px: ImageFont.truetype(str(bold), px), notes)
    y = SETTINGS["hook_top"]
    px, py = SETTINGS["hook_pad_x"], SETTINGS["hook_pad_y"]
    for line in lines:
        left, top, right, bottom = draw.textbbox((0, 0), line, font=font)
        width, height = right - left + 2 * px, bottom - top + 2 * py
        x = SETTINGS["hook_left"]
        if y + height > SETTINGS["hook_bottom"]:
            raise ValueError("Заголовок вышел за верхнюю зону")
        draw.rectangle((x, y, x + width - 1, y + height - 1), fill=SETTINGS["brand_color"])
        draw.text((x + px - left, y + py - top), line, font=font, fill=SETTINGS["hook_color"])
        y += height + SETTINGS["hook_gap"]
    with Image.open(str(local_path(SETTINGS["logo"]))) as source:
        logo = source.convert("RGBA")
    logo_height = round(logo.height * SETTINGS["logo_width"] / logo.width)
    resampling = getattr(Image, "Resampling", Image)
    logo = logo.resize((SETTINGS["logo_width"], logo_height), resampling.LANCZOS)
    logo.putalpha(logo.getchannel("A").point(lambda alpha: round(alpha * SETTINGS["logo_opacity"])))
    image.alpha_composite(logo, (SETTINGS["width"] - logo.width - SETTINGS["logo_margin"],
                                 SETTINGS["height"] - logo.height - SETTINGS["logo_margin"]))
    image.save(str(work / "overlay.png"))
    return {"lines": lines, "font_size": size, "bottom": y - SETTINGS["hook_gap"]}


def make_ass(reel, groups, path, font, ass_name, bold, notes):
    center_x = SETTINGS["width"] // 2
    center_y = (SETTINGS["subtitle_top"] + SETTINGS["subtitle_bottom"]) // 2
    width = SETTINGS["width"] - 2 * SETTINGS["subtitle_margin"] - 2 * SETTINGS["subtitle_outline"]
    header = """[Script Info]
ScriptType: v4.00+
PlayResX: {width}
PlayResY: {height}
ScaledBorderAndShadow: yes
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,{name},{size},{color},{color},{outline_color},{outline_color},{bold},0,0,0,100,100,0,0,1,{outline},{shadow},5,{margin},{margin},0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""".format(width=SETTINGS["width"], height=SETTINGS["height"], name=ass_name,
           size=SETTINGS["subtitle_size"], color=SETTINGS["subtitle_color"],
           outline_color=SETTINGS["subtitle_outline_color"], bold=bold,
           outline=SETTINGS["subtitle_outline"], shadow=SETTINGS["subtitle_shadow"],
           margin=SETTINGS["subtitle_margin"])
    start, _, duration = clip_range(reel)
    events, manifest = [], []
    for group in groups:
        text = caption_text(group)
        lines = partition_lines(text, SETTINGS["subtitle_lines"],
                                lambda line: font_width(font, line) <= width)
        if lines is None:
            raise ValueError("Субтитр не помещается в две строки: " + text)
        begin, end = group[0]["s"] - start, group[-1]["e"] - start
        if begin < -0.001 or end > duration + 0.001 or end <= begin:
            raise ValueError("Субтитр за границами фрагмента: " + text)
        tag = r"{\an5\pos(%d,%d)\q2}" % (center_x, center_y)
        events.append("Dialogue: 0,{},{},Caption,,0,0,0,,{}{}".format(
            ass_time(begin), ass_time(end), tag, r"\N".join(ass_escape(line) for line in lines)))
        manifest.append({"start": round(begin, 4), "end": round(end, 4),
                         "text": text, "lines": lines, "source_words": len(group)})
    oversized = sum(word_count(group) > SETTINGS["group_words_max"] for group in groups)
    if oversized:
        notes.append("Групп субтитров длиннее 4 слов после обязательного склеивания "
                     "коротких интервалов: {}.".format(oversized))
    write_text(path, header + "\n".join(events) + "\n")
    return manifest


def find_tool(name):
    candidates = [ROOT / "tools" / name, shutil.which(name)]
    for candidate in candidates:
        if candidate and Path(candidate).is_file() and os.access(str(candidate), os.X_OK):
            return str(Path(candidate).resolve())
    raise RuntimeError("Не найден {}. Нужна локальная установка tools/{} "
                       "или исполняемый файл в PATH.".format(name, name))


def run_capture(command):
    completed = subprocess.run([str(arg) for arg in command], cwd=str(ROOT),
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=child_environment())
    stdout = completed.stdout.decode("utf-8", "replace")
    stderr = completed.stderr.decode("utf-8", "replace")
    if completed.returncode:
        raise RuntimeError("Команда завершилась с кодом {}:\n{}\n{}".format(
            completed.returncode, " ".join(str(arg) for arg in command), stderr[-6000:]))
    return stdout, stderr


def child_environment():
    environment = os.environ.copy()
    for variable, folder in (("TMPDIR", ".tmp"), ("XDG_CACHE_HOME", ".cache")):
        path = local_path(folder)
        path.mkdir(parents=True, exist_ok=True)
        environment[variable] = str(path)
    return environment


def check_ffmpeg(ffmpeg):
    filters, _ = run_capture([ffmpeg, "-hide_banner", "-filters"])
    required = ("ass", "loudnorm", "boxblur", "overlay", "fade", "afade")
    available = set(re.findall(r"^\s*[.A-Z|]{3}\s+(\w+)\s", filters, re.MULTILINE))
    missing = set(required) - available
    if missing:
        raise RuntimeError("В FFmpeg отсутствуют фильтры: " + ", ".join(sorted(missing)))
    encoders, _ = run_capture([ffmpeg, "-hide_banner", "-encoders"])
    for codec in (SETTINGS["codec"], SETTINGS["audio_codec"]):
        if not re.search(r"\s" + re.escape(codec) + r"\s", encoders):
            raise RuntimeError("В FFmpeg нет кодировщика " + codec)
    return run_capture([ffmpeg, "-version"])[0].splitlines()[0]


def probe(ffprobe, path):
    text, _ = run_capture([ffprobe, "-v", "error", "-show_streams", "-show_format",
                          "-of", "json", str(path)])
    return json.loads(text)


def audio_chain(duration):
    return ("atrim=duration={d:.6f},asetpts=PTS-STARTPTS,"
            "aformat=sample_rates={rate}:channel_layouts=stereo,"
            "afade=t=in:st=0:d={fade},afade=t=out:st={end:.6f}:d={fade}").format(
                d=duration, rate=SETTINGS["audio_rate"], fade=SETTINGS["fade"],
                end=duration - SETTINGS["fade"])


def loudnorm_filter(measurement=None):
    result = "loudnorm=I={}:TP={}:LRA={}".format(
        SETTINGS["loudness_i"], SETTINGS["loudness_tp"], SETTINGS["loudness_lra"])
    if measurement:
        for option, key in (("measured_I", "input_i"), ("measured_TP", "input_tp"),
                            ("measured_LRA", "input_lra"), ("measured_thresh", "input_thresh"),
                            ("offset", "target_offset")):
            if not math.isfinite(float(measurement[key])):
                raise ValueError("Невозможно нормализовать тишину или повреждённую аудиодорожку")
            result += ":{}={}".format(option, measurement[key])
        result += ":linear=true"
    return result + ":print_format=json"


def measure_audio(ffmpeg, reel, work):
    start, _, duration = clip_range(reel)
    command = [ffmpeg, "-nostdin", "-hide_banner", "-ss", start, "-t", duration,
               "-i", local_path(reel["src"]), "-map", "0:a:0", "-vn",
               "-af", audio_chain(duration) + "," + loudnorm_filter(), "-f", "null", "-"]
    _, stderr = run_capture(command)
    write_text(work / "loudness_pass1.log", stderr)
    for block in re.findall(r"\{[^{}]*\}", stderr):
        value = json.loads(block)
        if "input_i" in value:
            write_json(work / "loudness_pass1.json", value)
            return value
    raise RuntimeError("FFmpeg не вернул измерения loudnorm")


def filter_graph(duration, work, measurement):
    relative = work.relative_to(ROOT).as_posix()
    fonts_dir = local_path(SETTINGS["fonts_dir"]).relative_to(ROOT).as_posix()
    w, h, fps = SETTINGS["width"], SETTINGS["height"], SETTINGS["fps"]
    graph = [
        "[0:v]trim=duration={:.6f},setpts=PTS-STARTPTS,fps={},setsar=1,split=2[bg][fg]".format(duration, fps),
        "[bg]scale={}:{}:force_original_aspect_ratio=increase:flags=lanczos,".format(w, h)
        + "crop={}:{},boxblur=luma_radius={}:luma_power={},".format(
            w, h, SETTINGS["blur_radius"], SETTINGS["blur_power"])
        + "drawbox=x=0:y=0:w=iw:h=ih:color=black@{}:t=fill[back]".format(SETTINGS["background_dim"]),
        "[fg]scale={}:-2:flags=lanczos,setsar=1[front]".format(w),
        "[back][front]overlay=x=(W-w)/2:y={}-h/2[scene]".format(SETTINGS["foreground_center_y"]),
        "[1:v]format=rgba[branding]",
        "[scene][branding]overlay=x=0:y=0:eof_action=repeat:shortest=1[branded]",
        "[branded]ass=filename='{}/captions.ass':fontsdir='{}',".format(relative, fonts_dir)
        + "fade=t=in:st=0:d={},fade=t=out:st={:.6f}:d={},format={}[v]".format(
            SETTINGS["fade"], duration - SETTINGS["fade"], SETTINGS["fade"], SETTINGS["pixel_format"]),
        "[0:a]" + audio_chain(duration) + "," + loudnorm_filter(measurement)
        + ",aresample={}[a]".format(SETTINGS["audio_rate"]),
    ]
    return ";\n".join(graph) + "\n"


def render(ffmpeg, reel, work, measurement):
    start, _, duration = clip_range(reel)
    write_text(work / "filters.txt", filter_graph(duration, work, measurement))
    temporary = work / "rendering.mp4"
    command = [ffmpeg, "-y", "-nostdin", "-hide_banner", "-nostats",
               "-filter_complex_threads", SETTINGS["threads"],
               "-ss", "{:.6f}".format(start), "-t", "{:.6f}".format(duration),
               "-i", local_path(reel["src"]), "-loop", "1", "-framerate", SETTINGS["fps"],
               "-i", work / "overlay.png", "-filter_complex_script", work / "filters.txt",
               "-map", "[v]", "-map", "[a]", "-map_metadata", "-1",
               "-c:v", SETTINGS["codec"], "-crf", SETTINGS["crf"], "-preset", SETTINGS["preset"],
               "-pix_fmt", SETTINGS["pixel_format"], "-r", SETTINGS["fps"],
               "-threads", SETTINGS["threads"], "-c:a", SETTINGS["audio_codec"],
               "-b:a", SETTINGS["audio_bitrate"], "-ar", SETTINGS["audio_rate"],
               "-ac", "2", "-t", "{:.6f}".format(duration), "-movflags", "+faststart", temporary]
    write_json(work / "command.json", [str(arg) for arg in command])
    with (work / "render.log").open("wb") as log:
        completed = subprocess.run([str(arg) for arg in command], cwd=str(ROOT),
                                   stdout=subprocess.DEVNULL, stderr=log, env=child_environment())
    if completed.returncode:
        raise RuntimeError("Ошибка экспорта {}. Подробности: {}".format(reel["id"], work / "render.log"))
    # Старый результат заменяется только после успешного экспорта и проверки.
    return temporary


def mp4_faststart(path):
    positions = {}
    with path.open("rb") as stream:
        total = path.stat().st_size
        while stream.tell() + 8 <= total:
            offset = stream.tell()
            size, kind = struct.unpack(">I4s", stream.read(8))
            if size == 1:
                size = struct.unpack(">Q", stream.read(8))[0]
            elif size == 0:
                size = total - offset
            if size < 8 or offset + size > total:
                break
            positions[kind] = offset
            stream.seek(offset + size)
    return b"moov" in positions and b"mdat" in positions and positions[b"moov"] < positions[b"mdat"]


def check_output(ffprobe, path, expected):
    info = probe(ffprobe, path)
    videos = [s for s in info["streams"] if s["codec_type"] == "video"]
    audios = [s for s in info["streams"] if s["codec_type"] == "audio"]
    if len(videos) != 1 or len(audios) != 1:
        raise RuntimeError("Ожидается одна видео- и одна аудиодорожка")
    video, audio = videos[0], audios[0]
    duration = float(info["format"]["duration"])
    checks = [video["width"] == SETTINGS["width"], video["height"] == SETTINGS["height"],
              video["codec_name"] == "h264", video["pix_fmt"] == SETTINGS["pixel_format"],
              Fraction(video["avg_frame_rate"]) == SETTINGS["fps"],
              Fraction(video["r_frame_rate"]) == SETTINGS["fps"], audio["codec_name"] == "aac",
              abs(duration - expected) <= SETTINGS["duration_tolerance"], mp4_faststart(path)]
    if not all(checks):
        raise RuntimeError("Параметры результата не соответствуют ТЗ: " + str(path))
    return info


def make_preview(ffmpeg, video, duration, destination, Image):
    edge = min(SETTINGS["preview_edge_seconds"], duration / 4)
    times = [edge, duration / 2, duration - edge]
    width = SETTINGS["preview_width"]
    height = round(width * SETTINGS["height"] / SETTINGS["width"])
    sheet = Image.new("RGB", (3 * width, height))
    for index, time in enumerate(times):
        command = [ffmpeg, "-v", "error", "-nostdin", "-ss", "{:.6f}".format(time),
                   "-i", video, "-frames:v", "1", "-vf", "scale={}:{}:flags=lanczos".format(width, height),
                   "-f", "image2pipe", "-vcodec", "png", "-"]
        completed = subprocess.run([str(arg) for arg in command], cwd=str(ROOT),
                                   stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=child_environment())
        if completed.returncode or not completed.stdout:
            raise RuntimeError("Не удалось извлечь кадр для превью: " + str(video))
        with Image.open(io.BytesIO(completed.stdout)) as frame:
            sheet.paste(frame.convert("RGB"), (index * width, 0))
    temporary = destination.with_suffix(".tmp.jpg")
    sheet.save(str(temporary), "JPEG", quality=SETTINGS["preview_quality"], subsampling=0)
    temporary.replace(destination)
    return times


def write_report(reels, results, notes, status, error=None, version=None):
    lines = ["LUIS+ — монтаж пяти вертикальных рилсов", "", "СТАТУС: " + status, ""]
    if error:
        lines.extend(["ПРИЧИНА ОСТАНОВКИ: " + str(error), ""])
    lines.extend(["Скрипт: make_reels.py; повторный запуск: python3 make_reels.py",
                  "Рабочие материалы: .work/; готовые файлы: out/.",
                  "Скрипт не обращается к сети. Сервер не запускается.",
                  "Исходники и config.json не изменяются. Разрешение исходника читается заново.", ""])
    if version:
        lines.append(version)
    lines.extend(["ЗАДАННЫЕ ПАРАМЕТРЫ ЭКСПОРТА (фактические указаны ниже только после ffprobe):",
                  "1080x1920, 30 fps, libx264, crf 20, preset medium, yuv420p, +faststart;",
                  "AAC 160k, 48 kHz, stereo; loudnorm в два прохода: I=-16, TP=-1.5, LRA=11.",
                  "Рез: in_rel−0.25 … out_rel+0.35; fade-in/out видео и аудио по 0.25 s.",
                  "Превью: 1080x640 JPG, три кадра по 360x640; края взяты вне fade.", "",
                  "ФАЙЛЫ / FFPROBE:"])
    for reel in reels:
        result = results.get(reel["id"])
        _, _, expected = clip_range(reel)
        filename = "reel_{}_{}.mp4".format(reel["id"], reel["slug"])
        if not result:
            lines.append("{} — НЕ СОЗДАН/НЕ ПРОВЕРЕН в этом запуске; ожидается {:.3f} s. "
                         "Фактических данных ffprobe нет.".format(filename, expected))
            continue
        video = next(s for s in result["probe"]["streams"] if s["codec_type"] == "video")
        audio = next(s for s in result["probe"]["streams"] if s["codec_type"] == "audio")
        actual = float(result["probe"]["format"]["duration"])
        lines.append("{} — {}x{}, fps={}, duration={:.3f} s (план {:.3f}, Δ{:+.3f}); "
                     "{}/{}, {}, audio bitrate={} bit/s; faststart OK; preview_{}.jpg OK.".format(
                         filename, video["width"], video["height"], video["avg_frame_rate"],
                         actual, expected, actual - expected, video["codec_name"], video["pix_fmt"],
                         audio["codec_name"], audio.get("bit_rate", "n/a"), reel["id"]))
        lines.append("  Исходник: {}x{}; превью на {:.3f}, {:.3f}, {:.3f} s.".format(
            result["source_size"][0], result["source_size"][1], *result["preview_times"]))
    lines.extend(["", "ОТКЛОНЕНИЯ И ПРИМЕЧАНИЯ:"])
    lines.extend("- " + note for note in dict.fromkeys(notes))
    if not notes:
        lines.append("Нет.")
    setup = ROOT / "setup_status.json"
    if setup.is_file():
        lines.extend(["", "УСТАНОВКА ИНСТРУМЕНТОВ:", setup.read_text(encoding="utf-8")])
    lines.extend(["", CRITIQUE])
    write_text(ROOT / "result.txt", "\n".join(lines) + "\n")


def prepare_timing(reels):
    # Доступно даже без FFmpeg/Pillow: проверяет слова и сохраняет исходные группы.
    groups = {}
    for reel in reels:
        ident = reel["id"]
        groups[ident] = subtitle_groups(reel["words"])
        start, end, duration = clip_range(reel)
        write_json(local_path(SETTINGS["work"]) / ident / "timing.json", {
            "raw_start": start, "raw_end": end, "expected_duration": duration,
            "groups": [{"start": g[0]["s"] - start, "end": g[-1]["e"] - start,
                        "text": caption_text(g), "words": g} for g in groups[ident]],
        })
    return groups


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--prepare-timing", action="store_true",
                        help="Только проверить config.json и подготовить группы таймкодов")
    args = parser.parse_args()
    reels, results, notes, version = [], {}, [], None
    notes.append("Инструменты устанавливаются в reels/tools/, Pillow — в reels/.deps/: "
                 "запись за пределами reels/ не выполняется; /usr/local/bin/ недоступен в этой среде.")
    try:
        reels = load_config()
        local_path(SETTINGS["output"]).mkdir(parents=True, exist_ok=True)
        groups = prepare_timing(reels)
        for reel in reels:
            if partition_lines(reel["hook"], SETTINGS["hook_lines"],
                               lambda line: len(line) <= SETTINGS["hook_chars"]) is None:
                notes.append("{}: исходный хук ({} символов) невозможно полностью разместить "
                             "в трёх строках по 20 символов. При экспорте приоритет — "
                             "сохранить текст и три строки; лимит символов увеличивается, "
                             "при необходимости уменьшается кегль.".format(reel["id"], len(reel["hook"])))
        if args.prepare_timing:
            write_report(reels, results, notes, "ПОДГОТОВЛЕНЫ ТОЛЬКО ТАЙМКОДЫ; ЭКСПОРТ НЕ ВЫПОЛНЕН")
            print("Проверены пять конфигураций, группы сохранены в .work/")
            return 0
        missing = []
        for name in ("ffmpeg", "ffprobe"):
            try:
                find_tool(name)
            except RuntimeError as exc:
                missing.append(str(exc))
        try:
            Image, ImageDraw, ImageFont = import_pillow()
        except RuntimeError as exc:
            missing.append(str(exc))
        if missing:
            raise RuntimeError("\n".join(missing))
        ffmpeg, ffprobe = find_tool("ffmpeg"), find_tool("ffprobe")
        version = check_ffmpeg(ffmpeg)
        bold, semi, ass_name, ass_bold = select_fonts(ImageFont, notes)
        subtitle_font = ImageFont.truetype(str(semi), SETTINGS["subtitle_size"])
        for reel in reels:
            ident = reel["id"]
            print("[{}] Подготовка и экспорт…".format(ident), flush=True)
            work = local_path(SETTINGS["work"]) / ident
            source_info = probe(ffprobe, local_path(reel["src"]))
            video = next(s for s in source_info["streams"] if s["codec_type"] == "video")
            if not any(s["codec_type"] == "audio" for s in source_info["streams"]):
                raise ValueError("Нет аудиодорожки: " + ident)
            _, end, duration = clip_range(reel)
            if float(source_info["format"]["duration"]) + 0.001 < end:
                raise ValueError("В исходнике не хватает хвоста для точного реза: " + ident)
            reel_notes = []
            layout = make_overlay(reel, work, bold, Image, ImageDraw, ImageFont, reel_notes)
            captions = make_ass(reel, groups[ident], work / "captions.ass", subtitle_font,
                                ass_name, ass_bold, reel_notes)
            write_json(work / "layout.json", {"hook": layout, "captions": captions})
            notes.extend("{}: {}".format(ident, note) for note in reel_notes)
            measurement = measure_audio(ffmpeg, reel, work)
            output = local_path(SETTINGS["output"]) / "reel_{}_{}.mp4".format(ident, reel["slug"])
            temporary = render(ffmpeg, reel, work, measurement)
            info = check_output(ffprobe, temporary, duration)
            write_json(work / "ffprobe.json", info)
            preview = local_path(SETTINGS["output"]) / "preview_{}.jpg".format(ident)
            times = make_preview(ffmpeg, temporary, float(info["format"]["duration"]), preview, Image)
            temporary.replace(output)
            results[ident] = {"probe": info, "preview_times": times,
                              "source_size": [video["width"], video["height"]]}
            write_report(reels, results, notes, "ЭКСПОРТ {}/5".format(len(results)), version=version)
            print("[{}] Готово: {}".format(ident, output.name), flush=True)
        write_report(reels, results, notes, "ГОТОВО: 5 MP4 И 5 JPG, ПАРАМЕТРЫ ПРОВЕРЕНЫ", version=version)
        return 0
    except (OSError, ValueError, RuntimeError, KeyError, StopIteration) as exc:
        write_report(reels, results, notes, "НЕ ЗАВЕРШЕНО", error=exc, version=version)
        print("Экспорт остановлен: {}".format(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    # В системной ASCII locale всё равно пишем сообщения и файлы в UTF-8.
    for stream_name in ("stdout", "stderr"):
        stream = getattr(sys, stream_name)
        if hasattr(stream, "buffer") and (stream.encoding or "").lower() not in ("utf-8", "utf8"):
            setattr(sys, stream_name, io.TextIOWrapper(stream.buffer, encoding="utf-8", line_buffering=True))
    sys.exit(main())
