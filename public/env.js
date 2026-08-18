// Placeholder pour le dev (`npm run dev`, front-dev) : objet vide, donc
// gatewayUrl.js retombe sur VITE_AOM_API_URL / localhost:4000.
// En prod (image nginx), ce fichier est régénéré au démarrage du conteneur
// par docker-entrypoint.sh à partir de la variable d'env GATEWAY_URL.
window.__RUNTIME_CONFIG__ = {};
