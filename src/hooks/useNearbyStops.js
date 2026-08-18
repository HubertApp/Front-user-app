import { useCallback, useEffect, useState } from 'react';
import { fetchStopsNearby } from '../api/stops';

export function useNearbyStops({ lat, lon, radiusMeters = 500, first = 20 }) {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey(k => k + 1), []);

  useEffect(() => {
    // Sans annulation, un changement rapide de rayon laisse une réponse en retard
    // écraser la bonne.
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchStopsNearby({ lat, lon, radiusMeters, first, signal: controller.signal })
      .then(result => {
        setStops(result);
        setLoading(false);
      })
      .catch(err => {
        // Une requête annulée n'est pas un échec : ne pas faire clignoter d'erreur.
        if (err.name === 'AbortError') return;
        setError(err.message);
        setStops([]);
        setLoading(false);
      });

    return () => controller.abort();
  }, [lat, lon, radiusMeters, first, reloadKey]);

  return { stops, loading, error, refetch };
}
