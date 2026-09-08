#!/usr/bin/env python3
"""Applique les corrections de l'audit SEO technique (juillet 2026).

Conçu pour tourner dans GitHub Actions depuis la racine du repo :
  pip install cairosvg pillow  (+ paquet fonts-liberation)
  python3 tools/apply_seo_fixes.py
"""
import glob
import os
import re

HTML = sorted(glob.glob("*.html") + glob.glob("services/*.html") + glob.glob("blog/*.html"))


def patch(path, pairs, regex=False):
    with open(path, encoding="utf-8") as f:
        t = f.read()
    for a, b in pairs:
        t = re.sub(a, b, t) if regex else t.replace(a, b)
    with open(path, "w", encoding="utf-8") as f:
        f.write(t)


# 1. og:image SVG -> PNG (toutes les pages) + type MIME
for p in HTML:
    patch(p, [
        ("og-image.svg", "og-image.png"),
        ('<meta property="og:image:type" content="image/svg+xml">',
         '<meta property="og:image:type" content="image/png">'),
    ])

# 2. JSON-LD des articles : image en PNG (les <img> restent en SVG)
for p in glob.glob("blog/*.html"):
    patch(p, [(r"(astorya\.fr/uploads/blog/[a-z0-9-]+)\.svg", r"\1.png")], regex=True)

# 3. Accueil : liens zones-intervention.html#ancre -> URL propre
patch("index.html", [('href="zones-intervention.html#', 'href="zones-intervention#')])

# 4. Footer : liens morts vers les vraies pages
for p in HTML:
    patch(p, [
        ('<a href="/">Nos partenaires</a>', '<a href="/partenaires">Nos partenaires</a>'),
        ('<a href="/">Études de cas</a>', '<a href="/etudes-de-cas">Études de cas</a>'),
        ('<a href="/">Presse</a>', '<a href="/presse">Presse</a>'),
    ])

# 5. Pages services : breadcrumb Services
for p in glob.glob("services/*.html"):
    patch(p, [('<a href="#">Services</a>', '<a href="../services">Services</a>')])

# 6. Mentions légales : ancres réelles
patch("mentions-legales.html", [
    ("<h2>1. Éditeur du site</h2>", '<h2 id="editeur">1. Éditeur du site</h2>'),
    ("<h2>2. Hébergeur du site</h2>", '<h2 id="hebergeur">2. Hébergeur du site</h2>'),
    ("<h2>3. Propriété intellectuelle</h2>", '<h2 id="propriete">3. Propriété intellectuelle</h2>'),
    ("<h2>4. Responsabilité</h2>", '<h2 id="responsabilite">4. Responsabilité</h2>'),
    ("<h2>5. Liens hypertextes</h2>", '<h2 id="liens">5. Liens hypertextes</h2>'),
    ("<h2>6. Données personnelles &amp; RGPD</h2>", '<h2 id="rgpd">6. Données personnelles &amp; RGPD</h2>'),
    ("<h2>7. Cookies</h2>", '<h2 id="cookies">7. Cookies</h2>'),
    ("<h2>8. Droit applicable &amp; juridiction</h2>", '<h2 id="droit">8. Droit applicable &amp; juridiction</h2>'),
    ('href="mentions-legales.html#donnees"', 'href="mentions-legales#rgpd"'),
    ("""        <ul style="list-style:none;padding:0;">
          <li><a href="#" onclick="document.querySelector('h2').scrollIntoView({behavior:'smooth'});return false;">1. Éditeur du site</a></li>
        </ul>
        <ul style="list-style:none;padding:0;font-size:0.9rem;">
          <li style="padding:6px 0;"><a href="#">Hébergeur</a></li>
          <li style="padding:6px 0;"><a href="#">Propriété intellectuelle</a></li>
          <li style="padding:6px 0;"><a href="#">Responsabilité</a></li>
          <li style="padding:6px 0;"><a href="#">Liens hypertextes</a></li>
          <li style="padding:6px 0;"><a href="#">Données personnelles &amp; RGPD</a></li>
          <li style="padding:6px 0;"><a href="#">Cookies</a></li>
          <li style="padding:6px 0;"><a href="#">Droit applicable</a></li>
        </ul>""",
     """        <ul style="list-style:none;padding:0;font-size:0.9rem;">
          <li style="padding:6px 0;"><a href="#editeur">Éditeur du site</a></li>
          <li style="padding:6px 0;"><a href="#hebergeur">Hébergeur</a></li>
          <li style="padding:6px 0;"><a href="#propriete">Propriété intellectuelle</a></li>
          <li style="padding:6px 0;"><a href="#responsabilite">Responsabilité</a></li>
          <li style="padding:6px 0;"><a href="#liens">Liens hypertextes</a></li>
          <li style="padding:6px 0;"><a href="#rgpd">Données personnelles &amp; RGPD</a></li>
          <li style="padding:6px 0;"><a href="#cookies">Cookies</a></li>
          <li style="padding:6px 0;"><a href="#droit">Droit applicable</a></li>
        </ul>"""),
])

