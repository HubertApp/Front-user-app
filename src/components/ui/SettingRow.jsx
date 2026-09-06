export function SettingRow({ icon, label, sub, trailing, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-3.5 ${onClick ? 'pressable' : ''}`}
    >
      <span className="w-8 h-8 rounded-[10px] bg-teal-soft text-teal-hover inline-flex items-center justify-center text-[13px] shrink-0">
        <i className={`fa-solid ${icon}`} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink">{label}</p>
        {sub && <p className="text-[11.5px] text-muted mt-0.5">{sub}</p>}
      </div>
      {trailing}
    </div>
  );
}

export function SettingsSection({ title, children }) {
  return (
    <section className="mb-5">
      <h4 className="h-section mb-2 px-1">{title}</h4>
      <div className="bg-warm-card rounded-2xl border border-line divide-y divide-line-soft overflow-hidden">
        {children}
      </div>
    </section>
  );
}
