import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import TabButton from '../components/traffic/TabButton';
import AlertCard from '../components/traffic/AlertCard';
import BottomNav from '../components/layout/BottomNav';
import car from '../img/car.png';
import target from '../img/target.png';
import { trafficAlerts } from '../data/mock';

export default function TrafficPage() {
  const [activeTab, setActiveTab] = useState('trajets');

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0f172a] md:pl-60">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24 md:pb-10">
        <PageHeader title="Infos Trafic" />

        <div className="mt-4 bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
          {/* Tabs */}
          <div className="flex justify-center gap-6 p-6 border-b border-[#e2e8f0]">
            <TabButton
              icon={car}
              label="Mes trajets"
              active={activeTab === 'trajets'}
              onClick={() => setActiveTab('trajets')}
            />
            <TabButton
              icon={target}
              label="Ma position"
              active={activeTab === 'position'}
              onClick={() => setActiveTab('position')}
            />
          </div>

          {/* Content */}
          <div className="p-4">
            {activeTab === 'trajets' ? (
              <div className="flex flex-col gap-3">
                {trafficAlerts.map(alert => (
                  <AlertCard key={alert.id} {...alert} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-[#64748b] gap-3">
                <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-location-dot text-2xl text-teal" />
                </div>
                <p className="text-sm font-medium text-[#0f172a]">Géolocalisation en cours…</p>
                <p className="text-xs text-[#94a3b8] text-center max-w-xs">
                  Autorisez l'accès à votre position pour voir les perturbations autour de vous.
                </p>
                <button className="mt-2 px-5 py-2.5 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-hover transition-colors">
                  Activer la géolocalisation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
