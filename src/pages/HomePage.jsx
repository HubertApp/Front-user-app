import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import SearchBar from '../components/ui/SearchBar';
import QuickActionCard from '../components/home/QuickActionCard';
import HubertLogo from '../components/ui/HubertLogo';

import heart from '../img/heart.png';
import settings from '../img/settings.png';
import luggages from '../img/lugages.png';
import pin from '../img/pin.png';
import bell from '../img/bell.png';
import house from '../img/house.png';

const quickActions = [
  { title: 'Trajet Favoris', image: heart, to: '/favoris' },
  { title: 'Infos Trafic', image: bell, to: '/trafic' },
  { title: 'Mes voyages', image: luggages, to: '/voyages' },
  { title: 'Paramètres', image: settings, to: '/compte' },
];

const frequentRoutes = [
  { title: 'Maison à Travail', image: house, to: '/recherche' },
  { title: 'Organiser un voyage', image: pin, to: '/recherche' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0f172a] flex flex-col md:pl-60">
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-2xl px-5 pt-10 md:pt-14 pb-24 md:pb-10">

          <div className="md:hidden mb-2">
            <HubertLogo />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mt-4 leading-snug max-w-sm text-[#0f172a]">
            C'est pas la destination qui compte, c'est le&nbsp;trajet&nbsp;!
          </h2>

          <div className="mt-6 mb-8">
            <SearchBar
              placeholder="Un pays, une destination..."
              icon="fa-map-location-dot"
              readOnly
              onClick={() => navigate('/recherche')}
            />
          </div>

          <section className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-4">
              En route
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map(action => (
                <QuickActionCard key={action.title} {...action} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-4">
              Les plus utilisés
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {frequentRoutes.map(route => (
                <QuickActionCard key={route.title} {...route} />
              ))}
            </div>
          </section>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
