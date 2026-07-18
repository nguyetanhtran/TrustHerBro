import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = r"e:\TrustHerBro\public\images\dongson-sheet.png"
OUT = r"e:\TrustHerBro\public\images\dongson"
os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGB")
arr = np.asarray(im).astype(np.int16)
H, W, _ = arr.shape

# White paper background
bg = np.array([255, 255, 255], dtype=np.float64)
dist = np.sqrt(((arr.astype(np.float64) - bg) ** 2).sum(axis=2))
# Red motifs are dark relative to white
mask = dist > 28

mask = ndimage.binary_opening(mask, iterations=1)
mask = ndimage.binary_closing(mask, iterations=2)
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
    if area < 180 or h < 12 or w < 12:
        continue
    idx += 1
    crop = np.asarray(im)[sl]
    # Keep red pixels; make near-white transparent
    alpha = np.where(comp, 255, 0).astype(np.uint8)
    # Soften edges slightly
    rgba = np.dstack([crop, alpha])
    out = Image.fromarray(rgba, "RGBA")
    a = out.split()[3].filter(ImageFilter.GaussianBlur(0.4))
    out.putalpha(a)
    fname = f"motif-{idx:02d}.png"
    out.save(os.path.join(OUT, fname))
    print(fname, "w", w, "h", h, "area", area)

print("saved", idx, "pieces")
