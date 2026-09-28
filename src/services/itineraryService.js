import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export const GET_ITINERARY_QUERY = gql`
  query GetItineraire($request: RouteRequestDTO!) {
    getItineraireFromTo(request: $request) {
      distanceM
      durationS
      steps { instruction distanceM durationS }
      geojson
    }
  }
`;

const hasCoordinates = p => Number.isFinite(p?.lat) && Number.isFinite(p?.lon);

export function useItinerary({ from, to, profile = 'walking' }) {
  // Figée au montage : recalculée à chaque rendu, elle relancerait la requête en boucle.
  const [departureTime] = useState(() => new Date().toISOString());
  const ready = hasCoordinates(from) && hasCoordinates(to);

  const { data, loading, error } = useQuery(GET_ITINERARY_QUERY, {
    skip: !ready,
    variables: ready ? {
      request: {
        startPoint: { lat: from.lat, lon: from.lon },
        endPoint: { lat: to.lat, lon: to.lon },
        departureTime,
        routingProfile: profile,
      },
    } : undefined,
  });

  return { itinerary: data?.getItineraireFromTo ?? null, loading, error };
}
