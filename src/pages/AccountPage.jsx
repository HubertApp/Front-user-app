import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';

const personalItems = [
  { label: 'Paramètre 1' },
  { label: 'Paramètre 2' },
];

const appItems = [
  { label: 'Notifications' },
  { label: 'Affichage' },
  { label: 'Gestion des consentements' },
  { label: 'Paramètres avancés' },
];

function SettingButton({ label }) {
  return (
    <button className="w-full flex items-center justify-between px-5 py-4 bg-teal rounded-xl hover:bg-teal-hover transition-colors group">
      <span className="text-white font-semibold text-sm">{label}</span>
      <i className="fa-solid fa-chevron-right text-white/60 text-xs group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

function Section({ title, items }) {
  return (
    <section className="mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-3 px-1">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {items.map(({ label }) => (
          <SettingButton key={label} label={label} />
        ))}
      </div>
    </section>
  );
}

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0f172a] md:pl-60">
      <div className="max-w-md mx-auto px-4 pt-6 pb-24 md:pb-10">
        <PageHeader title="Compte" />

        {/* Avatar */}
        <div className="flex flex-col items-center mt-6 mb-10">
          <div className="w-24 h-24 bg-[#f1f5f9] border-2 border-[#e2e8f0] rounded-full flex items-center justify-center mb-4">
            <i className="fa-solid fa-user text-4xl text-[#94a3b8]" />
          </div>
          <h2 className="text-xl font-bold text-[#0f172a]">Sir Hubert</h2>
          <div className="w-16 h-0.5 bg-[#e2e8f0] mt-4" />
        </div>

        <Section title="Coordonnées personnelles" items={personalItems} />
        <Section title="Paramètres" items={appItems} />

        <button className="w-full py-4 border border-red-300 text-red-500 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-500 hover:text-white transition-colors mt-2">
          Se déconnecter
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
