import { useCallback, useEffect, useState } from 'react';
import { fetchSearchStops } from '../api/stops';
import { isSearchableQuery } from '../utils/searchQuery';

const DEBOUNCE_MS = 250;

export function useStopSearch(query, { first = 20 } = {}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey(k => k + 1), []);

  useEffect(() => {
    // Le back refuse une saisie trop courte : tant que le seuil n'est pas
    // atteint on n'appelle pas, et on repart d'une liste vide plutôt que de
    // laisser les résultats de la frappe précédente.
    if (!isSearchableQuery(query)) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    // Une requête par frappe saturerait la gateway et laisserait des réponses
    // en retard écraser la bonne ; le debounce n'attaque qu'à la pause.
    const timer = setTimeout(() => {
      fetchSearchStops({ query, first, signal: controller.signal })
        .then(stops => {
          setResults(stops);
          setLoading(false);
        })
        .catch(err => {
          // Une requête annulée n'est pas un échec : ne pas faire clignoter
          // d'erreur entre deux frappes.
          if (err.name === 'AbortError') return;
          setError(err.message);
          setResults([]);
          setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, first, reloadKey]);

  return { results, loading, error, refetch };
}
