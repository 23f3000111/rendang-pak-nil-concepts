#!/usr/bin/env python3
"""Rendang Pak Nil asset pipeline: the client's material -> optimised web assets in both concept folders.

Run from the project root:  python -I tools/assets.py [section ...]
Sections (default: all): packs logo people photos stock stills spices video

Inputs (kept out of git): source-assets/website (rendangpaknil.com media library), source-assets/instagram,
source-assets/facebook (their public posts and reels) and source-assets/stock (Unsplash, see CREDITS.md).
Outputs: <site>/assets/img/... and <site>/assets/video/... (same relative paths in both concepts).
Background removal uses rembg (birefnet-general-lite); cut-outs are cached in tools/.cache.
"""
import site
import subprocess
import sys
from pathlib import Path

site.addsitedir(site.getusersitepackages())  # Pillow, NumPy and rembg live in the user site-packages
import numpy as np  # noqa: E402
from PIL import Image, ImageDraw, ImageFilter  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'source-assets'
WEB, IG, FB, STOCK = SRC / 'website', SRC / 'instagram', SRC / 'facebook', SRC / 'stock'
CACHE = ROOT / 'tools' / '.cache'
SITE_A = ROOT / 'site-a-citarasa-istana'
SITE_B = ROOT / 'site-b-ingat-rendang'
BOTH = [SITE_A, SITE_B]
CACHE.mkdir(parents=True, exist_ok=True)

