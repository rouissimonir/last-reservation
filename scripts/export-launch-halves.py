"""Split the keyhole emblem along its central seam for the launch animation.

Run from the app root with Python and Pillow. Pure crop and resize of the existing
splash export; no generative edits. Both halves keep the full square canvas so they
stack back into the complete emblem exactly.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "assets/brand/v2"
OUT = BRAND / "launch"
SEAM = 518  # x of the dark gap between the two leaves on the 1024px splash mark
SIZE = 600

OUT.mkdir(exist_ok=True)
with Image.open(BRAND / "splash-mark.png") as source:
    mark = source.convert("RGBA")
    for name, box in (("left.png", (0, 0, SEAM, 1024)), ("right.png", (SEAM, 0, 1024, 1024))):
        half = Image.new("RGBA", mark.size, (0, 0, 0, 0))
        half.paste(mark.crop(box), box[:2])
        half.resize((SIZE, SIZE), Image.Resampling.LANCZOS).save(OUT / name, optimize=True)
