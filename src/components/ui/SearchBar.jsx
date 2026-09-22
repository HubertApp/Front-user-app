export default function SearchBar({
  value = '',
  onChange,
  onFocus,
  onClick,
  placeholder = 'Un pays, une destination...',
  icon = 'fa-magnifying-glass',
  readOnly = false,
  className = '',
}) {
  return (
    <div
      className={`relative w-full h-14 bg-white rounded-2xl flex items-center pl-5 pr-2 gap-3 cursor-pointer ${className}`}
      style={{
        boxShadow:
          '0 1px 2px rgba(15,26,36,0.04), 0 12px 30px -16px rgba(15,26,36,0.18)',
        border: '1px solid rgba(15,26,36,0.04)',
      }}
      onClick={onClick}
    >
      <i className={`fa-solid ${icon} text-soft`} />
      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        readOnly={readOnly}
        className="flex-1 bg-transparent border-none outline-none text-ink text-sm font-medium placeholder-soft min-w-0 cursor-pointer"
      />
      <button
        type="button"
        className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center hover:bg-teal-hover transition-colors"
        tabIndex={-1}
        aria-label="Rechercher"
      >
        <i className="fa-solid fa-arrow-right text-sm" />
      </button>
    </div>
  );
}
