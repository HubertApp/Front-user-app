import { MODE_META } from '../ui/TransportIcon';
import RouteBadge, { modeForRouteType } from './RouteBadge';

function formatDistance(meters) {
  if (meters == null) return null;
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}

export default function StopCard({ name, distanceMeters, network, routes = [], onClick }) {
  const primaryType = routes.find(r => r.type != null)?.type;
  const { icon, label } = MODE_META[modeForRouteType(primaryType)];
  const distance = formatDistance(distanceMeters);

  // Un arrêt trouvé par recherche n'a pas de distance : la recherche porte sur
  // tous les réseaux, et c'est alors la ville qui distingue deux homonymes.
  const context = distance ? `à ${distance}` : network?.cityOrRegion;

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
            {label}{context ? ` · ${context}` : ''}
          </span>
          <span className="text-sm font-bold text-ink tracking-tight truncate">{name}</span>
        </div>
      </div>

      {routes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-dashed border-line">
          {routes.map(route => (
            <RouteBadge key={route.id} route={route} />
          ))}
        </div>
      )}
    </button>
  );
}
