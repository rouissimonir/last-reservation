"""Export sizes from the preserved ImageGen artwork; no generative edits.

Run from the app root with Python and Pillow. Original artwork stays in source/.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "assets/brand/v2"
RESAMPLE = Image.Resampling.LANCZOS


def mark_export(source: Image.Image, name: str, extent: int) -> None:
    mark = source.crop(source.getchannel("A").getbbox())
    mark.thumbnail((extent, extent), RESAMPLE)
    canvas = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    canvas.alpha_composite(mark, ((1024 - mark.width) // 2, (1024 - mark.height) // 2))
    canvas.save(BRAND / name, optimize=True)


with Image.open(BRAND / "source/keyhole-master.png") as source:
    icon = source.convert("RGB").resize((1024, 1024), RESAMPLE)
    icon.save(BRAND / "icon.png", optimize=True)
    icon.resize((64, 64), RESAMPLE).save(BRAND / "favicon.png", optimize=True)

with Image.open(BRAND / "source/keyhole-cutout.png") as source:
    mark_export(source, "splash-mark.png", 820)
    # Keep the complete emblem inside the adaptive icon's central safe region.
    mark_export(source, "adaptive-foreground.png", 510)

with Image.open(BRAND / "adaptive-foreground.png") as source:
    monochrome = Image.new("RGBA", source.size, "white")
    monochrome.putalpha(source.getchannel("A"))
    monochrome.save(BRAND / "monochrome.png", optimize=True)

for name in ("icon", "favicon", "splash-mark", "adaptive-foreground", "monochrome"):
    with Image.open(BRAND / f"{name}.png") as result:
        assert result.format == "PNG"
        assert result.size == ((64, 64) if name == "favicon" else (1024, 1024))
        assert result.mode == ("RGB" if name in ("icon", "favicon") else "RGBA")
        if result.mode == "RGBA":
            assert result.getchannel("A").getextrema() == (0, 255)
        print(f"{name}.png: {result.width} x {result.height}, {result.mode}")
