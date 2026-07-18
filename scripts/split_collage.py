import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = r"C:\Users\Admin\.cursor\projects\e-TrustHerBro\assets\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_59ead076433173b6bf6f474628f561bd_images_image-ab16c422-8cb7-413e-a360-e1401e01f75b.png"
OUT = r"e:\TrustHerBro\public\images\collage"
os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGB")
arr = np.asarray(im).astype(np.int16)
H, W, _ = arr.shape

# Sample paper background from an empty region on the right side
patch = arr[120:420, 440:560].reshape(-1, 3)
bg = np.median(patch, axis=0)
print("bg color", bg)

dist = np.sqrt(((arr - bg) ** 2).sum(axis=2))
mask = dist > 32

# Clean up mask
mask = ndimage.binary_opening(mask, iterations=1)
mask = ndimage.binary_closing(mask, iterations=4)
mask = ndimage.binary_fill_holes(mask)

lbl, n = ndimage.label(mask)
print("raw components", n)
slices = ndimage.find_objects(lbl)

idx = 0
manifest = []
for i, sl in enumerate(slices, start=1):
    ys, xs = sl
    h = ys.stop - ys.start
    w = xs.stop - xs.start
    comp = lbl[sl] == i
    area = int(comp.sum())
    if area < 2200 or h < 30 or w < 30:
        continue
    idx += 1
    crop = np.asarray(im)[sl]
    alpha = (comp * 255).astype(np.uint8)
    rgba = np.dstack([crop, alpha])
    out = Image.fromarray(rgba, "RGBA")
    a = out.split()[3].filter(ImageFilter.GaussianBlur(0.7))
    out.putalpha(a)
    fname = f"piece-{idx:02d}.png"
    out.save(os.path.join(OUT, fname))
    manifest.append((fname, xs.start, ys.start, w, h, area))
    print(fname, "x", xs.start, "y", ys.start, "w", w, "h", h, "area", area)

print("saved", idx, "pieces")
