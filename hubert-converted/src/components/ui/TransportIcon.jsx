const MODE_META = {
  walk:  { icon: 'fa-person-walking', label: 'Marche' },
  bus:   { icon: 'fa-bus-simple',     label: 'Bus' },
  tram:  { icon: 'fa-train-tram',     label: 'Tram' },
  train: { icon: 'fa-train',          label: 'Train' },
  plane: { icon: 'fa-plane',          label: 'Avion' },
  car:   { icon: 'fa-car-side',       label: 'Voiture' },
  bike:  { icon: 'fa-bicycle',        label: 'Vélo' },
};

const SIZES = {
  xs: 'w-6 h-6 text-[11px] rounded-lg',
  sm: 'w-8 h-8 text-xs rounded-[10px]',
  md: 'w-10 h-10 text-sm rounded-xl',
  lg: 'w-14 h-14 text-base rounded-2xl',
};

export default function TransportIcon({ mode, size = 'md', className = '' }) {
  const { icon } = MODE_META[mode] ?? MODE_META.walk;
  return (
    <span
      className={`${SIZES[size]} bg-teal-soft text-teal-hover inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <i className={`fa-solid ${icon}`} />
    </span>
  );
}

export { MODE_META };
