export default function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 w-32 h-32 transition-all cursor-pointer ${
        active
          ? 'bg-white border-2 border-teal shadow-md'
          : 'bg-white border-2 border-transparent hover:border-teal/30 hover:shadow-sm'
      }`}
    >
      <img src={icon} alt={label} className="w-14 h-14 object-contain" loading="lazy" />
      <span className="text-xs font-bold text-gray-900 text-center leading-tight">{label}</span>
    </button>
  );
}
