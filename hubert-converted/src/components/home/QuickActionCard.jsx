import { useNavigate } from 'react-router-dom';

const TONES = {
  default: 'bg-teal-soft text-teal-hover',
  coral:   'bg-[#FCE2DC] text-[#BB4A3C]',
  amber:   'bg-[#F8E5C2] text-[#976618]',
  lilac:   'bg-[#E5DEF7] text-[#5B4DA0]',
};

export default function QuickActionCard({ title, icon, tone = 'default', to = '#', sub }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => to !== '#' && navigate(to)}
      className="pressable flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-line p-3.5 text-center hover:border-ink/30 transition-colors"
    >
      <span className={`w-10 h-10 rounded-xl inline-flex items-center justify-center text-base ${TONES[tone] || TONES.default}`}>
        <i className={`fa-solid ${icon}`} />
      </span>
      <span className="text-[11.5px] font-semibold text-ink leading-tight">{title}</span>
      {sub && <span className="text-[10px] text-muted -mt-1">{sub}</span>}
    </button>
  );
}