PACKS = {  # product id: transparent pack render from the website media library (1707 x 2560)
    'minang': 'daging-ayam-scaled.png', 'dendeng': 'dendeng-scaled.png', 'daging': 'rendang-daging-scaled.png',
    'ayam': 'rendang-ayam-scaled.png', 'paru': 'rendang-paru-scaled.png', 'ayam-special': 'ayam-special-scaled.png',
    'sambal': 'sambal-scaled.png', 'laksa': 'laksa-johor-scaled.png', 'kacang': 'kuah-kacang-scaled.png',
}
WARISAN = {  # the new Warisan x PakNil pouches (October 2026 mockups)
    'warisan-minang-480': 'Mockup-Minang-Full-480-g-scaled.png', 'warisan-minang-980': 'Mockup-Minang-Full-980-g-scaled.png',
    'warisan-dendeng-480': 'Mockup-Dendeng-Full-480-g-scaled.png', 'warisan-dendeng-980': 'Mockup-Dendeng-Full-980-g-scaled.png',
    'warisan-ayam-980': 'Mockup-Ayam-Full-980-g-scaled.png',
}
PHOTOS = {  # out name: (source path, max width)
    'rendang-bowl': (IG / 'DY8vBAwifO7-0.jpg', 1500),
    'minang-spices-ig': (IG / 'DY8vBAwifO7-1.jpg', 928),
    'minang-spices': (WEB / 'Rendang-Minang-PN-e1779420924829.png', 806),
    'dendeng-spices': (WEB / 'Rendang-Dendeng-Perak-e1779420892544.png', 730),
    'minang-studio': (WEB / 'product-rendang-minang-paknil.jpeg', 1100),
    'range-table': (WEB / 'banner1.jpg', 1344),
    'range-paknil': (WEB / 'banner2.jpg', 1344),
    'paknil-range': (WEB / 'banner4.jpg', 1344),
    'paknil-banner': (WEB / 'banner5.jpg', 1344),
    'key-visual': (WEB / 'rendang-minang-pak-nil.jpeg', 1200),
    'rendang-daging': (WEB / 'pexels-wahyu-prabowo-2158742291-37080534-scaled.jpg', 1600),
    'rendang-plating': (WEB / 'rendang-plating01.jpg', 500),
    'rendang-pot': (WEB / 'rendang-writeup-01.jpg', 500),
    'mihas-standee': (FB / 'photo-1125483223342946.jpg', 1200),
    'mihas-totes': (FB / 'photo-1125507163340552.jpg', 1200),
    'mihas-signing': (FB / 'photo-1125507176673884.jpg', 1200),
    'mihas-visitors': (FB / 'photo-1125507230007212.jpg', 1200),
    'mihas-talk': (FB / 'photo-1128759413015327.jpg', 1600),
    'mihas-talk-products': (FB / 'photo-1128759953015273.jpg', 1600),
    'mihas-selfie': (FB / 'photo-1128759689681966.jpg', 1600),
    'mihas-audience': (FB / 'photo-1128759706348631.jpg', 1600),
    'mihas-crowd': (FB / 'photo-1128759749681960.jpg', 1600),
    'mihas-booth': (FB / 'photo-28581392754852245.jpg', 1200),
    'mihas-booth-guests': (FB / 'photo-28581393354852185.jpg', 1600),
    'mihas-booth-team': (FB / 'photo-28581393621518825.jpg', 1600),
    'mihas-booth-visit': (FB / 'photo-28581393924852128.jpg', 1600),
}
STOCK_PHOTOS = {  # out name: (file in source-assets/stock, max width) -- Unsplash licence, credited in CREDITS.md
    'chicken-rendang': ('chicken-pan.jpg', 1400), 'beef-rendang': ('rendang-a.jpg', 1400),
    'dendeng-plate': ('rendang-b.jpg', 1400), 'sambal-bowl': ('sambal-d.jpg', 1400),
    'satay-kuah-kacang': ('satay-b.jpg', 1400), 'ketupat-hanging': ('ketupat-a.jpg', 1400),
    'ketupat-bunch': ('ketupat-b.jpg', 1400), 'ketupat-tree': ('ketupat-c.jpg', 1400),
    'nasi-rendang-leaf': ('padang-a.jpg', 1400), 'nasi-rendang-leaf-2': ('padang-b.jpg', 1400),
    'rendang-wok': ('rendang-pan.jpg', 1400), 'banana-leaves': ('banana-leaves.jpg', 1400),
}
STILLS = {  # out name: (reel, second, width) -- frames from their own reels
    'heat-thaw': (FB / 'reel-1651216825999312.mp4', 4.1, 576), 'heat-pour': (FB / 'reel-1651216825999312.mp4', 6.9, 576),
    'heat-wok': (FB / 'reel-1651216825999312.mp4', 9.65, 576), 'heat-garnish': (FB / 'reel-1651216825999312.mp4', 12.4, 576),
    'heat-bowl': (FB / 'reel-1651216825999312.mp4', 17.9, 576),
    'make-paste': (FB / 'reel-27465424216397087.mp4', 1.4, 1080), 'make-chillies': (FB / 'reel-27465424216397087.mp4', 4.3, 1080),
    'make-rendang': (FB / 'reel-27465424216397087.mp4', 7.2, 1080), 'make-grind': (FB / 'reel-27465424216397087.mp4', 10.1, 1080),
    'make-kawah': (FB / 'reel-27465424216397087.mp4', 13.0, 1080), 'make-seal': (FB / 'reel-27465424216397087.mp4', 15.9, 1080),
    'make-pack': (FB / 'reel-27465424216397087.mp4', 18.8, 1080), 'make-brass': (FB / 'reel-27465424216397087.mp4', 21.7, 1080),
    'paknil-brass': (FB / 'reel-1318940656836588.mp4', 3.0, 1080), 'paknil-table': (FB / 'reel-1318940656836588.mp4', 21.0, 1080),
    'paknil-eating': (FB / 'reel-1318940656836588.mp4', 39.0, 1080), 'paknil-packs': (FB / 'reel-1318940656836588.mp4', 45.0, 1080),
    'kuah-kacang-bowl': (FB / 'reel-1301769958827393.mp4', 2.85, 1080),
    'spread-bowls': (IG / 'DYwJZ_aJsPx.mp4', 10.0, 720), 'spread-table': (IG / 'DYwJZ_aJsPx.mp4', 6.4, 720),
    'camping-night': (FB / 'reel-27281006164867908.mp4', 1.0, 1080), 'camping-river': (FB / 'reel-1572097864531524.mp4', 20.0, 1080),
    'bekal': (IG / 'DZZFiCzJlpf.mp4', 14.5, 720), 'busy-mum': (IG / 'DZTuS4yJi7q.mp4', 25.0, 720),
    'paknil-wok': (IG / 'DYyzKm-pQ64.mp4', 2.0, 720), 'paknil-plate': (IG / 'DYyzKm-pQ64.mp4', 6.0, 720),
    'menu-paru': (FB / 'reel-853988221090423.mp4', 0.4, 1080), 'menu-dish': (FB / 'reel-853988221090423.mp4', 30.2, 1080),
}
SPICES = {  # sprite: (stock file, crop box as fractions or None) -- for Concept B's falling-spice toy
    'chilli': ('chili-white.jpg', None), 'chilli-half': ('chili-white2.jpg', None),
    'anise': ('anise-white2.jpg', (0.30, 0.25, 0.80, 0.95)), 'cinnamon': ('cinnamon-white.jpg', None),
    'garlic': ('garlic-white.jpg', None), 'leaf': ('limeleaf-white.jpg', None),
    'coconut': ('coconut-white.jpg', (0.315, 0.43, 0.645, 0.68)),
}
REELS = {  # out name: (source, start, duration or None) -- encoded with sound for the lightbox
    'reel-heat': (FB / 'reel-1651216825999312.mp4', None, None),
    'reel-make': (FB / 'reel-27465424216397087.mp4', None, None),
    'reel-menu': (FB / 'reel-853988221090423.mp4', None, None),
    'reel-paknil': (FB / 'reel-1318940656836588.mp4', None, 32),
    'reel-raya': (FB / 'reel-1301769958827393.mp4', None, None),
    'reel-camping': (FB / 'reel-27281006164867908.mp4', None, 30),
    'reel-river': (FB / 'reel-1572097864531524.mp4', None, None),
    'reel-bekal': (IG / 'DZZFiCzJlpf.mp4', None, None),
    'reel-busy': (IG / 'DZTuS4yJi7q.mp4', None, None),
    'reel-beauty': (IG / 'DY6PtcIp98j.mp4', None, None),
    'reel-spread': (IG / 'DYwJZ_aJsPx.mp4', None, None),
    'reel-cook': (IG / 'DYyzKm-pQ64.mp4', None, None),
    'reel-mihas': (FB / 'reel-1117679544161452.mp4', None, None),
}
CLIPS = {  # per-product loops cut from the product-by-product reel (muted)
    'clip-laksa': (1.0, 2.5), 'clip-daging': (4.5, 2.1), 'clip-ayam': (7.9, 1.7), 'clip-minang': (11.0, 4.0),
    'clip-ayam-special': (16.5, 2.5), 'clip-sambal': (19.5, 2.0), 'clip-dendeng': (23.0, 2.2), 'clip-kacang': (31.0, 2.5),
    'clip-paru': (0.0, 1.1), 'clip-plate': (29.5, 1.8),
}
MENU_REEL = FB / 'reel-853988221090423.mp4'


