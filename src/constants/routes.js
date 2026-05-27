export const ROUTES = {
  home:      '/',
  favorites: '/favoris',
  traffic:   '/trafic',
  travels:   '/voyages',
  account:   '/compte',
  search:    '/recherche',
};

export const NAV_ITEMS = [
  { to: ROUTES.home,      label: 'Accueil', icon: 'fa-house' },
  { to: ROUTES.favorites, label: 'Favoris', icon: 'fa-heart' },
  { to: ROUTES.traffic,   label: 'Trafic',  icon: 'fa-tower-broadcast' },
  { to: ROUTES.travels,   label: 'Voyages', icon: 'fa-suitcase-rolling' },
  { to: ROUTES.account,   label: 'Compte',  icon: 'fa-user' },
];
