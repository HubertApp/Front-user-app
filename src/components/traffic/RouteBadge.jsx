// route_type GTFS → mode connu de MODE_META. Au-delà de 3 (ferry, funiculaire,
// téléphérique…) on retombe sur l'icône bus faute de pictogramme dédié.
const GTFS_TYPE_TO_MODE = {
  0: 'tram',
  1: 'tram',
  2: 'train',
  3: 'bus',
};

export function modeForRouteType(type) {
  return GTFS_TYPE_TO_MODE[type] ?? 'bus';
}

// Pastille d'une ligne, aux couleurs du GTFS quand le réseau les fournit.
// Partagée par la carte d'arrêt et la fiche d'arrêt, pour qu'une même ligne
// se reconnaisse d'un écran à l'autre.
export default function RouteBadge({ route }) {
  return (
    <span
      className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-teal-soft text-teal-hover"
      style={route.color ? { backgroundColor: `#${route.color}`, color: `#${route.textColor || 'FFFFFF'}` } : undefined}
      title={route.longName || undefined}
    >
      {route.shortName || route.longName || route.id}
    </span>
  );
}
