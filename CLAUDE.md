# Astorya Saint-Nazaire — notes pour Claude Code

Site statique HTML/CSS/JS (pas de build) déployé sur Vercel via GitHub (`Asto-lab44/astorya-depannage-saint-nazaire`), domaine `www.depannage.astorya.fr`.

## Fichiers du site (à déployer)
- `index.html` + 10 pages (`a-propos`, `contact`, `zones-intervention`, `mentions-legales`, `services/*.html` ×5, `blog/index.html`)
- `styles.css` — système visuel commun (palette : navy #0B2545, orange #E68A3A, crème #FAF7F2 ; typo Bricolage Grotesque / Manrope / Caveat pour les touches manuscrites)
- `chatbot.js` — intégration Crisp (WEBSITE_ID inclus)
- `vercel.json`, `robots.txt`, `sitemap.xml`, `README.md`

## Ne PAS déployer (fichiers de travail)
- `uploads/`, `*.png` de com (logos, bannières), `video-*.html`, `animations.jsx`, `video-scenes.jsx`, `image-slot.js`, `montage-equipe.html`, `banniere-*.html`, `index-avant-humour.html` (sauvegarde pré-humour)

## Points d'attention
- SEO local Saint-Nazaire : titles/canonicals/JSON-LD (LocalBusiness, Service, FAQPage, Breadcrumb) présents sur chaque page — conserver lors des modifs.
- La carte du hero (`index.html`, script en bas de page) charge d3 + topojson + geojson des communes 44 à l'exécution.
- Coordonnées : 24 Allée de la Mer d'Iroise, 44600 Saint-Nazaire · 02 40 00 80 00 · Lun–Jeu 8h30–12h30/14h–18h, Ven jusqu'à 17h.
- Google Analytics : G-TQKM8L89VD sur toutes les pages.