# ------------------------------------------------------------------ helpers
def save(img, rel, sites=BOTH, quality=84):
    for s in sites:
        out = s / 'assets' / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        if rel.endswith('.webp'):
            img.save(out, 'WEBP', quality=quality, method=6)
        elif rel.endswith('.jpg'):
            img.convert('RGB').save(out, 'JPEG', quality=quality, optimize=True, progressive=True)
        else:
            img.save(out)
    print('  ', rel, img.size)


def rgba(path):
    im = Image.open(path)
    return im.convert('RGBA')


def trim(img, alpha_min=8):
    a = np.array(img.getchannel('A'))
    ys, xs = np.where(a > alpha_min)
    return img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def fit_h(img, h):
    return img.resize((round(img.width * h / img.height), h), Image.LANCZOS)


def fit_w(img, w):
    if img.width <= w:
        return img
    return img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)


def fit_box(img, n):
    s = n / max(img.size)
    return img if s >= 1 else img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)


CUT = ("import site, sys; site.addsitedir(site.getusersitepackages()); from PIL import Image; "
       "from rembg import remove, new_session; "
       "o = remove(Image.open(sys.argv[1]).convert('RGB'), session=new_session('birefnet-general-lite')); "
       "o.crop(o.getbbox()).save(sys.argv[2])")


