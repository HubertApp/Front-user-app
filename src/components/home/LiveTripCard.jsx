import { memo } from 'react';
import TransportIcon from '../ui/TransportIcon';

const LiveTripCard = memo(function LiveTripCard({ from, to, departure, arrival, duration, modes, address, onTrack }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-4 text-white"
      style={{ background: 'linear-gradient(135deg, #0E1A24 0%, #1B2D3D 100%)' }}
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, var(--color-teal) 0%, transparent 60%)',
        }}
      />

      <div className="relative flex items-center gap-2.5">
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#43E5A0]"
          style={{ boxShadow: '0 0 0 4px rgba(67,229,160,0.20)' }}
        />
        <p className="eyebrow !text-[#9AAAB6] !text-[10px]">En cours · Trajet du matin</p>
      </div>

      <div className="relative flex items-end gap-3 mt-3">
        <div className="flex-1">
          <p className="font-bold text-[17px] tracking-tight">
            {from} → {to}
          </p>
          <p className="text-xs text-[#9AAAB6] mt-1">
            Départ {departure} · Arrivée prévue {arrival}
            {address ? ` · ${address}` : ''}
          </p>
        </div>
        <button
          onClick={onTrack}
          className="pressable h-9 px-3.5 bg-teal text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
        >
          Suivre
          <i className="fa-solid fa-chevron-right text-[10px]" />
        </button>
      </div>

      <div className="relative mt-3.5 flex items-center gap-2">
        {modes.map((m, i) => (
          <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
            <TransportIcon mode={m} size="sm" className="!bg-white/10 !text-white" />
            {i < modes.length - 1 && (
              <span className="flex-1 h-0 border-t-[1.5px] border-dashed border-white/20" />
            )}
          </div>
        ))}
        <span className="ml-1.5 font-mono text-[11px] font-semibold bg-white/10 px-2 py-1 rounded-lg tabular">
          {duration}
        </span>
      </div>
    </div>
  );
});

export default LiveTripCard;
