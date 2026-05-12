export default function SearchBar({
  value = '',
  onChange,
  onFocus,
  onClick,
  placeholder = 'Un pays, une destination...',
  icon = 'fa-map-location-dot',
  readOnly = false,
  className = '',
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onFocus={onFocus}
        onClick={onClick}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full h-14 pl-5 pr-16 bg-white text-gray-900 rounded-xl text-sm font-medium outline-none placeholder-gray-400 shadow-lg cursor-pointer"
      />
      <button
        type="button"
        className="absolute right-0 top-0 h-14 w-14 flex items-center justify-center bg-teal rounded-r-xl hover:bg-teal-hover transition-colors"
        tabIndex={-1}
      >
        <i className={`fa-solid ${icon} text-white text-base`} />
      </button>
    </div>
  );
}
