"""Export smaller game copies of generated cover art without changing its contents or alpha."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'assets' / 'art' / 'covers'
out = root / 'optimized'
out.mkdir(exist_ok=True)
for source in sorted(root.glob('*.png')):
    image = Image.open(source)
    if image.mode != 'RGBA' or image.getchannel('A').getextrema() != (0, 255):
        raise ValueError(f'{source.name}: expected genuine transparent RGBA source')
    image.thumbnail((640, 640), Image.Resampling.LANCZOS)
    target = out / source.name
    image.save(target, optimize=True)
    print(f'{source.name}: {image.width}x{image.height}, RGBA, {target.stat().st_size} bytes')
