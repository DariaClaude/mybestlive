# Перенос подписи из одного PDF в другой

Инструкция для переноса рукописной подписи между документами без графического редактора — только Python.

---

## Требования

```bash
pip3 install pymupdf pillow
```

---

## Алгоритм

### 1. Найти координаты подписи в исходном документе

Рендерим нужную страницу в высоком разрешении и смотрим полосами, где находится подпись:

```python
import fitz
from PIL import Image

doc = fitz.open("исходный_документ.pdf")
page = doc[НОМЕР_СТРАНИЦЫ]  # начинается с 0

mat = fitz.Matrix(2.0, 2.0)  # 2x для чёткости
pix = page.get_pixmap(matrix=mat)
pix.save("/tmp/page_hires.png")

print(f"PDF размер: {page.rect.width} x {page.rect.height}")
print(f"Пиксельный размер: {pix.width} x {pix.height}")
doc.close()
```

Открой `/tmp/page_hires.png` и визуально определи, в каком районе подпись.
Для поиска — нарезай страницу горизонтальными полосами по 800px:

```python
img = Image.open("/tmp/page_hires.png")
w, h = img.size
for y in range(0, h, 800):
    img.crop((0, y, w, min(y+800, h))).save(f"/tmp/strip_{y}.png")
```

### 2. Перевести пиксельные координаты в PDF-координаты

При рендеринге с Matrix(2, 2) — делим пиксели на 2:

```
x_pdf = x_pixel / 2
y_pdf = y_pixel / 2
```

### 3. Найти целевое место в документе назначения

Аналогично — рендерим целевой документ и находим строку, куда нужна подпись:

```python
ks = fitz.open("целевой_документ.pdf")
ks_page = ks[0]
mat = fitz.Matrix(2.0, 2.0)
pix = ks_page.get_pixmap(matrix=mat)
pix.save("/tmp/target_hires.png")
ks.close()
```

### 4. Полный скрипт переноса (с текстовыми полями)

> **Важно:** `fitz.insert_textbox` не рендерит кириллицу корректно (показывает «????»).
> Для текста на русском — создавай PNG через PIL и вставляй как изображение.

```python
import fitz
from PIL import Image, ImageDraw, ImageFont
import io

FONT_PATH = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
SCALE = 3  # масштаб для качества

def text_png(text, w_pt, h_pt, fs_pt, align="center"):
    """Создаёт прозрачный PNG с текстом — работает для кириллицы."""
    W, H = int(w_pt * SCALE), int(h_pt * SCALE)
    img  = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    fnt  = ImageFont.truetype(FONT_PATH, int(fs_pt * SCALE))
    bb   = draw.textbbox((0, 0), text, font=fnt)
    tw   = bb[2] - bb[0]
    x    = (W - tw) // 2 if align == "center" else 4
    draw.text((x, (H - (bb[3] - bb[1])) // 2), text, font=fnt, fill=(0, 0, 0, 255))
    buf  = io.BytesIO(); img.save(buf, "PNG"); buf.seek(0); return buf

# === Источник подписи ===
act      = fitz.open("исходный_документ.pdf")
act_page = act[НОМЕР_СТРАНИЦЫ]

sig_rect_src = fitz.Rect(X0, Y0, X1, Y1)
clip    = act_page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), clip=sig_rect_src)
sig_img = Image.frombytes("RGB", [clip.width, clip.height], clip.samples)

# === Убрать белый фон ===
sig_rgba = sig_img.convert("RGBA")
sig_rgba.putdata([
    (255, 255, 255, 0) if r > 215 and g > 215 and b > 215 else (r, g, b, 255)
    for r, g, b, a in sig_rgba.getdata()
])
sig_buf = io.BytesIO(); sig_rgba.save(sig_buf, "PNG"); sig_buf.seek(0)
act.close()

# === Вставить в целевой документ ===
ks = fitz.open("целевой_документ.pdf")
pg = ks[0]

# Текстовое поле (ФИО или дата) — через PNG
pg.insert_image(fitz.Rect(X_name0, Y0, X_name1, Y1),
                stream=text_png("Текст", ширина_pt, высота_pt, размер_шрифта, "center").read(),
                keep_proportion=False)

# Подпись — растровая вставка
pg.insert_image(fitz.Rect(X_sig0, Y0, X_sig1, Y1),
                stream=sig_buf.read(), keep_proportion=True)

ks.save("целевой_документ_подписан.pdf")
ks.close()
print("Готово")
```

---

## Параметры, которые нужно подбирать

| Параметр | Где взять |
|---|---|
| Номер страницы источника | Смотреть визуально (нумерация с 0) |
| `sig_rect_src` | Из анализа полос; пиксели ÷ 2 при Matrix(2,2) |
| `target_rect` | Аналогично для целевого документа |
| Порог белого (`> 215`) | Повышать если фон не убирается, снижать если теряются тонкие линии |
| Размер шрифта для текста | ~22pt при стандартном масштабе карточки сотрудника |

### Как точно найти x-координаты полей

Рендерим страницу в 1:1 с вертикальной сеткой в нужной зоне:

```python
import fitz
from PIL import Image, ImageDraw

doc  = fitz.open("целевой.pdf")
pix  = doc[0].get_pixmap(matrix=fitz.Matrix(1.0, 1.0))
img  = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
draw = ImageDraw.Draw(img)
for x in range(0, img.width, 25):
    draw.line([(x, Y_start), (x, Y_end)], fill=(255, 0, 0), width=1)
    if x % 100 == 0:
        draw.text((x + 2, Y_start), str(x), fill=(255, 0, 0))
img.crop((0, Y_start - 20, img.width, Y_end + 20)).save("/tmp/x_measure.png")
doc.close()
```

---

## Пример из практики (1КС ПРИЁМ Панова 29.04.2026)

- **Источник подписи:** `Приложение Nº 1.pdf`, страница index 1
  - Размер страницы: `1856 × 2622 pt`
  - **Координаты подписи:** `fitz.Rect(930, 1800, 1160, 1895)`

- **Целевой документ:** `1КС ПРИЁМ Панова Анастасия Александровна 29.04.26.pdf`, страница 0
  - Размер страницы: `1486 × 2145 pt`
  - Строка «Непосредственный руководитель» — y ≈ 1582–1658

| Поле | Координаты | Содержимое |
|---|---|---|
| ФИО (поле 1) | `fitz.Rect(490, 1592, 770, 1645)` | «Вишневская Д.А.», 22pt, center |
| Подпись (поле 2) | `fitz.Rect(785, 1582, 1045, 1658)` | PNG подписи, keep_proportion=True |
| Дата | `fitz.Rect(1185, 1596, 1450, 1645)` | «29.04.2026», 21pt, left |

**Ориентиры по x для строки «Непосредственный руководитель»:**
- Метка заканчивается на x ≈ 480
- Разделитель `/` на x ≈ 780
- `/дата` заканчивается на x ≈ 1180
