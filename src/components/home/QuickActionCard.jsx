import { useNavigate } from 'react-router-dom';

export default function QuickActionCard({ title, image, to = '#', wide = false }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => to !== '#' && navigate(to)}
      className={`flex flex-col items-center justify-center bg-white text-gray-900 rounded-2xl p-4 gap-2 hover:bg-gray-50 active:scale-95 transition-all duration-150 shadow-sm ${
        wide ? 'h-28' : 'h-28'
      }`}
    >
      <img src={image} alt={title} className="w-11 h-11 object-contain" loading="lazy" />
      <span className="text-xs font-semibold text-center leading-tight text-gray-800">{title}</span>
    </button>
  );
}
