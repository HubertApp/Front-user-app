import { GATEWAY_URL } from '../config/gatewayUrl.js';

export async function gqlRequest(query, variables = {}, { signal } = {}) {
  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Le service a répondu ${response.status}.`);
  }

  const payload = await response.json();

  // GraphQL répond 200 même en cas d'erreur applicative : c'est par ce tableau
  // que remontent les ValueError des resolvers (bornes sur first / radiusMeters).
  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message);
  }

  return payload.data;
}
