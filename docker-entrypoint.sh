#!/bin/sh
# Régénère env.js à chaque démarrage du conteneur à partir des variables
# d'environnement du pod/conteneur (pas du build) : la même image sert donc
# n'importe quel environnement (minikube, staging, prod...) sans rebuild.
set -eu

cat > /usr/share/nginx/html/env.js <<EOF
window.__RUNTIME_CONFIG__ = {
  GATEWAY_URL: "${GATEWAY_URL:-}"
};
EOF

exec nginx -g 'daemon off;'
