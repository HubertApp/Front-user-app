import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import AlertCard from '../components/traffic/AlertCard';
import MapView from '../components/map/MapView';
import { trafficAlerts } from '../data/mock';

export default function TrafficPage() {
  const [tab, setTab] = useState('trajets');

  return (
    <div className="min-h-screen bg-warm-bg text-ink md:pl-64 pb-28 md:pb-12">
      <div className="max-w-2xl mx-auto px-5 md:px-8">
        <PageHeader
          eyebrow="Aujourd'hui · 08:14"
          title="Infos trafic"
          action={
            <button
              className="pressable w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center"
              aria-label="Recharger"
            >
              <i className="fa-solid fa-rotate text-[13px]" />
            </button>
          }
        />

        {/* Segmented tabs */}
        <div className="flex bg-white border border-line rounded-2xl p-1 gap-1 mb-4">
          <button
            onClick={() => setTab('trajets')}
            className={`flex-1 h-10 rounded-xl text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-all ${
              tab === 'trajets'
                ? 'bg-ink text-white shadow-md'
                : 'text-muted hover:text-ink'
            }`}
          >
            <i className="fa-solid fa-route text-[11px]" />
            Mes trajets
          </button>
          <button
            onClick={() => setTab('position')}
            className={`flex-1 h-10 rounded-xl text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-all ${
              tab === 'position'
                ? 'bg-ink text-white shadow-md'
                : 'text-muted hover:text-ink'
            }`}
          >
            <i className="fa-solid fa-location-dot text-[11px]" />
            Ma position
          </button>
        </div>

        {tab === 'trajets' ? (
          <>
            {/* Summary banner */}
            <div className="flex items-center gap-3 p-3.5 bg-white border border-line rounded-2xl mb-3">
              <span className="w-9 h-9 rounded-xl bg-warning-soft text-warning inline-flex items-center justify-center text-[13px]">
                <i className="fa-solid fa-triangle-exclamation" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-ink">
                  3 perturbations sur vos trajets
                </p>
                <p className="text-[11px] text-muted mt-0.5">
                  Délai cumulé estimé : <b className="text-ink">+32 min</b>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {trafficAlerts.map(a => (
                <AlertCard key={a.id} {...a} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="relative h-56 rounded-2xl overflow-hidden border border-line mb-3">
              <MapView withRoute={false} withPin />
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-white border border-line rounded-2xl mb-3">
              <span className="w-10 h-10 rounded-xl bg-teal-soft text-teal-hover inline-flex items-center justify-center text-base">
                <i className="fa-solid fa-location-crosshairs" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-bold text-ink">Centre-ville de Metz</p>
                <p className="text-[11.5px] text-muted mt-0.5">Rayon d'analyse : 1,2 km</p>
              </div>
              <button className="pressable w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center text-[12px]">
                <i className="fa-solid fa-sliders" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {trafficAlerts.slice(0, 2).map(a => (
                <AlertCard key={a.id} {...a} affects={`À 280 m · ${a.affects}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
