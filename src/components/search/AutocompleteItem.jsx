const TYPE_ICON = {
  city:     'fa-city',
  station:  'fa-train-subway',
  district: 'fa-map-pin',
};

export default function AutocompleteItem({ name, region, type, sub, icon, onClick }) {
  const ic = icon || TYPE_ICON[type] || 'fa-location-dot';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-line-soft transition-colors text-left group cursor-pointer"
    >
      <span className="w-9 h-9 bg-teal-soft text-teal-hover rounded-xl flex items-center justify-center shrink-0 text-[13px]">
        <i className={`fa-solid ${ic}`} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink truncate">{name}</p>
        <p className="text-[11.5px] text-muted mt-0.5 truncate">{sub || `${region || ''}${type ? ` · ${type}` : ''}`}</p>
      </div>
      <i className="fa-solid fa-arrow-up-left text-soft text-[11px] opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
