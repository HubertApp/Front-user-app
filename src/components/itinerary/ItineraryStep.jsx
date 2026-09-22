import TransportIcon, { MODE_META } from '../ui/TransportIcon';

export default function ItineraryStep({ mode, address, city, duration, when, isLast }) {
  const meta = MODE_META[mode];
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-0.5">
        <TransportIcon mode={mode} size="sm" />
        {!isLast && <div className="w-px flex-1 bg-line my-1.5 min-h-4 rounded-full" />}
      </div>
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <span className="text-[10px] tracking-widest font-bold uppercase text-teal-hover">
            {meta?.label || mode}
          </span>
          {when && <span className="text-[11px] text-muted font-mono">{when}</span>}
        </div>
        <p className="text-[13.5px] font-semibold text-ink">{address}</p>
        {city && <p className="text-[11.5px] text-muted mt-0.5">{city}</p>}
        {duration && (
          <span className="inline-block mt-1.5 text-[11px] text-ink-2 bg-line-soft px-2 py-0.5 rounded-md font-mono font-semibold">
            {duration}
          </span>
        )}
      </div>
    </div>
  );
}
