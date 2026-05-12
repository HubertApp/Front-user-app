const MODES = {
  walk:  { icon: 'fa-person-walking', color: 'text-blue-400',  bg: 'bg-blue-400/10' },
  bus:   { icon: 'fa-bus',            color: 'text-blue-400',  bg: 'bg-blue-400/10' },
  tram:  { icon: 'fa-train-tram',     color: 'text-purple-400',bg: 'bg-purple-400/10' },
  train: { icon: 'fa-train',          color: 'text-blue-400',  bg: 'bg-blue-400/10' },
  plane: { icon: 'fa-plane',          color: 'text-sky-400',   bg: 'bg-sky-400/10' },
  car:   { icon: 'fa-car',            color: 'text-teal',      bg: 'bg-teal/10' },
  bike:  { icon: 'fa-bicycle',        color: 'text-green-400', bg: 'bg-green-400/10' },
};

const SIZES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export default function TransportIcon({ mode, size = 'md' }) {
  const { icon, color, bg } = MODES[mode] ?? MODES.walk;
  return (
    <div className={`${SIZES[size]} ${bg} ${color} rounded-full flex items-center justify-center shrink-0`}>
      <i className={`fa-solid ${icon}`} />
    </div>
  );
}
