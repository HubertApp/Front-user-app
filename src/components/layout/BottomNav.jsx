import { NavLink } from 'react-router-dom';
import HubertLogo from '../ui/HubertLogo';

const navItems = [
  { to: '/', label: "Let's move", icon: 'fa-solid fa-route' },
  { to: '/favoris', label: 'Favoris', icon: 'fa-solid fa-star' },
  { to: '/compte', label: 'Compte', icon: 'fa-solid fa-user' },
];

export default function BottomNav() {
  return (
    <>
      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e2e8f0] md:hidden">
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                  isActive ? 'text-teal' : 'text-[#94a3b8] hover:text-[#64748b]'
                }`
              }
            >
              <i className={`${icon} text-lg`} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-60 bg-white border-r border-[#e2e8f0] flex-col z-50">
        {/* Logo */}
        <div className="px-6 py-7 border-b border-[#e2e8f0]">
          <HubertLogo sidebarVariant />
          <p className="text-[11px] text-[#94a3b8] mt-1.5 font-medium">Votre compagnon de voyage</p>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? 'bg-teal/10 text-teal'
                    : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                }`
              }
            >
              <i className={`${icon} w-4 text-center`} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-[#e2e8f0]">
          <p className="text-[11px] text-[#94a3b8]">© 2025 Hubert</p>
        </div>
      </nav>
    </>
  );
}
