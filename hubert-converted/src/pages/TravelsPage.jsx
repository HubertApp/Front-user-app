import { useState, useMemo } from 'react';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import TravelCard from '../components/travels/TravelCard';
import { myTravels } from '../data/mock';

const FILTERS = [
  { key: 'all',    label: 'Tous' },
  { key: 'active', label: 'En cours' },
  { key: 'done',   label: 'Terminés' },
];

export default function TravelsPage() {
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(1);

  const filtered = useMemo(
    () => (filter === 'all' ? myTravels : myTravels.filter(t => t.status === filter)),
    [filter],
  );

  const counts = useMemo(
    () => ({
      all: myTravels.length,
      active: myTravels.filter(t => t.status === 'active').length,
      done: myTravels.filter(t => t.status === 'done').length,
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-warm-bg text-ink md:pl-64 pb-28 md:pb-12">
      <div className="max-w-2xl mx-auto px-5 md:px-8">
        <PageHeader
          eyebrow="Historique & en cours"
          title="Mes voyages"
          action={
            <button
              className="pressable w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center"
              aria-label="Nouveau voyage"
            >
              <i className="fa-solid fa-plus text-[13px]" />
            </button>
          }
        />

        {/* Filter chips */}
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`h-9 px-3.5 rounded-xl text-[12.5px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors border ${
                  active
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-muted border-line hover:border-ink/30'
                }`}
              >
                {f.label}
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    active ? 'bg-white/15 text-white' : 'bg-line-soft text-muted'
                  }`}
                >
                  {counts[f.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2.5">
          {filtered.map(t => (
            <TravelCard
              key={t.id}
              {...t}
              isOpen={openId === t.id}
              onToggle={() => setOpenId(prev => (prev === t.id ? null : t.id))}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-16 text-muted gap-3">
            <div className="w-16 h-16 bg-line-soft rounded-full flex items-center justify-center">
              <i className="fa-solid fa-route text-2xl text-teal" />
            </div>
            <p className="text-sm font-medium">Aucun voyage dans cette catégorie</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
