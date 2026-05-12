export const favoriteRoutes = [
  {
    id: 1,
    from: 'Maison',
    to: 'Travail',
    toAddress: '5 Place de la République',
    departureTime: '7h00',
    arrivalTime: '8h50',
    duration: '1h50',
    mode: 'mixed',
    isFavorited: true,
  },
  {
    id: 2,
    from: 'Maison',
    to: '12 rue des monstres',
    toAddress: '12 rue des monstres, Metz',
    departureTime: '7h00',
    arrivalTime: '7h20',
    duration: '0h20',
    mode: 'car',
    isFavorited: true,
  },
  {
    id: 3,
    from: 'Maison',
    to: 'KineBowl',
    toAddress: 'KineBowl, Metz',
    departureTime: '7h00',
    arrivalTime: '7h20',
    duration: '0h20',
    mode: 'car',
    isFavorited: true,
  },
];

export const trafficAlerts = [
  {
    id: 1,
    type: 'road',
    title: 'Perturbations sur la route :',
    description: 'Travaux publique sur le trajet "Travail" à rue des potiers',
    delay: 'Retardé 0H05',
  },
  {
    id: 2,
    type: 'train',
    title: 'Perturbations sur les voies de trains',
    description: 'Train TER n° 88622 Luxembourg => Nancy, animal sur les passages à niveaux',
    delay: 'Retardé 0H25',
  },
];

export const myTravels = [
  {
    id: 1,
    title: 'Consulat Algérie',
    date: '19/03/2025',
    status: 'active',
    steps: [
      { mode: 'walk', time: '06:30 am', address: '8 rue des potiers', city: 'Metz', region: 'Grand Est', duration: '00:10 min' },
      { mode: 'walk', time: '06:40 am', address: '10 rue Fabert', city: 'Metz', region: 'Grand Est', duration: '' },
    ],
  },
  {
    id: 2,
    title: 'Voyage Strasbourg',
    date: '10/04/2024',
    status: 'done',
    steps: [
      { mode: 'train', time: '09:00 am', address: 'Gare de Metz', city: 'Metz', region: 'Grand Est', duration: '01:30' },
      { mode: 'walk', time: '10:30 am', address: 'Gare de Strasbourg', city: 'Strasbourg', region: 'Grand Est', duration: '' },
    ],
  },
];

export const autocompleteResults = [
  { id: 1, name: 'Metz Ville', region: 'Grand Est', type: 'station' },
  { id: 2, name: 'Metz Centre', region: 'Grand Est', type: 'station' },
  { id: 3, name: 'Metz Nord', region: 'Grand Est', type: 'station' },
  { id: 4, name: 'Metz Sablon', region: 'Grand Est', type: 'station' },
  { id: 5, name: 'Metz-Borny', region: 'Grand Est', type: 'city' },
  { id: 6, name: 'Metz-Queuleu', region: 'Grand Est', type: 'district' },
];

export const itinerarySteps = [
  { mode: 'walk', address: '8 rue des potiers', city: 'Metz - Grand Est', duration: '00:10 min' },
  { mode: 'bus', address: '2 boulevards des boulards', city: 'Metz - Grand Est', duration: '02:23 min' },
  { mode: 'plane', address: '45 avenue CharlesPort', city: 'Paris Airport', duration: '1j 4h5min' },
  { mode: 'walk', address: '235th Barber Street', city: 'New York - USA', duration: '00:03 min' },
];

export const savedPlaces = [
  { id: 1, label: 'Maison', icon: 'fa-house', address: '12 rue des potiers, Metz' },
  { id: 2, label: 'Travail', icon: 'fa-briefcase', address: '5 Place de la République, Metz' },
];
