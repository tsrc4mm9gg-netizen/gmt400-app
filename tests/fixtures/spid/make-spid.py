#!/usr/bin/env python3
"""Syntetyczna naklejka SPID (GM Service Parts Identification) do testów OCR.
Zrobiona skryptem (Pillow) — NIE jest to zdjęcie ani grafika AI. Znane kody wpisane są poniżej.
Użycie: python3 make-spid.py <katalog-wyjściowy>
"""
import json, math, random, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
VIN = '1GCEK14K7TZ123456'  # poprawna cyfra kontrolna (pozycja 9 = 7)
KNOWN = ['YE9', 'Z71', 'G80', 'GU6', 'L31', 'M30', 'NP1', 'C60', 'ZQ3', 'UM6', 'AU3', 'V22', 'P06', 'B85', 'D45', 'KC4']
UNKNOWN = ['QQ7']  # kodu nie ma w bazie — ma trafić do „brak w bazie”
CODES = KNOWN + UNKNOWN

def sticker(width=1500, font=FONT, per_row=5, bold_scale=1.0):
    h = 900
    img = Image.new('L', (width, h), 238)
    d = ImageDraw.Draw(img)
    f = lambda s: ImageFont.truetype(font, s)
    d.rectangle([12, 12, width - 12, h - 12], outline=40, width=4)
    d.text((40, 30), 'SERVICE PARTS IDENTIFICATION', font=f(46), fill=20)
    d.text((40, 100), 'THIS VEHICLE WAS MANUFACTURED BY GENERAL MOTORS CORP.', font=f(24), fill=40)
    d.text((40, 150), 'VIN ' + sys.argv[2] if len(sys.argv) > 2 else 'VIN ' + VIN, font=f(40), fill=10)
    d.text((40, 215), 'MODEL CK10543   GVW 6100 LBS   MFG 03/96', font=f(28), fill=30)
    y = 290
    for i in range(0, len(CODES), per_row):
        row = CODES[i:i + per_row]
        d.text((40, y), '   '.join(row), font=f(52), fill=5)
        y += 88
    d.text((40, y + 20), 'THE PARTS ABOVE ARE ORIGINAL EQUIPMENT', font=f(22), fill=60)
    return img

def degrade(img, angle=3, blur=1.1, noise=0.04, shade=0.18, scale=0.62):
    random.seed(7)
    w, h = img.size
    img = img.rotate(angle, resample=Image.BICUBIC, expand=True, fillcolor=200)
    img = img.filter(ImageFilter.GaussianBlur(blur))
    px = img.load()
    for _ in range(int(img.size[0] * img.size[1] * noise)):
        x, y = random.randrange(img.size[0]), random.randrange(img.size[1])
        px[x, y] = max(0, min(255, px[x, y] + random.randint(-60, 60)))
    # nierównomierne oświetlenie
    grad = Image.linear_gradient('L').resize(img.size).rotate(20)
    img = Image.blend(img, Image.merge('L', [grad]), shade)
    img = img.resize((int(img.size[0] * scale), int(img.size[1] * scale)), Image.BILINEAR)
    return img.convert('RGB')

if __name__ == '__main__':
    clean = sticker()
    clean.convert('RGB').save(f'{OUT}/spid-clean.jpg', quality=88)
    degrade(clean).save(f'{OUT}/spid-degraded.jpg', quality=70)
    # trudniejsze warianty (inna czcionka, silniejsze rozmycie/szum/cień, mała rozdzielczość)
    plex = sticker(font='/usr/share/fonts/truetype/sand-box/google/IBM Plex Mono/IBMPlexMono-Bold.ttf', per_row=4)
    degrade(plex, angle=-4, blur=1.4, noise=0.06, shade=0.35, scale=0.5).save(f'{OUT}/spid-hard-plex.jpg', quality=55)
    degrade(sticker(per_row=6), angle=6, blur=1.7, noise=0.08, shade=0.45, scale=0.42).save(f'{OUT}/spid-hard-small.jpg', quality=50)
    json.dump({'known': KNOWN, 'unknown': UNKNOWN, 'vin': sys.argv[2] if len(sys.argv) > 2 else VIN}, open(f'{OUT}/spid-expected.json', 'w'), indent=2)
