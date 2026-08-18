// URL de la gateway GraphQL — source unique pour apolloClient.js et api/graphql.js.
//
// - En dev (`npm run dev`, `docker compose ... front-dev`) : VITE_AOM_API_URL,
//   inlinée au build par Vite depuis le .env local.
// - En prod (image nginx buildée UNE SEULE FOIS, déployée telle quelle sur
//   minikube/staging/prod) : window.__RUNTIME_CONFIG__.GATEWAY_URL, injecté
//   au DÉMARRAGE du conteneur par docker-entrypoint.sh à partir de la
//   variable d'environnement GATEWAY_URL du pod (voir k8s/50-front.yaml).
//   Ça évite de rebuilder l'image à chaque fois que l'URL de la gateway
//   change (IP minikube différente par poste, staging, prod...) — le même
//   Dockerfile/image sert partout, seule la config runtime change.
export const GATEWAY_URL =
  (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__?.GATEWAY_URL) ||
  import.meta.env.VITE_AOM_API_URL ||
  'http://localhost:4000';
