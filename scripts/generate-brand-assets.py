"""Draw original TWO SIDES geometric launcher art. Requires Pillow; no source art is modified."""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'brand'
OUT.mkdir(exist_ok=True)
SCALE = 3
NAVY = '#101D29'
BRASS = '#D5B170'
IVORY = '#F1E6CF'
BURGUNDY = '#813D4D'


def mark(size, transparent=False, monochrome=False):
    canvas = Image.new('RGBA', (1024 * SCALE, 1024 * SCALE), (0, 0, 0, 0) if transparent else NAVY)
    draw = ImageDraw.Draw(canvas)

    def polygon(points, fill, outline=None, width=1):
        points = [(int(x * SCALE), int(y * SCALE)) for x, y in points]
        draw.polygon(points, fill=fill)
        if outline:
            draw.line(points + [points[0]], fill=outline, width=width * SCALE, joint='curve')

    def line(points, fill, width):
        draw.line([(int(x * SCALE), int(y * SCALE)) for x, y in points], fill=fill, width=width * SCALE, joint='curve')

    gold = '#FFFFFF' if monochrome else BRASS
    paper = '#FFFFFF' if monochrome else IVORY
    wine = '#FFFFFF' if monochrome else BURGUNDY
    # A hotel brass escutcheon enclosing two separate evidence leaves, divided by a slash.
    line([(512, 184), (840, 512), (512, 840), (184, 512), (512, 184)], gold, 5)
    line([(512, 216), (808, 512), (512, 808), (216, 512), (512, 216)], gold, 2)
    polygon([(322, 347), (478, 319), (478, 653), (322, 681)], paper)
    polygon([(546, 371), (702, 343), (702, 677), (546, 705)], wine, gold, 4)
    if not monochrome:
        # Printed rules remain abstract at small sizes: no clues or readable text.
        for y in (409, 445, 481):
            line([(351, y), (448, y - 17)], '#7A684D', 5)
        for y in (438, 474, 510):
            line([(576, y), (672, y - 17)], BRASS, 5)
        polygon([(400, 538), (432, 570), (400, 602), (368, 570)], BURGUNDY)
        polygon([(624, 568), (656, 600), (624, 632), (592, 600)], BRASS)
    line([(530, 311), (498, 710)], gold, 10)
    for x, y in [(512, 184), (840, 512), (512, 840), (184, 512)]:
        polygon([(x, y-10), (x+10, y), (x, y+10), (x-10, y)], gold)
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


mark(1024).convert('RGB').save(OUT / 'icon.png', optimize=True)
mark(1024, transparent=True).save(OUT / 'adaptive-foreground.png', optimize=True)
mark(1024, transparent=True, monochrome=True).save(OUT / 'monochrome.png', optimize=True)
mark(512, transparent=True).save(OUT / 'splash-mark.png', optimize=True)
mark(64).convert('RGB').save(OUT / 'favicon.png', optimize=True)
print('Wrote five original brand assets to assets/brand.')
