import { useNavigate } from 'react-router-dom';
import TransportIcon from '../ui/TransportIcon';
import EndpointDot from '../ui/EndpointDot';

export default function FrequentRouteRow({ from, to, modes = [], meta, when, to: routeTo, onClick }) {
  // note: `to` from props collides with route destination; we use both meanings
  // - `to` is the destination label
  // - `routeTo` is the link path
  const navigate = useNavigate();
  const handle = onClick ?? (() => routeTo && navigate(routeTo));

  return (
    <div
      onClick={handle}
      className="pressable flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-line hover:border-ink/30 transition-colors"
    >
      <div className="flex flex-col items-center gap-1">
        <EndpointDot kind="start" />
        <span className="w-px h-3.5 bg-soft" />
        <EndpointDot kind="end" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-ink leading-tight truncate">{from}</p>
        <p className="text-sm font-bold text-ink leading-tight truncate mt-1">{to}</p>
        {meta && <p className="text-[11px] text-muted mt-1.5">{meta}</p>}
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex gap-1">
          {modes.map((m, i) => (
            <TransportIcon key={i} mode={m} size="xs" />
          ))}
        </div>
        {when && (
          <span className="text-[10px] text-soft uppercase tracking-wider font-semibold">
            {when}
          </span>
        )}
      </div>
    </div>
  );
}
