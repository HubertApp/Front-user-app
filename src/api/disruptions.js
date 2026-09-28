import { gqlRequest } from './graphql';

const DISRUPTIONS = `
  query Disruptions($lat: Float!, $lon: Float!, $radiusM: Float!) {
    trafficCoverage(lat: $lat, lon: $lon, radiusM: $radiusM) {
      covered
    }
    disruptions(lat: $lat, lon: $lon, radiusM: $radiusM) {
      tileId
      niveau
      friction
      distanceM
    }
  }
`;

export async function fetchDisruptions({ lat, lon, radiusM = 3000, signal }) {
  const data = await gqlRequest(DISRUPTIONS, { lat, lon, radiusM }, { signal });
  return {
    covered: data.trafficCoverage?.covered ?? false,
    disruptions: data.disruptions ?? [],
  };
}
