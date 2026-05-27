import { useState } from 'react';
import TransportIcon, { MODE_META } from '../ui/TransportIcon';

export default function FavoriteCard({ from, to, toAddress, modes = [], departureTime, arrivalTime, duration, isFavorited = true }) {
  const [fav, setFav] = useState(isFavorited);

  return (
    <div
      className="shrink-0 snap-start w-60 bg-white rounded-2xl p-4 flex flex-col gap-3"
      style={{
        boxShadow:
          '0 1px 2px rgba(15,26,36,0.04), 0 12px 30px -16px rgba(15,26,36,0.18)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[15px] font-bold tracking-tight leading-tight">
            {from} <span className="text-soft mx-0.5">→</span> {to}
          </p>
          <p className="text-[11px] text-muted mt-0.5 truncate">{toAddress}</p>
        </div>
        <button
          onClick={() => setFav(f => !f)}
          className={`pressable w-8 h-8 rounded-[10px] flex items-center justify-center border-none ${
            fav ? 'bg-danger-soft text-danger' : 'bg-line-soft text-soft'
          }`}
          aria-label="Favori"
        >
          <i className={`fa-${fav ? 'solid' : 'regular'} fa-heart`} />
        </button>
      </div>

      <div className="flex gap-1.5">
        {modes.map((m, i) => (
          <span
            key={i}
            className="w-7 h-7 rounded-[9px] bg-line-soft text-ink-2 inline-flex items-center justify-center text-[11.5px]"
          >
            <i className={`fa-solid ${MODE_META[m]?.icon || 'fa-route'}`} />
          </span>
        ))}
      </div>

      <div className="flex items-end gap-2 border-t border-line-soft pt-2.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-soft uppercase tracking-wider font-semibold">Départ</span>
          <span className="text-[13.5px] font-bold tabular">{departureTime}</span>
        </div>
        <div className="flex-1 h-0 border-t border-dashed border-line mx-2 mb-2.5" />
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-soft uppercase tracking-wider font-semibold">Arrivée</span>
          <span className="text-[13.5px] font-bold tabular">{arrivalTime}</span>
        </div>
        <span className="ml-auto font-mono text-[11px] font-semibold bg-ink text-white px-2 py-1 rounded-[9px]">
          {duration}
        </span>
      </div>
    </div>
  );
}
