"""Frame real web captures for layout review. These are NOT iOS screenshots.

Run from the app root with Python + Pillow. No UI is fabricated or retouched.
Native captures must replace these sources before App Store submission.
"""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "store/ios/screenshots-drafts"
SIZE = (1320, 2868)
NAVY = "#0c1822"
IVORY = "#f3e7ce"
BRASS = "#d3b46c"
FONT_DIR = Path("C:/Windows/Fonts")
SCENES = [
    ("01-cover", "Two players.\nOne shared phone.", "A mystery made for the two of you.", "THE LAST RESERVATION"),
    ("02-evidence", "Your clues are\nhalf the story.", "Read privately. Compare what you know.", "TWO PERSPECTIVES · ONE MYSTERY"),
    ("03-handoff", "Pass the phone.\nSolve it together.", "A different perspective is one handoff away.", "SHARE THE DISCOVERY"),
    ("04-hint", "A nudge.\nWhen you need it.", "Optional hints. No timer. Play at your pace.", "HINTS INCLUDED"),
    ("05-library", "Five mysteries.\nFree to play together.", "Start with The Last Reservation.", "THE BELLWEATHER FILES"),
]


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_DIR / name), size)


def centered(draw: ImageDraw.ImageDraw, y: int, text: str, face, fill=IVORY) -> None:
    draw.text((SIZE[0] // 2, y), text, anchor="mt", font=face, fill=fill)


def fitted(text: str, name: str, maximum: int, width: int):
    size = maximum
    while font(name, size).getlength(text) > width:
        size -= 1
    return font(name, size)


OUT.joinpath("en-US").mkdir(parents=True, exist_ok=True)
background = Image.open(ROOT / "assets/art/optimized/hotel-desk-background.jpg").convert("RGB")
background = ImageOps.fit(background, SIZE).filter(ImageFilter.GaussianBlur(4)).convert("RGBA")
background = Image.alpha_composite(background, Image.new("RGBA", SIZE, (8, 19, 29, 211)))
emblem = Image.open(ROOT / "assets/brand/v2/splash-mark.png").convert("RGBA")
emblem.thumbnail((160, 160), Image.Resampling.LANCZOS)
records = []

for index, (slug, title, description, label) in enumerate(SCENES, 1):
    canvas = background.copy()
    draw = ImageDraw.Draw(canvas)
    # Restrained Art Deco frame; real interface pixels remain untouched.
    draw.line((70, 70, 400, 70), fill=BRASS, width=2)
    draw.line((920, 70, 1250, 70), fill=BRASS, width=2)
    canvas.alpha_composite(emblem, ((SIZE[0] - emblem.width) // 2, 85))
    centered(draw, 275, "TWO / SIDES", font("seguisb.ttf", 54), BRASS)
    centered(draw, 365, label, fitted(label, "seguisb.ttf", 30, 1120), BRASS)
    lines = title.split("\n")
    title_size = min(fitted(line, "georgiab.ttf", 116, 1170).size for line in lines)
    for row, line in enumerate(lines):
        centered(draw, 445 + row * 145, line, font("georgiab.ttf", title_size))
    centered(draw, 765, description, fitted(description, "segoeui.ttf", 40, 1160))

    raw_path = OUT / "raw" / f"{slug}.jpg"
    screen = Image.open(raw_path).convert("RGB")
    # Fit without cropping, stretching, changing UI or adding a fake status bar.
    scale = min(980 / screen.width, 1810 / screen.height)
    screen = screen.resize((round(screen.width * scale), round(screen.height * scale)), Image.Resampling.LANCZOS)
    left, top = (SIZE[0] - screen.width) // 2, 920
    outer = (left - 22, top - 22, left + screen.width + 22, top + screen.height + 22)
    shadow = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((outer[0] - 10, outer[1] + 20, outer[2] + 10, outer[3] + 38), radius=58, fill=(0, 0, 0, 185))
    canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(26)))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle(outer, radius=48, fill="#070c11", outline=BRASS, width=3)
    canvas.paste(screen, (left, top))
    centered(draw, 2785, "LAYOUT DRAFT · REAL WEB CAPTURE · NATIVE CAPTURE PENDING", font("seguisb.ttf", 24), BRASS)
    output = OUT / "en-US" / f"{slug}-DRAFT.png"
    canvas.convert("RGB").save(output, optimize=True)
    with Image.open(output) as exported:
        assert exported.size == SIZE and exported.mode == "RGB" and exported.format == "PNG"
    records.append({
        "order": index, "file": str(output.relative_to(OUT)).replace("\\", "/"),
        "source": f"raw/{slug}.jpg", "source_sha256": hashlib.sha256(raw_path.read_bytes()).hexdigest(),
        "output_sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
        "source_pixels": list(Image.open(raw_path).size), "output_pixels": list(SIZE),
        "headline": title.replace("\n", " "),
        "native_capture_verified": False, "submission_ready": False,
    })
    print(output.relative_to(ROOT))

manifest = {
    "date": "2026-10-19", "app_name": "TWO SIDES: Co-op Mystery",
    "source_type": "real Expo production web UI, browser capture; NOT native iOS",
    "source_origin": "http://127.0.0.1:8105/", "requested_viewport_css": [440, 956],
    "capture_note": "Full-page browser capture preserves the complete 440x956 fixed app viewport. No UI retouching.",
    "capture_build": "production web export from Apple identity checkpoint 1aebd9b; no gameplay changes in this assets checkpoint",
    "native_capture_verified": False, "submission_ready": False, "screenshots": records,
}
(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

sheet = Image.new("RGB", (1650, 760), NAVY)
for i, record in enumerate(records):
    with Image.open(OUT / record["file"]) as shot:
        shot.thumbnail((310, 674), Image.Resampling.LANCZOS)
        sheet.paste(shot, (10 + i * 330, 24))
sheet_draw = ImageDraw.Draw(sheet)
sheet_draw.text((825, 726), "DESIGN REVIEW · WEB CAPTURES · REPLACE WITH VERIFIED IPHONE CAPTURES BEFORE UPLOAD", anchor="mm", font=font("seguisb.ttf", 22), fill=BRASS)
sheet.save(OUT / "contact-sheet.jpg", quality=92)
