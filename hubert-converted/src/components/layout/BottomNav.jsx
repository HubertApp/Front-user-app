import { NavLink } from 'react-router-dom';
import HubertLogo from '../ui/HubertLogo';

const navItems = [
  { to: '/',         label: 'Accueil',  icon: 'fa-house' },
  { to: '/favoris',  label: 'Favoris',  icon: 'fa-heart' },
  { to: '/trafic',   label: 'Trafic',   icon: 'fa-tower-broadcast' },
  { to: '/voyages',  label: 'Voyages',  icon: 'fa-suitcase-rolling' },
  { to: '/compte',   label: 'Compte',   icon: 'fa-user' },
];

export default function BottomNav() {
  return (
    <>
      {/* Mobile bottom bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-line"
        style={{
          background: 'rgba(246, 247, 244, 0.86)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        }}
      >
        <div className="flex justify-around items-center pt-2.5 pb-6 px-2">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive ? 'text-teal' : 'text-soft hover:text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <i className={`fa-solid ${icon} text-[17px]`} />
                  <span className="text-[10px] font-semibold tracking-wide">{label}</span>
                  <span
                    className={`w-6 h-[3px] rounded-full -mt-0.5 transition-opacity ${
                      isActive ? 'bg-teal opacity-100' : 'opacity-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-line flex-col z-40">
        <div className="px-6 py-7 border-b border-line">
          <HubertLogo sidebarVariant />
          <p className="text-[11px] text-muted mt-2 font-medium">
            Votre compagnon de voyage
          </p>
        </div>

        <div className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                  isActive
                    ? 'bg-ink text-white'
                    : 'text-muted hover:bg-line-soft hover:text-ink'
                }`
              }
            >
              <i className={`fa-solid ${icon} w-4 text-center`} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mx-3 mb-3 p-4 rounded-2xl border border-line bg-warm-bg">
          <p className="eyebrow !text-[10px] !mb-2">Trajet en cours</p>
          <p className="text-[13px] font-bold text-ink">Maison → Travail</p>
          <p className="text-[11px] text-muted mt-0.5">Arrivée prévue 08:50</p>
          <div className="mt-2.5 h-1 bg-line-soft rounded-full overflow-hidden">
            <div className="h-full bg-teal" style={{ width: '64%' }} />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-line">
          <p className="text-[11px] text-soft font-mono">Hubert v1.0 · © 2025</p>
        </div>
      </aside>
    </>
  );
}
