const TYPE_ICON = {
  road:  'fa-triangle-exclamation',
  train: 'fa-train',
  tram:  'fa-train-tram',
  bus:   'fa-bus-simple',
};

const SEVERITY_CLS = {
  severe: { ic: 'bg-danger-soft text-danger',  pill: 'bg-danger-soft text-danger'  },
  medium: { ic: 'bg-warning-soft text-warning', pill: 'bg-warning-soft text-warning' },
  minor:  { ic: 'bg-teal-soft text-teal-hover', pill: 'bg-teal-soft text-teal-hover' },
};

export default function AlertCard({ severity = 'medium', type, title, description, delay, ts, affects }) {
  const cls = SEVERITY_CLS[severity];

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-line">
      <div className="flex gap-3 items-center mb-2.5">
        <span className={`w-10 h-10 rounded-xl inline-flex items-center justify-center text-base shrink-0 ${cls.ic}`}>
          <i className={`fa-solid ${TYPE_ICON[type] || 'fa-circle-info'}`} />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] text-soft font-mono uppercase">
            {ts}{affects ? ` · ${affects}` : ''}
          </span>
          <span className="text-sm font-bold text-ink tracking-tight truncate">{title}</span>
        </div>
      </div>
      <p className="text-[13px] text-muted leading-snug">{description}</p>
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-dashed border-line">
        {delay && (
          <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg ${cls.pill}`}>
            {delay}
          </span>
        )}
        <button className="text-[12px] font-semibold text-teal-hover hover:underline ml-auto">
          Voir le détail <i className="fa-solid fa-arrow-right text-[9px] ml-0.5" />
        </button>
      </div>
    </div>
  );
}
