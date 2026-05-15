# Astorya Saint-Nazaire — Site SEO local

Site vitrine optimisé SEO pour Astorya — agence de dépannage et infogérance informatique à Saint-Nazaire (44600).

## 🚀 Déploiement Vercel

### Option A — Déploiement par drag & drop (le plus simple)

1. Allez sur [vercel.com](https://vercel.com) et créez un compte (gratuit) si pas déjà fait
2. Cliquez sur **"Add New..." → "Project"**
3. Faites glisser le dossier complet du projet (ou son `.zip`) dans la zone d'upload
4. Vercel détecte automatiquement qu'il s'agit d'un site statique HTML
5. Cliquez sur **"Deploy"** — c'est tout, le site est en ligne en moins d'une minute

### Option B — Déploiement via GitHub (recommandé pour la suite)

1. Créez un dépôt GitHub (privé ou public) et poussez le contenu du projet
2. Sur Vercel : **"Add New..." → "Project" → Import Git Repository**
3. Sélectionnez votre dépôt
4. Framework Preset : **"Other"** (site HTML statique)
5. Output Directory : laissez vide ou mettez `.`
6. Cliquez sur **"Deploy"**

Chaque `git push` redéploiera automatiquement le site.

---

## 🌐 Configuration du sous-domaine `www.depannage.astorya.fr`

### Côté Vercel
1. Dans le projet Vercel, allez dans **Settings → Domains**
2. Cliquez sur **"Add"** et saisissez `www.depannage.astorya.fr`
3. Vercel vous donne un enregistrement DNS à créer (un CNAME)

### Côté gestionnaire DNS de `astorya.fr`
1. Connectez-vous à votre registrar / hébergeur DNS (OVH, Gandi, Cloudflare, etc.)
2. Dans la zone DNS de `astorya.fr`, ajoutez :

   | Type  | Nom              | Valeur                       | TTL  |
   |-------|------------------|------------------------------|------|
   | CNAME | `www.depannage`  | `cname.vercel-dns.com.`      | 3600 |

3. (Recommandé) Ajoutez aussi un enregistrement pour la version sans `www` :

   | Type  | Nom         | Valeur                  | TTL  |
   |-------|-------------|-------------------------|------|
   | CNAME | `depannage` | `cname.vercel-dns.com.` | 3600 |

4. Propagation DNS : généralement 5 à 60 minutes (jusqu'à 24h dans les pires cas)
5. Une fois propagé, Vercel délivre **automatiquement le certificat HTTPS** (Let's Encrypt)

---

## ⚙️ Fichier `vercel.json` (déjà inclus)

Le fichier `vercel.json` à la racine du projet configure :
- Les redirections de la racine `/` vers `/index.html`
- Les headers de sécurité recommandés
- Le cache des assets statiques
- La redirection `depannage.astorya.fr` (sans `www`) vers `www.depannage.astorya.fr`

---

## 📋 Après publication

1. Vérifier que `https://www.depannage.astorya.fr` charge bien
2. Soumettre le sitemap dans [Google Search Console](https://search.google.com/search-console)  
   URL du sitemap : `https://www.depannage.astorya.fr/sitemap.xml`
3. Mettre à jour les URL `https://astorya.fr/saint-nazaire/...` dans les balises canoniques et le sitemap.xml par `https://www.depannage.astorya.fr/...` (voir ci-dessous)
4. Créer / mettre à jour la fiche **Google Business Profile** « Astorya Saint-Nazaire »
5. Obtenir des backlinks locaux (CCI Nantes-Saint-Nazaire, annuaires Loire-Atlantique, partenaires)

---

## 📞 Coordonnées affichées

- Adresse : 24 Allée de la Mer d'Iroise, 44600 Saint-Nazaire
- Téléphone : 02 40 00 80 00
- Email : contact@astorya.fr
- Horaires : Lun–Jeu 8h30–12h30 / 14h00–18h00 · Vendredi jusqu'à 17h30
