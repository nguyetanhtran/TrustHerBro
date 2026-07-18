import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = r"e:\TrustHerBro\public\images\font.png"
OUT = r"e:\TrustHerBro\public\images\font"
os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGBA")
rgb = np.asarray(im)[:, :, :3].astype(np.int16)
H, W, _ = rgb.shape

# Background = median of the four corners (cream paper)
corners = np.concatenate([
    rgb[0:40, 0:40].reshape(-1, 3),
    rgb[0:40, -40:].reshape(-1, 3),
    rgb[-40:, 0:40].reshape(-1, 3),
    rgb[-40:, -40:].reshape(-1, 3),
])
bg = np.median(corners, axis=0)
print("bg", bg)

dist = np.sqrt(((rgb - bg) ** 2).sum(axis=2))
mask = dist > 42  # foreground glyph pixels (ignores soft shadow)

mask = ndimage.binary_opening(mask, iterations=1)
mask = ndimage.binary_closing(mask, iterations=2)

lbl, n = ndimage.label(mask)
print("raw components", n)
slices = ndimage.find_objects(lbl)

comps = []
for i, sl in enumerate(slices, start=1):
    ys, xs = sl
    h = ys.stop - ys.start
    w = xs.stop - xs.start
    area = int((lbl[sl] == i).sum())
    if area < 900 or h < 40:
        continue
    yc = (ys.start + ys.stop) / 2
    comps.append({"i": i, "sl": sl, "x0": xs.start, "yc": yc, "w": w, "h": h, "area": area})

print("kept components", len(comps))

# Cluster into rows by y-center
comps.sort(key=lambda c: c["yc"])
rows = []
cur = [comps[0]]
for c in comps[1:]:
    if c["yc"] - cur[-1]["yc"] > 150:
        rows.append(cur)
        cur = [c]
    else:
        cur.append(c)
rows.append(cur)
for r in rows:
    r.sort(key=lambda c: c["x0"])
print("rows sizes", [len(r) for r in rows])

EXPECTED = ["ABCDEFGHIJKLM", "NOPQRSTUVWXYZ", "0123456789"]

def name_for(ch):
    return ch if ch.isalpha() else f"d{ch}"

saved = []
for ri, row in enumerate(rows):
    if ri >= len(EXPECTED):
        break
    chars = EXPECTED[ri]
    for ci, c in enumerate(row):
        if ci >= len(chars):
            break
        ch = chars[ci]
        sl = c["sl"]
        comp_mask = (lbl[sl] == c["i"]).astype(np.uint8) * 255
        crop_rgb = np.asarray(im)[sl][:, :, :3]
        rgba = np.dstack([crop_rgb, comp_mask])
        out = Image.fromarray(rgba, "RGBA")
        a = out.split()[3].filter(ImageFilter.GaussianBlur(0.5))
        out.putalpha(a)
        fname = f"{name_for(ch)}.png"
        out.save(os.path.join(OUT, fname))
        saved.append((ch, c["w"], c["h"]))

print("saved", len(saved))
for ch, w, h in saved:
    print(ch, w, h)
