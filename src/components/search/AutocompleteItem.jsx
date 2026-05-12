const TYPE_ICON = { city: 'fa-city', station: 'fa-train-subway', district: 'fa-map-pin' };

export default function AutocompleteItem({ name, region, type, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer text-left group hover:bg-gray-100"
    >
      <div className="w-9 h-9 bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded-xl flex items-center justify-center shrink-0 transition-colors">
        <i className={`fa-solid ${TYPE_ICON[type] ?? 'fa-location-dot'} text-teal text-sm`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#0f172a] text-sm font-semibold">{name}</p>
        <p className="text-[#64748b] text-xs mt-0.5">{region}</p>
      </div>
      <i className="fa-solid fa-arrow-up-left text-[#94a3b8] text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