def cutout(img, key):
    """Background removal (cached), one process per image (birefnet leaks memory between runs)."""
    cached = CACHE / f'{key}.png'
    if not cached.exists():
        tmp = CACHE / f'{key}-src.png'
        img.convert('RGB').save(tmp)
        subprocess.run([sys.executable, '-I', '-c', CUT, str(tmp), str(cached)], check=True, stderr=subprocess.DEVNULL)
        tmp.unlink()
    return Image.open(cached).convert('RGBA')


def crop_frac(img, box):
    if not box:
        return img
    w, h = img.size
    return img.crop((round(box[0] * w), round(box[1] * h), round(box[2] * w), round(box[3] * h)))


def grab(video, t, width):
    out = CACHE / f'grab-{video.stem}-{t}.png'
    if not out.exists():
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', str(video), '-frames:v', '1',
                        '-vf', f'scale={width}:-2', str(out)], check=True)
    return Image.open(out).convert('RGB')


def ffmpeg_video(source, rel, start=None, dur=None, audio=True, width=540, crf=28, poster_at=0.8, sites=BOTH):
    first = None
    for s in sites:
        out = s / 'assets' / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        if first is not None:  # encode once, copy to the other site
            out.write_bytes(first.read_bytes())
            out.with_suffix('.jpg').write_bytes(first.with_suffix('.jpg').read_bytes())
            continue
        args = ['ffmpeg', '-v', 'error', '-y']
        if start is not None:
            args += ['-ss', str(start)]
        args += ['-i', str(source)]
        if dur is not None:
            args += ['-t', str(dur)]
        args += ['-vf', f'scale={width}:-2', '-c:v', 'libx264', '-crf', str(crf), '-preset', 'slow',
                 '-pix_fmt', 'yuv420p', '-movflags', '+faststart']
        args += ['-c:a', 'aac', '-b:a', '96k'] if audio else ['-an']
        subprocess.run(args + [str(out)], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(poster_at), '-i', str(out), '-frames:v', '1',
                        '-q:v', '4', str(out.with_suffix('.jpg'))], check=True)
        first = out
    print('  ', rel, f'{first.stat().st_size // 1024} KB')


# ------------------------------------------------------------------ sections
def packs():
    print('packs')
    for pid, file in {**PACKS, **WARISAN}.items():
        im = trim(rgba(WEB / file))
        save(fit_h(im, 1100), f'img/packs/{pid}.webp', quality=86)
        save(fit_h(im, 560), f'img/packs/{pid}-sm.webp', quality=84)


