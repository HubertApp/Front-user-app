import { useNavigate } from 'react-router-dom';

export default function BackBar({ to, label = 'Retour' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="pressable inline-flex items-center gap-2 h-11 -ml-1 px-1 text-[13px] font-semibold text-muted hover:text-ink transition-colors mt-4"
      aria-label={label}
    >
      <span className="w-8 h-8 rounded-full border border-line bg-white flex items-center justify-center shrink-0">
        <i className="fa-solid fa-chevron-left text-[12px]" />
      </span>
      {label}
    </button>
  );
}
