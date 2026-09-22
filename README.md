# Front-user-app

Application front-end utilisateur de HubertApp : planification de trajets, favoris, infos trafic, gestion du compte. Une seule base de code React, buildée en application web et en application mobile native (iOS et Android) via Capacitor.

## Stack technique

* React 19, React Router 7.
* Vite 6 pour le build, Vitest 4 pour les tests (avec Testing Library et jsdom).
* Tailwind CSS 4 et daisyUI pour le style.
* Apollo Client 4 pour la communication GraphQL avec le gateway.
* Mapbox GL JS pour la cartographie.
* Capacitor (Android, iOS, Preferences, Browser) pour l'enrobage natif ; `@capgo/capacitor-social-login` pour la connexion Google sur mobile.
* Connexion Google en environnement web via Google Identity Services (script chargé dans `index.html`, sans dépendance npm).

Quelques dépendances présentes dans `package.json` (`react-map-gl`, les paquets `@ionic/vue*`, `html5-qrcode`) n'apparaissent pas utilisées dans le code actuel de `src/`. À vérifier avant de s'appuyer dessus dans un nouveau développement, elles proviennent probablement d'une base de départ antérieure au choix définitif de React.

## Démarrage rapide

```bash
npm ci
cp .env.example .env   # puis renseigner les valeurs, voir tableau ci-dessous
npm run dev             # serveur de développement Vite, http://localhost:5173
```

```bash
npm run build            # build de production dans dist/
npm run preview          # sert le build de production en local
```

```bash
npm test          # tests une fois (vitest run)
npm run test:watch  # tests en mode observation
npm run test:perf   # tests de performance (config Vitest dédiée)
```

## Variables d'environnement

Les variables `VITE_*` sont inlinées par Vite **au moment du build**, elles ne peuvent pas être changées après coup sans reconstruire l'application (y compris dans une image Docker).

| Variable | Rôle |
|---|---|
| `VITE_MAPBOX_TOKEN` | Jeton d'accès Mapbox (carte). Obligatoire : sans lui, `MapView` affiche une carte de remplacement statique au lieu de la vraie carte. |
| `VITE_GOOGLE_CLIENT_ID` | Identifiant client OAuth Google, utilisé pour le bouton de connexion web et l'initialisation native. |
| `VITE_AOM_API_URL` | URL de la gateway GraphQL, utilisée en développement uniquement (voir mécanisme de production ci-dessous). |

En production, l'image nginx est construite une seule fois puis déployée telle quelle : l'URL de la gateway n'est plus lue depuis `VITE_AOM_API_URL` mais injectée au démarrage du conteneur par `docker-entrypoint.sh`, à partir de la variable d'environnement `GATEWAY_URL` du pod (voir `src/config/gatewayUrl.js` et `k8s/50-front.yaml` du dépôt principal). Cela évite de reconstruire l'image à chaque changement d'adresse de la gateway.

### Construire l'image Docker

```bash
docker build --target prod \
  --build-arg VITE_MAPBOX_TOKEN=<votre_jeton> \
  -t hubertapp/front-user-app:local .
```

`VITE_MAPBOX_TOKEN` n'a pas de valeur par défaut dans le `Dockerfile` et n'est jamais lu depuis un fichier `.env` local au moment du build (`.dockerignore` l'exclut volontairement du contexte) : il doit systématiquement être passé en `--build-arg`, sous peine d'obtenir une carte non fonctionnelle sans message d'erreur explicite.

## Structure du projet

```
src/
  pages/            une page React par route (voir App.jsx pour la liste des routes)
  components/       composants partagés, regroupés par domaine (map, notifications, ui, layout...)
  services/         hooks Apollo Client (requêtes et mutations GraphQL) par domaine métier
  context/          contextes React globaux (thème clair/sombre, sidebar)
  hooks/            hooks réutilisables (métadonnées de page, arrêts à proximité...)
  api/              appels HTTP hors Apollo (ex. recherche d'arrêts)
  config/           configuration runtime (URL de la gateway)
  data/mock.js       données factices utilisées par les écrans non encore branchés à un backend
```

## Fonctionnalités : ce qui est réellement branché, et ce qui ne l'est pas

Point important pour toute documentation utilisateur ou technique : plusieurs écrans affichent une interface complète mais reposent encore sur des données factices (`src/data/mock.js`), sans logique backend derrière. Les distinguer évite de documenter des fonctionnalités qui n'existent pas encore.

**Réellement fonctionnel :**
* Connexion et déconnexion via Google, création de compte automatique à la première connexion, suppression de compte.
* Consultation du profil, mode sombre, gestion des préférences de notifications (canaux in-app et e-mail, individuellement ou via un interrupteur unique).
* Centre de notifications in-app (lecture, marquage comme lu).
* Construction d'un itinéraire multi-étapes (ajout, suppression, réorganisation, inversion, filtre par mode de transport).
* Carte interactive : zoom avant, zoom arrière et géolocalisation ("Ma position"), sur les pages Favoris et Recherche.
* Recherche des arrêts de transport à proximité, sur données GTFS réelles, avec géolocalisation et rayon de recherche ajustable (page Infos trafic, onglet Ma position).

**Interface présente, non branchée à un backend (données de `mock.js`) :**
* Page Favoris dans son intégralité (trajets affichés, bouton d'ajout).
* Page Mes voyages dans son intégralité (historique, bouton nouveau voyage).
* Autocomplétion de destination, lieux enregistrés et récents, et calcul d'itinéraire lui-même (durée, distance, prix) sur la page Recherche.
* Alertes de perturbation de l'onglet "Mes trajets" de la page Infos trafic.
* "Trajet en cours" et "trajets les plus utilisés" de la page d'accueil.
* Formulaire "Devenir partenaire" (n'envoie aucune requête au backend).
* Canaux de notification SMS et push : évoqués dans l'interface des préférences futures mais non implémentés (seuls in-app et e-mail existent réellement).

## Authentification

Deux parcours selon la plateforme :

* **Web** : bouton Google Identity Services (script chargé dans `index.html`), callback recevant un jeton d'identité (`idToken`), envoyé à la mutation GraphQL `loginWithGoogle` du gateway.
* **Natif (iOS/Android)** : `@capgo/capacitor-social-login`, même mutation `loginWithGoogle` en sortie.

Le jeton d'accès renvoyé par le backend est stocké via `@capacitor/preferences` (fonctionne aussi bien en web qu'en natif). Voir `src/pages/AuthPages.jsx` et `src/pages/tokenStore.js`.

## Tests

Vitest avec Testing Library et jsdom. Les mocks des appels GraphQL utilisent `MockedProvider` d'Apollo Client. Voir `test/setup.js` pour la configuration globale (mock de `@capacitor/preferences`, etc.) et `test/test-utils.jsx` pour les fonctions utilitaires de rendu partagées entre les suites de tests.