# 7. robots.txt : Disallow inefficaces (cleanUrls) — le noindex fait le travail
patch("robots.txt", [
    ("Disallow: /mentions-legales.html\n", ""),
    ("Disallow: /chatbot.js\n", ""),
])

# 8. sitemap.xml : +3 pages orphelines, -mentions-legales (noindex)
APROPOS = """  <url>
    <loc>https://www.depannage.astorya.fr/a-propos</loc>
    <priority>0.6</priority>
    <changefreq>yearly</changefreq>
  </url>
"""
NEW = APROPOS + """  <url>
    <loc>https://www.depannage.astorya.fr/etudes-de-cas</loc>
    <priority>0.6</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://www.depannage.astorya.fr/partenaires</loc>
    <priority>0.5</priority>
    <changefreq>yearly</changefreq>
  </url>
  <url>
    <loc>https://www.depannage.astorya.fr/presse</loc>
    <priority>0.5</priority>
    <changefreq>yearly</changefreq>
  </url>
"""
MENTIONS = """  <url>
    <loc>https://www.depannage.astorya.fr/mentions-legales</loc>
    <priority>0.3</priority>
    <changefreq>yearly</changefreq>
  </url>
"""
patch("sitemap.xml", [(APROPOS, NEW), (MENTIONS, "")])

# 9. PNG orphelins
for p in glob.glob("uploads/pasted-*.png"):
    os.remove(p)

# 10. Génération des PNG — héros de blog (cairosvg)
import cairosvg  # noqa: E402

for svg in sorted(glob.glob("uploads/blog/*.svg")):
    cairosvg.svg2png(url=svg, write_to=svg[:-4] + ".png", output_width=1200, output_height=800)

# 11. og-image.png 1200x630 (Pillow, fidèle au design de og-image.svg)
from PIL import Image, ImageDraw, ImageFont  # noqa: E402

W, H = 1200, 630
img = Image.new("RGB", (W, H))
px = img.load()
c1, c2 = (0x0B, 0x1B, 0x3A), (0x1E, 0x3A, 0x8A)
for y in range(H):
    for x in range(0, W, 4):
        t = (x + y) / (W + H)
        col = tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))
        for dx in range(4):
            if x + dx < W:
                px[x + dx, y] = col
d = ImageDraw.Draw(img)
LS_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
LS_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
f_logo = ImageFont.truetype(LS_BOLD, 78)
f_sub = ImageFont.truetype(LS_BOLD, 42)
f_line1 = ImageFont.truetype(LS_REG, 27)
f_line2 = ImageFont.truetype(LS_BOLD, 23)
f_url = ImageFont.truetype(LS_BOLD, 21)
d.rounded_rectangle([80, 80, 200, 200], radius=22, fill=(0x3B, 0x82, 0xF6))
bb = d.textbbox((0, 0), "A", font=f_logo)
d.text((140 - (bb[2] - bb[0]) / 2 - bb[0], 140 - (bb[3] - bb[1]) / 2 - bb[1]), "A", font=f_logo, fill="white")
d.text((80, 232), "Astorya", font=f_logo, fill="white")
d.text((80, 344), "Entreprise informatique", font=f_sub, fill=(0x93, 0xC5, 0xFD))
d.text((80, 396), "à Saint-Nazaire", font=f_sub, fill=(0x93, 0xC5, 0xFD))
d.rectangle([80, 478, 320, 482], fill=(0x3B, 0x82, 0xF6))
d.text((80, 516), "Infogérance · Cybersécurité · Cloud · Téléphonie", font=f_line1, fill=(0xCB, 0xD5, 0xE1))
d.text((80, 560), "Intervention sous 4h · depuis 2010", font=f_line2, fill=(0x94, 0xA3, 0xB8))
bb = d.textbbox((0, 0), "depannage.astorya.fr", font=f_url)
d.text((1120 - (bb[2] - bb[0]), 582), "depannage.astorya.fr", font=f_url, fill=(0x60, 0xA5, 0xFA))
img.save("og-image.png", optimize=True)

print("Corrections SEO appliquées.")
