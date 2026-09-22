import TravelStep from './TravelStep';

export default function TravelCard({ title, date, status, distance, duration, steps = [], isOpen, onToggle }) {
  const isActive = status === 'active';

  return (
    <div
      className={`bg-white rounded-2xl border border-line overflow-hidden ${
        isOpen ? '' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className="pressable w-full flex items-center gap-3.5 p-4 text-left"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-[22px] shrink-0"
          style={
            isActive
              ? { background: 'linear-gradient(135deg, #F1E9D8, #E1D7C0)', color: '#0E1A24' }
              : { background: 'linear-gradient(135deg, #F1F2F4, #E6E7EA)', color: '#94A3B8' }
          }
        >
          <i className={`fa-solid ${isActive ? 'fa-paper-plane' : 'fa-check'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold tracking-tight text-ink truncate">{title}</p>
          <div className="text-[11.5px] text-muted mt-1 flex items-center gap-2">
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                isActive ? 'bg-teal-soft text-teal-hover' : 'bg-line-soft text-soft'
              }`}
            >
              {isActive ? 'EN COURS' : 'TERMINÉ'}
            </span>
            <span>{date}</span>
            <span className="text-line">•</span>
            <span>{distance}</span>
          </div>
        </div>
        <span
          className={`w-8 h-8 rounded-full bg-line-soft text-ink flex items-center justify-center text-[11px] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <i className="fa-solid fa-chevron-down" />
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-4 border-t border-dashed border-line" style={{ background: '#FBFBF9' }}>
          <div className="flex gap-1.5 py-3.5">
            <span className="font-mono text-[10.5px] px-2 py-1 bg-white border border-line rounded-lg text-ink-2 font-semibold">
              {steps.length} étapes
            </span>
            <span className="font-mono text-[10.5px] px-2 py-1 bg-white border border-line rounded-lg text-ink-2 font-semibold">
              {duration}
            </span>
            <span className="font-mono text-[10.5px] px-2 py-1 bg-white border border-line rounded-lg text-ink-2 font-semibold">
              {distance}
            </span>
          </div>

          {steps.map((s, i) => (
            <TravelStep key={i} {...s} isLast={i === steps.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}
