// Forme unique des résultats de la recherche généraliste.
//
// Tout ce que la barre sait chercher se ramène à ce contrat : un type, de quoi
// s'afficher, et les coordonnées quand l'entité en a. Brancher les lieux ou les
// lignes plus tard consiste à écrire un `toXxxResult` et une entrée dans
// `resolveResultTarget` — l'écran, lui, ne change pas.

export function toStopResult(stop) {
  const location = stop.location ?? null;

  return {
    type: 'stop',
    id: stop.id,
    label: stop.name,
    // La recherche porte sur tous les réseaux : la ville est ce qui distingue
    // deux arrêts homonymes.
    sublabel: stop.network?.cityOrRegion || stop.network?.name || 'Arrêt',
    coordinates: location
      ? { latitude: location.latitude, longitude: location.longitude }
      : null,
    raw: stop,
  };
}

// Où mène un résultat, selon son seul type. Isolé de l'écran pour que la règle
// reste lisible et testable à mesure que les types s'ajoutent.
export function resolveResultTarget(result) {
  switch (result.type) {
    case 'stop':
      return { kind: 'navigate', to: `/arret/${result.id}` };
    case 'route':
      return { kind: 'navigate', to: `/ligne/${result.id}` };
    // Un lieu n'a pas de fiche : il ne vaut que comme extrémité de trajet.
    case 'place':
      return {
        kind: 'itinerary',
        destination: { label: result.label, coordinates: result.coordinates },
      };
    default:
      return null;
  }
}
