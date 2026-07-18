import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = r"e:\TrustHerBro\public\images\vn-decor-sheet.png"
OUT = r"e:\TrustHerBro\public\images\vn-decor"
os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGB")
arr = np.asarray(im).astype(np.int16)

# Sample corners for paper/white background
corners = np.concatenate(
    [
        arr[0:30, 0:30].reshape(-1, 3),
        arr[0:30, -30:].reshape(-1, 3),
        arr[-30:, 0:30].reshape(-1, 3),
        arr[-30:, -30:].reshape(-1, 3),
    ]
)
bg = np.median(corners, axis=0)
print("bg", bg)

dist = np.sqrt(((arr - bg) ** 2).sum(axis=2))
mask = dist > 22

mask = ndimage.binary_opening(mask, iterations=1)
mask = ndimage.binary_closing(mask, iterations=4)
mask = ndimage.binary_fill_holes(mask)

lbl, n = ndimage.label(mask)
print("raw components", n)
slices = ndimage.find_objects(lbl)

idx = 0
for i, sl in enumerate(slices, start=1):
    ys, xs = sl
    h = ys.stop - ys.start
    w = xs.stop - xs.start
    comp = lbl[sl] == i
    area = int(comp.sum())
    if area < 2500 or h < 40 or w < 40:
        continue
    idx += 1
    crop = np.asarray(im)[sl]
    alpha = (comp * 255).astype(np.uint8)
    rgba = np.dstack([crop, alpha])
    out = Image.fromarray(rgba, "RGBA")
    a = out.split()[3].filter(ImageFilter.GaussianBlur(0.6))
    out.putalpha(a)
    fname = f"piece-{idx:02d}.png"
    out.save(os.path.join(OUT, fname))
    print(fname, "x", xs.start, "y", ys.start, "w", w, "h", h, "area", area)

print("saved", idx, "pieces")