def logo():
    print('logo')
    badge = trim(cutout(Image.open(FB / 'photo-1124815500076385.jpg'), 'badge'))
    save(fit_box(badge, 640), 'img/brand/badge.webp', quality=90)
    save(fit_box(badge, 240), 'img/brand/badge-sm.webp', quality=90)
    sq = Image.new('RGBA', (max(badge.size),) * 2, (0, 0, 0, 0))
    sq.alpha_composite(badge, ((sq.width - badge.width) // 2, (sq.height - badge.height) // 2))
    save(sq.resize((64, 64), Image.LANCZOS), 'img/brand/favicon.png')
    touch = Image.new('RGBA', (180, 180), (92, 15, 31, 255))
    b = fit_box(badge, 150)
    touch.alpha_composite(b, ((180 - b.width) // 2, (180 - b.height) // 2))
    save(touch, 'img/brand/apple-touch-icon.png')


def people():
    print('people')
    wave = trim(cutout(crop_frac(Image.open(WEB / 'banner4.jpg'), (0.60, 0.0, 1.0, 1.0)), 'paknil-wave'))
    save(fit_h(wave, min(900, wave.height)), 'img/people/paknil-wave.webp', quality=86)
    hero = trim(cutout(crop_frac(Image.open(WEB / 'banner5.jpg'), (0.66, 0.0, 1.0, 1.0)), 'paknil-hello'))
    save(fit_h(hero, min(900, hero.height)), 'img/people/paknil-hello.webp', quality=86)
    present = trim(cutout(crop_frac(Image.open(WEB / 'banner2.jpg'), (0.80, 0.22, 1.0, 1.0)), 'paknil-present'))
    save(present, 'img/people/paknil-present.webp', quality=86)


def photos():
    print('photos')
    for name, (path, w) in PHOTOS.items():
        im = Image.open(path)
        if im.mode in ('P', 'LA', 'RGBA'):
            bg = Image.new('RGB', im.size, (255, 255, 255))
            rg = im.convert('RGBA')
            bg.paste(rg, mask=rg.getchannel('A'))
            im = bg
        save(fit_w(im.convert('RGB'), w), f'img/photos/{name}.webp', quality=82)


def stock():
    print('stock')
    for name, (file, w) in STOCK_PHOTOS.items():
        save(fit_w(Image.open(STOCK / file).convert('RGB'), w), f'img/stock/{name}.webp', quality=82)


def stills():
    print('stills')
    for name, (video, t, w) in STILLS.items():
        save(grab(video, t, w), f'img/stills/{name}.webp', quality=82)


def fill_holes(cut):
    """Make enclosed transparent pockets opaque again (rembg drops dark centres, e.g. the coconut's eye).
    rembg keeps the original colours under transparent pixels, so the pocket simply gets its alpha back."""
    import cv2
    arr = np.array(cut)
    holes = (arr[:, :, 3] < 128).astype(np.uint8)
    h, w = holes.shape
    mask = np.zeros((h + 2, w + 2), np.uint8)
    for x in range(0, w, 8):
        for y in (0, h - 1):
            if holes[y, x] == 1:
                cv2.floodFill(holes, mask, (x, y), 2)
    for y in range(0, h, 8):
        for x in (0, w - 1):
            if holes[y, x] == 1:
                cv2.floodFill(holes, mask, (x, y), 2)
    arr[:, :, 3][holes == 1] = 255
    return Image.fromarray(arr, 'RGBA')


def largest_part(cut):
    """Keep only the biggest opaque island (drops slivers of neighbouring objects caught by the crop)."""
    import cv2
    arr = np.array(cut)
    solid = (arr[:, :, 3] > 100).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(solid)
    if n > 2:
        keep = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        grown = cv2.dilate((lab == keep).astype(np.uint8), np.ones((5, 5), np.uint8))
        arr[:, :, 3] = np.where(grown > 0, arr[:, :, 3], 0)
    return Image.fromarray(arr, 'RGBA')


def spices():
    print('spices')
    for name, (file, box) in SPICES.items():
        im = crop_frac(Image.open(STOCK / file).convert('RGB'), box)
        raw = cutout(im, f'spice-{name}')
        if name == 'coconut':
            raw = fill_holes(raw)
        cut = trim(largest_part(raw), alpha_min=40)
        if name == 'coconut':  # the half shell is round: an inscribed ellipse drops the neighbouring shell's rim
            ring = Image.new('L', (cut.width * 4, cut.height * 4), 0)
            ImageDraw.Draw(ring).ellipse((10, 10, cut.width * 4 - 10, cut.height * 4 - 10), fill=255)
            ring = ring.resize(cut.size, Image.LANCZOS)
            cut.putalpha(Image.fromarray(np.minimum(np.array(cut.getchannel('A')), np.array(ring))))
        save(fit_box(cut, 360), f'img/spices/{name}.webp', sites=[SITE_B], quality=88)
    stale = SITE_B / 'assets' / 'img' / 'spices' / 'shallot.webp'
    if stale.exists():
        stale.unlink()


def video():
    print('video')
    for name, (source, start, dur) in REELS.items():
        ffmpeg_video(source, f'video/{name}.mp4', start=start, dur=dur, poster_at=1.2)
    for name, (start, dur) in CLIPS.items():
        ffmpeg_video(MENU_REEL, f'video/{name}.mp4', start=start, dur=dur, audio=False, width=480, crf=27,
                     poster_at=min(0.5, dur / 2))


SECTIONS = {'packs': packs, 'logo': logo, 'people': people, 'photos': photos, 'stock': stock,
            'stills': stills, 'spices': spices, 'video': video}

if __name__ == '__main__':
    names = sys.argv[1:] or list(SECTIONS)
    for n in names:
        SECTIONS[n]()
