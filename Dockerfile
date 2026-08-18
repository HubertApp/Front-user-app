# --- Dépendances communes -------------------------------------------------
# Étape partagée par le dev et le build : la couche npm n'est invalidée que si
# package.json ou le lockfile changent.
FROM node:22.12.0-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Développement : Vite avec rechargement à chaud ------------------------
# Les sources ne sont volontairement pas copiées, elles arrivent par le bind
# mount déclaré dans le compose. Le volume anonyme /app/node_modules sert alors
# les binaires Linux installés ici, et non ceux compilés sur l'hôte.
FROM deps AS dev
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# --- Build de production ---------------------------------------------------
# Vite inline les variables VITE_* au moment du build : elles doivent être
# fournies ici, les passer au `docker run` n'aurait aucun effet.
FROM deps AS build
ARG VITE_AOM_API_URL=http://localhost:4000/
ARG VITE_MAPBOX_TOKEN=
ARG VITE_GOOGLE_CLIENT_ID=470685782077-st3g00j44k7802a0hqqno588m4nfv3bh.apps.googleusercontent.com
ENV VITE_AOM_API_URL=$VITE_AOM_API_URL
ENV VITE_MAPBOX_TOKEN=$VITE_MAPBOX_TOKEN
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
COPY . .
RUN npm run build

# --- Image finale ----------------------------------------------------------
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Régénère env.js (URL de la gateway) depuis les variables d'env du conteneur
# à CHAQUE démarrage : la même image sert n'importe quel environnement, plus
# besoin de rebuilder pour changer l'URL de la gateway (voir docker-entrypoint.sh).
COPY docker-entrypoint.sh /docker-entrypoint.sh
# sed : au cas où le fichier a été checkouté avec des fins de ligne CRLF
# (core.autocrlf=true côté Windows) — sinon le shebang devient "#!/bin/sh\r",
# introuvable pour Linux ("exec: no such file or directory" trompeur, alors
# que le fichier existe bel et bien).
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
