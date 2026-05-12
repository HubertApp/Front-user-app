import TransportIcon from '../ui/TransportIcon';

const MODE_LABEL = {
  walk: 'Marche', bus: 'Bus', tram: 'Tram',
  train: 'Train', plane: 'Avion', car: 'Voiture', bike: 'Vélo',
};

export default function ItineraryStep({ mode, address, city, duration, isLast }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1">
        <TransportIcon mode={mode} size="sm" />
        {!isLast && <div className="w-0.5 flex-1 bg-[#e2e8f0] my-1.5 min-h-5" />}
      </div>
      <div className="flex-1 pb-3">
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 shadow-sm">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-teal text-xs font-bold uppercase tracking-wider">
              {MODE_LABEL[mode] ?? mode}
            </span>
            <button className="text-teal text-xs font-semibold hover:underline">
              Voir les détails
            </button>
          </div>
          <p className="text-[#0f172a] text-sm font-medium">{address}</p>
          <p className="text-[#64748b] text-xs mt-0.5">{city}</p>
        </div>
        {duration && (
          <p className="text-center text-[#94a3b8] text-xs mt-2 font-medium">{duration}</p>
        )}
      </div>
    </div>
  );
}
