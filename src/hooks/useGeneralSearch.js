import { useMemo } from 'react';
import { useStopSearch } from './useStopSearch';
import { toStopResult } from '../utils/searchResults';

// Recherche généraliste : une saisie, plusieurs fournisseurs, des résultats
// typés regroupés par section.
//
// Un seul fournisseur est branché pour l'instant (les arrêts). Les lieux et
// les lignes s'ajouteront ici, chacun avec son hook et sa section ; l'écran
// consomme `sections` sans rien savoir de leur provenance.
export function useGeneralSearch(query) {
  const { results: stops, loading, error } = useStopSearch(query);

  const sections = useMemo(() => {
    if (error || stops.length === 0) return [];

    // Une section vide vaut un en-tête suivi de rien : on ne la produit pas.
    return [{
      type: 'stop',
      title: 'Arrêts',
      results: stops.map(toStopResult),
    }];
  }, [stops, error]);

  return { sections, loading, error };
}
