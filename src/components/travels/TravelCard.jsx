import { useState } from 'react';
import TravelStep from './TravelStep';

export default function TravelCard({ title, date, status, steps = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
            <i className="fa-solid fa-route text-gray-600 text-base" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{title}</p>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-0.5">
              <i className="fa-regular fa-calendar" />
              <span>{date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {status === 'done' && (
            <span className="text-xs text-gray-400 font-medium">Terminé</span>
          )}
          <i
            className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
          {steps.map((step, i) => (
            <TravelStep key={i} {...step} isLast={i === steps.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}
