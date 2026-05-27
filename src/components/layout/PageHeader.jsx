import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, eyebrow, action, onBack, hideBack = false }) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <div className="flex items-center gap-3 pt-6 pb-4">
      {!hideBack && (
        <button
          onClick={handleBack}
          className="md:hidden w-10 h-10 flex items-center justify-center border border-line rounded-full hover:bg-line-soft transition-colors shrink-0"
          aria-label="Retour"
        >
          <i className="fa-solid fa-chevron-left text-sm text-muted" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-ink leading-tight">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}
