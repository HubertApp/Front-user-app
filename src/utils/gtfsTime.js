// GTFS autorise une heure supérieure à 24 pour les courses qui prolongent le
// service après minuit : « 25:30:00 » désigne 1 h 30 le lendemain. Affichée
// brute, cette valeur ne veut rien dire pour un voyageur — on la ramène dans
// la journée en signalant le passage au lendemain.
const GTFS_TIME = /^(\d{1,2}):([0-5]\d):([0-5]\d)$/;

export function formatGtfsTime(value) {
  const match = GTFS_TIME.exec((value ?? '').trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = match[2];

  return {
    label: `${String(hours % 24).padStart(2, '0')}:${minutes}`,
    nextDay: hours >= 24,
  };
}

// `departures(after:)` attend l'heure locale du réseau au format GTFS. La date
// est injectable pour que les appelants restent testables sans horloge figée.
export function nowAsGtfsTime(date = new Date()) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map(part => String(part).padStart(2, '0'))
    .join(':');
}
