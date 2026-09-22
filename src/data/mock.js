export const favoriteRoutes = [
  {
    id: 1,
    from: 'Maison',
    to: 'Travail',
    toAddress: '5 Place de la République, Metz',
    departureTime: '07:00',
    arrivalTime: '08:50',
    duration: '1h50',
    modes: ['walk', 'tram', 'walk'],
    isFavorited: true,
  },
  {
    id: 2,
    from: 'Maison',
    to: '12 rue des monstres',
    toAddress: '12 rue des monstres, Metz',
    departureTime: '07:00',
    arrivalTime: '07:20',
    duration: '0h20',
    modes: ['car'],
    isFavorited: true,
  },
  {
    id: 3,
    from: 'Maison',
    to: 'KineBowl',
    toAddress: 'KineBowl, Metz',
    departureTime: '07:00',
    arrivalTime: '07:20',
    duration: '0h20',
    modes: ['bus', 'walk'],
    isFavorited: true,
  },
];

export const trafficAlerts = [
  {
    id: 1,
    severity: 'medium',
    type: 'road',
    title: 'Travaux rue des Potiers',
    description: 'Sur votre trajet "Maison → Travail". Déviation conseillée par la rue Mazelle.',
    delay: '+05 min',
    ts: 'il y a 12 min',
    affects: 'Maison → Travail',
  },
  {
    id: 2,
    severity: 'severe',
    type: 'train',
    title: 'TER 88622 Luxembourg → Nancy',
    description: 'Animal sur les voies à hauteur de Thionville. Trafic interrompu temporairement.',
    delay: '+25 min',
    ts: 'il y a 4 min',
    affects: 'Ligne Metz — Luxembourg',
  },
  {
    id: 3,
    severity: 'minor',
    type: 'tram',
    title: 'Ligne A — Régulation',
    description: 'Cadence réduite ce matin entre Woippy et République. Comptez quelques minutes de plus.',
    delay: '+02 min',
    ts: 'il y a 18 min',
    affects: 'Tram A',
  },
];

export const myTravels = [
  {
    id: 1,
    title: 'Consulat Algérie',
    date: '19/03/2025',
    status: 'active',
    distance: '4,2 km',
    duration: '24 min',
    steps: [
      { mode: 'walk', time: '06:30', address: '8 rue des Potiers', city: 'Metz', region: 'Grand Est', duration: '10 min' },
      { mode: 'bus',  time: '06:42', address: 'Arrêt République',  city: 'Metz', region: 'Grand Est', duration: '08 min' },
      { mode: 'walk', time: '06:54', address: '10 rue Fabert',     city: 'Metz', region: 'Grand Est', duration: '06 min' },
    ],
  },
  {
    id: 2,
    title: 'Strasbourg — Week-end',
    date: '10/04/2024',
    status: 'done',
    distance: '162 km',
    duration: '1h45',
    steps: [
      { mode: 'walk',  time: '08:50', address: '8 rue des Potiers',   city: 'Metz',       region: 'Grand Est', duration: '08 min' },
      { mode: 'train', time: '09:00', address: 'Gare de Metz',         city: 'Metz → Strasbourg', region: 'TER 88401', duration: '1h30' },
      { mode: 'walk',  time: '10:30', address: 'Gare de Strasbourg',  city: 'Strasbourg', region: 'Grand Est', duration: '05 min' },
    ],
  },
  {
    id: 3,
    title: 'Aéroport Charles-de-Gaulle',
    date: '02/06/2024',
    status: 'done',
    distance: '378 km',
    duration: '3h12',
    steps: [
      { mode: 'car',  time: '05:15', address: 'Domicile',     city: 'Metz → Paris CDG', region: 'A4',             duration: '3h00' },
      { mode: 'walk', time: '08:15', address: 'Terminal 2E',  city: 'Roissy',           region: 'Île-de-France', duration: '12 min' },
    ],
  },
];

export const autocompleteResults = [
  { id: 1, name: 'Metz Ville',   region: 'Grand Est', type: 'station'  },
  { id: 2, name: 'Metz Centre',  region: 'Grand Est', type: 'station'  },
  { id: 3, name: 'Metz Nord',    region: 'Grand Est', type: 'station'  },
  { id: 4, name: 'Metz Sablon',  region: 'Grand Est', type: 'station'  },
  { id: 5, name: 'Metz-Borny',   region: 'Grand Est', type: 'city'     },
  { id: 6, name: 'Metz-Queuleu', region: 'Grand Est', type: 'district' },
];

export const itinerarySteps = [
  { mode: 'walk', address: '8 rue des Potiers', city: 'Metz — Grand Est',    duration: '10 min', when: '07:00' },
  { mode: 'bus',  address: 'Arrêt République',  city: 'Bus n°1 vers Centre', duration: '08 min', when: '07:12' },
  { mode: 'tram', address: 'République → Gare', city: 'Tram A',              duration: '06 min', when: '07:23' },
  { mode: 'walk', address: 'Gare de Metz',      city: 'Metz — Grand Est',    duration: '03 min', when: '07:32' },
];

export const savedPlaces = [
  { id: 1, label: 'Maison',  icon: 'fa-house',     address: '12 rue des potiers, Metz' },
  { id: 2, label: 'Travail', icon: 'fa-briefcase', address: '5 Place de la République, Metz' },
  { id: 3, label: 'Gym',     icon: 'fa-dumbbell',  address: 'KineBowl, Metz' },
];
