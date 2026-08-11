import { MODE_META } from '../ui/TransportIcon';

// route_type GTFS → mode connu de MODE_META. Au-delà de 3 (ferry, funiculaire,
// téléphérique…) on retombe sur l'icône bus faute de pictogramme dédié.
const GTFS_TYPE_TO_MODE = {
  0: 'tram',
  1: 'tram',
  2: 'train',
  3: 'bus',
};

function formatDistance(meters) {
  if (meters == null) return null;
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}

export default function StopCard({ name, distanceMeters, routes = [], onClick }) {
  const primaryType = routes.find(r => r.type != null)?.type;
  const mode = GTFS_TYPE_TO_MODE[primaryType] ?? 'bus';
  const { icon, label } = MODE_META[mode];
  const distance = formatDistance(distanceMeters);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl p-3.5 border border-line pressable"
    >
      <div className="flex gap-3 items-center">
        <span className="w-10 h-10 rounded-xl bg-teal-soft text-teal-hover inline-flex items-center justify-center text-base shrink-0">
          <i className={`fa-solid ${icon}`} />
        </span>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[11px] text-soft font-mono uppercase">
            {label}{distance ? ` · à ${distance}` : ''}
          </span>
          <span className="text-sm font-bold text-ink tracking-tight truncate">{name}</span>
        </div>
      </div>

      {routes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-dashed border-line">
          {routes.map(route => (
            <span
              key={route.id}
              className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-teal-soft text-teal-hover"
              style={route.color ? { backgroundColor: `#${route.color}`, color: `#${route.textColor || 'FFFFFF'}` } : undefined}
              title={route.longName || undefined}
            >
              {route.shortName || route.longName || route.id}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
