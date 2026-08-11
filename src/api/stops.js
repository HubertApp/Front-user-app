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
