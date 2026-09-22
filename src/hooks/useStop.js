import { useCallback, useEffect, useState } from 'react';
import { fetchStop } from '../api/stops';
import { nowAsGtfsTime } from '../utils/gtfsTime';

export function useStop(id, { first = 10 } = {}) {
  const [stop, setStop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey(k => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    // L'heure est relue à chaque chargement : un rafraîchissement doit repartir
    // de maintenant, pas de l'heure d'ouverture de la fiche.
    fetchStop({ id, first, after: nowAsGtfsTime(), signal: controller.signal })
      .then(result => {
        // `result` à null veut dire « arrêt inconnu », pas « échec » : la page
        // affiche une fiche introuvable, sans bandeau d'erreur ni Réessayer.
        setStop(result);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setStop(null);
        setLoading(false);
      });

    return () => controller.abort();
  }, [id, first, reloadKey]);

  return { stop, loading, error, refetch };
}
