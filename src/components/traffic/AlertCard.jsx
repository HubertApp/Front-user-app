const ICONS = {
  road: 'fa-triangle-exclamation',
  train: 'fa-train',
  bus: 'fa-bus',
};

export default function AlertCard({ type, title, description, delay }) {
  return (
    <div className="bg-white rounded-2xl p-4 text-gray-900 shadow-sm">
      <div className="flex gap-3 items-start">
        <div className="text-orange-500 shrink-0 mt-0.5">
          <i className={`fa-solid ${ICONS[type] ?? 'fa-circle-info'} text-2xl`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm mb-1">{title}</p>
          <p className="text-gray-600 text-sm leading-snug">{description}</p>
        </div>
      </div>
      {delay && (
        <div className="mt-3 flex justify-end">
          <span className="text-orange-500 font-bold text-sm bg-orange-50 px-3 py-1 rounded-full">{delay}</span>
        </div>
      )}
    </div>
  );
}
