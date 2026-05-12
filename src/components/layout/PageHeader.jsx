import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, onBack }) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <div className="flex items-center gap-3 py-4">
      <button
        onClick={handleBack}
        className="w-9 h-9 flex items-center justify-center border border-[#e2e8f0] rounded-full hover:bg-[#f1f5f9] transition-colors shrink-0"
        aria-label="Retour"
      >
        <i className="fa-solid fa-chevron-left text-sm text-[#64748b]" />
      </button>
      <h1 className="text-xl font-semibold flex-1 text-center pr-9 text-[#0f172a]">{title}</h1>
    </div>
  );
}
