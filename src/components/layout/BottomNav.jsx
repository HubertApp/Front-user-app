import { NavLink } from 'react-router-dom';
import HubertLogo from '../ui/HubertLogo';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/',         label: 'Accueil',  icon: 'fa-house' },
  { to: '/favoris',  label: 'Favoris',  icon: 'fa-heart' },
  { to: '/trafic',   label: 'Trafic',   icon: 'fa-tower-broadcast' },
  { to: '/voyages',  label: 'Voyages',  icon: 'fa-suitcase-rolling' },
  { to: '/compte',   label: 'Compte',   icon: 'fa-user' },
];

export default function BottomNav() {
  const { dark, collapsed, toggleSidebar } = useTheme();
  const navBg = dark ? 'rgba(14, 26, 36, 0.92)' : 'rgba(246, 247, 244, 0.86)';

  return (
    <>
      {/* Mobile bottom bar */}
      <nav
        aria-label="Navigation principale"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-line"
        style={{
          background: navBg,
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
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-full bg-warm-card border-r border-line flex-col z-40 transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Header */}
        <div
          className={`border-b border-line flex items-center shrink-0 ${
            collapsed ? 'justify-center px-3 py-[26px]' : 'px-6 py-7'
          }`}
        >
          {collapsed ? (
            <HubertLogo size="1.7rem" iconOnly />
          ) : (
            <div className="flex-1 min-w-0">
              <HubertLogo sidebarVariant />
              <p className="text-[11px] text-muted mt-2 font-medium">Votre compagnon de voyage</p>
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] text-muted hover:bg-line-soft hover:text-ink transition-colors ${
              collapsed ? 'hidden' : 'ml-2'
            }`}
            aria-label="Réduire la sidebar"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
        </div>

        {/* Nav items */}
        <div className={`flex flex-col gap-1 py-4 flex-1 ${collapsed ? 'px-2' : 'px-3'}`}>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center py-3 rounded-xl transition-all font-semibold text-sm ${
                  collapsed ? 'justify-center px-2' : 'gap-3 px-4'
                } ${
                  isActive
                    ? 'bg-ink text-white'
                    : 'text-muted hover:bg-line-soft hover:text-ink'
                }`
              }
            >
              <i className={`fa-solid ${icon} w-4 text-center`} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={toggleSidebar}
            className="mx-auto mb-4 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] text-muted hover:bg-line-soft hover:text-ink transition-colors"
            aria-label="Développer la sidebar"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        )}

        {/* Live trip widget */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-4 rounded-2xl border border-line bg-warm-bg">
            <p className="eyebrow !text-[10px] !mb-2">Trajet en cours</p>
            <p className="text-[13px] font-bold text-ink">Maison → Travail</p>
            <p className="text-[11px] text-muted mt-0.5">Arrivée prévue 08:50</p>
            <div className="mt-2.5 h-1 bg-line-soft rounded-full overflow-hidden">
              <div className="h-full bg-teal" style={{ width: '64%' }} />
            </div>
          </div>
        )}

        {/* Footer */}
        {!collapsed && (
          <div className="px-6 py-4 border-t border-line">
            <p className="text-[11px] text-soft font-mono">Hubert v1.0 · © 2025</p>
          </div>
        )}
      </aside>
    </>
  );
}
