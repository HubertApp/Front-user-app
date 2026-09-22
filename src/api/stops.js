import { gqlRequest } from './graphql';

const STOPS_NEARBY = `
  query StopsNearby($lat: Float!, $lon: Float!, $radiusMeters: Int!, $first: Int!) {
    stopsNearby(lat: $lat, lon: $lon, radiusMeters: $radiusMeters, first: $first) {
      id
      name
      distanceMeters
      location { latitude longitude }
      routes { id shortName longName type color textColor }
    }
  }
`;

export async function fetchStopsNearby({ lat, lon, radiusMeters = 500, first = 20, signal }) {
  const data = await gqlRequest(STOPS_NEARBY, { lat, lon, radiusMeters, first }, { signal });
  return data.stopsNearby ?? [];
}

const SEARCH_STOPS = `
  query SearchStops($query: String!, $first: Int!) {
    searchStops(query: $query, first: $first) {
      id
      name
      location { latitude longitude }
      network { name cityOrRegion }
      routes { id shortName longName type color textColor }
    }
  }
`;

// La recherche est volontairement globale : elle porte sur tous les réseaux
// agrégés, d'où l'absence de networkId. `network` remonte donc dans la
// réponse, seul moyen de distinguer deux arrêts homonymes de villes
// différentes. `searchStops` trie par nom, pas par distance : ses arrêts
// n'ont pas de distanceMeters.
export async function fetchSearchStops({ query, first = 20, signal }) {
  const data = await gqlRequest(SEARCH_STOPS, { query, first }, { signal });
  return data.searchStops ?? [];
}

const STOP_DETAIL = `
  query StopDetail($id: ID!, $first: Int!, $after: String) {
    stop(id: $id) {
      id
      name
      location { latitude longitude }
      network { name cityOrRegion }
      routes { id shortName longName type color textColor }
      departures(first: $first, after: $after) {
        tripId
        departureTime
        headsign
        route { id shortName longName type color textColor }
      }
    }
  }
`;

// `after` borne les passages à ceux qui restent à venir ; c'est l'appelant qui
// le fournit, pour que l'heure de référence reste testable.
export async function fetchStop({ id, first = 10, after = null, signal }) {
  const data = await gqlRequest(STOP_DETAIL, { id, first, after }, { signal });
  return data.stop ?? null;
}
