import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import SearchBar from '../components/ui/SearchBar';
import HubertLogo from '../components/ui/HubertLogo';
import QuickActionCard from '../components/home/QuickActionCard';
import LiveTripCard from '../components/home/LiveTripCard';
import FrequentRouteRow from '../components/home/FrequentRouteRow';

const quickActions = [
  { key: 'favoris', title: 'Favoris',     icon: 'fa-heart',            tone: 'coral', to: '/favoris' },
  { key: 'trafic',  title: 'Trafic',      icon: 'fa-tower-broadcast',  tone: 'amber', to: '/trafic'  },
  { key: 'voyages', title: 'Voyages',     icon: 'fa-suitcase-rolling',                to: '/voyages' },
  { key: 'compte',  title: 'Paramètres',  icon: 'fa-gear',             tone: 'lilac', to: '/compte'  },
];

const frequent = [
  {
    key: 'maison-travail',
    from: 'Maison',
    to:   'Travail',
    modes: ['walk', 'tram', 'walk'],
    meta: 'Part dans 12 min · 24 min de trajet',
    when: 'En 12 min',
  },
  {
    key: 'plan',
    from: 'Organiser',
    to:   'un voyage',
    modes: ['plane'],
    meta: 'Créer un nouveau trajet',
    when: 'Nouveau',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warm-bg text-ink pb-28 md:pb-12 md:pl-64">
      <div className="max-w-2xl mx-auto px-5 md:px-8 pt-12 md:pt-10">

        {/* top bar */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate('/compte')}
            className="pressable w-10 h-10 rounded-full border border-line bg-white flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #FAEFD8, #E6DCC5)' }}
            aria-label="Compte"
          >
            SH
          </button>
          <div className="md:hidden">
            <HubertLogo size="1.7rem" />
          </div>
          <button
            className="pressable relative w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center"
            aria-label="Notifications"
          >
            <i className="fa-regular fa-bell text-[15px] text-ink" />
            <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-danger border-2 border-white" />
          </button>
        </div>

        {/* hero */}
        <div className="mt-6">
          <p className="eyebrow">Bonjour, Hubert</p>
          <h1 className="text-[26px] md:text-[32px] font-bold tracking-tight leading-[1.1] mt-2 max-w-sm">
            C'est pas la destination qui compte, c'est le&nbsp;trajet.
          </h1>
        </div>

        {/* search */}
        <div className="mt-6">
          <SearchBar
            placeholder="Un pays, une destination..."
            readOnly
            onClick={() => navigate('/recherche')}
          />
        </div>

        {/* live trip */}
        <div className="mt-6">
          <LiveTripCard
            from="Maison"
            to="Travail"
            departure="07:00"
            arrival="08:50"
            duration="1h50"
            modes={['walk', 'tram', 'walk']}
            onTrack={() => navigate('/recherche')}
          />
        </div>

        {/* quick actions */}
        <section className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <span className="h-section">En route</span>
            <span className="text-[11px] text-soft font-mono">04</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map(qa => (
              <QuickActionCard key={qa.key} {...qa} />
            ))}
          </div>
        </section>

        {/* frequent */}
        <section className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <span className="h-section">Les plus utilisés</span>
            <button className="text-[11px] font-semibold text-teal-hover">Tout voir</button>
          </div>
          <div className="flex flex-col gap-2">
            {frequent.map(f => (
              <FrequentRouteRow
                key={f.key}
                from={f.from}
                to={f.to}
                modes={f.modes}
                meta={f.meta}
                when={f.when}
                onClick={() => navigate('/recherche')}
              />
            ))}
          </div>
        </section>

      </div>

      <BottomNav />
    </div>
  );
}
