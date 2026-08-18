# Hubert Front-User-App — Redesign converti

Ce dossier contient le **redesign complet** de l'application, converti dans le **format de ta codebase Vite + Tailwind v4 + DaisyUI + React Router 7**.

## 📦 Ce qu'il y a dedans

```
hubert-converted/
└── src/
    ├── App.jsx                       ← routes (5 onglets + /recherche)
    ├── index.css                     ← tokens Tailwind v4 + thème DaisyUI "hubert"
    ├── data/
    │   └── mock.js                   ← données enrichies (alertes par sévérité, etc.)
    ├── pages/
    │   ├── HomePage.jsx              ← hub + trajet en cours + raccourcis
    │   ├── FavoritesPage.jsx         ← map + carousel
    │   ├── TrafficPage.jsx           ← tabs + alertes par sévérité
    │   ├── TravelsPage.jsx           ← chips de filtre + cartes expandables
    │   ├── AccountPage.jsx           ← profil + stats + paramètres
    │   └── SearchPage.jsx            ← flow 3 étapes (drag + bottom sheet)
    └── components/
        ├── layout/
        │   ├── BottomNav.jsx         ← 5 onglets mobile + sidebar 256px desktop
        │   └── PageHeader.jsx
        ├── ui/
        │   ├── HubertLogo.jsx
        │   ├── TransportIcon.jsx     ← + MODE_META export pour les libellés FR
        │   ├── EndpointDot.jsx       ← start / wp / end
        │   └── SearchBar.jsx
        ├── home/
        │   ├── QuickActionCard.jsx
        │   ├── LiveTripCard.jsx
        │   └── FrequentRouteRow.jsx
        ├── favorites/
        │   └── FavoriteCard.jsx
        ├── traffic/
        │   └── AlertCard.jsx
        ├── travels/
        │   ├── TravelCard.jsx
        │   └── TravelStep.jsx
        ├── itinerary/
        │   └── ItineraryStep.jsx
        ├── search/
        │   └── AutocompleteItem.jsx
        └── map/
            └── MapView.jsx           ← Mapbox + fallback SVG si pas de token
```

## 🚀 Comment l'intégrer dans ton repo

### Option 1 — Sur une nouvelle branche (recommandé)

Depuis ton repo `Front-user-app` en local :

```bash
git checkout -b redesign/v2-modern
```

Puis **remplace** ces fichiers/dossiers par ceux de `hubert-converted/src/` :

```
src/App.jsx                  ← remplacer
src/index.css                ← remplacer
src/data/mock.js             ← remplacer (enrichi)
src/pages/                   ← remplacer tous les fichiers existants
src/components/layout/       ← remplacer
src/components/ui/           ← remplacer (+ nouveau EndpointDot.jsx)
src/components/home/         ← remplacer (+ nouveaux LiveTripCard, FrequentRouteRow)
src/components/favorites/    ← remplacer
src/components/traffic/      ← remplacer (TabButton.jsx peut être supprimé)
src/components/travels/      ← remplacer
src/components/itinerary/    ← remplacer
src/components/search/       ← remplacer
src/components/map/          ← remplacer
```

### Fichiers à supprimer (legacy)

```
src/pages/homePages.jsx              (doublon en camelCase)
src/pages/favoriteTravelPages.jsx
src/pages/infoTraficPages.jsx
src/pages/myTravelPages.jsx
src/components/commons/              (footer.jsx, header.jsx, etc. — remplacés)
src/components/favoriteTravelPages/
src/components/infoTraficPages/
src/components/myTravelPages/
src/components/traffic/TabButton.jsx (remplacé par segmented control inline)
```

### Tout pousser

```bash
git add .
git commit -m "feat(design): redesign moderne v2 — 5 onglets, trafic par sévérité, search flow refondu"
git push -u origin redesign/v2-modern
```

## 🧪 Vérifier que ça tourne

```bash
npm install        # déjà à jour, mêmes dépendances
npm run dev
```

Vérifier que ton `.env` contient toujours `VITE_MAPBOX_TOKEN=...` — si absent, la carte affiche un fallback SVG stylisé (rues + Moselle + parcs) plutôt qu'une erreur.

## 🎨 Système de design

Tokens dans `src/index.css` (utilisables comme classes Tailwind grâce à `@theme`) :

| Token              | Valeur     | Usage                                |
| ------------------ | ---------- | ------------------------------------ |
| `teal`             | `#0AB5C9`  | accent principal                     |
| `teal-hover`       | `#0790A0`  | hover / variant foncé                |
| `teal-soft`        | `rgba(...)`| fond pastille pour mode-icon         |
| `ink` / `ink-2`    | `#0E1A24`  | texte principal / secondaire         |
| `muted` / `soft`   | `#5B6B7A`  | texte tertiaire / labels             |
| `warm-bg`          | `#F6F7F4`  | fond app                             |
| `line` / `line-soft` | `#EAECEE` / `#F1F2F4` | bordures            |
| `warning` / `danger` | orange / corail | alertes par sévérité        |

Polices :
- **Inter** — UI (déjà chargée via `index.html`)
- **Lilita One** — logo Hubert uniquement (déjà chargée)
- **JetBrains Mono** — chiffres / timestamps / clés *(à ajouter dans `index.html` si tu veux l'effet mono)* :

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

Sinon `font-mono` retombera sur `ui-monospace` système — toujours lisible.

## 🆕 Nouvelles routes / fonctionnalités

| Route        | Avant            | Après                                   |
| ------------ | ---------------- | --------------------------------------- |
| `/`          | Hub statique     | + trajet en cours live, raccourcis 4-col, fréquents 2-col |
| `/favoris`   | Map + carousel   | + dots de pagination + bouton "Ajouter" |
| `/trafic`    | 2 onglets        | + bandeau récap "+32 min cumulés" + sévérité (severe / medium / minor) |
| `/voyages`   | Liste plate      | + chips de filtre Tous / En cours / Terminés avec compteurs |
| `/compte`    | Liste boutons    | + bandeau stats Trajets / Favoris / CO₂ |
| `/recherche` | Flow 3 étapes    | Identique fonctionnellement, refonte visuelle |

La **nav passe de 3 à 5 onglets** : "Let's move / Favoris / Compte" devient "Accueil / Favoris / Trafic / Voyages / Compte" pour faire remonter les sections enfouies.

## ⚠️ Breaking changes mineurs

- `tailwind.config.js` n'est plus nécessaire pour les couleurs custom — tout passe par `@theme` dans `index.css` (Tailwind v4 native). Tu peux le garder pour DaisyUI.
- Les anciens dossiers `commons/`, `homePages/`, `favoriteTravelPages/`, etc. sont à supprimer (doublons en camelCase de l'ancien proto).
- `TransportIcon` exporte maintenant aussi `MODE_META` (libellés FR + icônes FontAwesome) — pratique pour réutiliser ailleurs.

Bon merge ! 🚀
