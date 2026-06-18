import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { usePageMeta } from '../hooks/usePageMeta';

function SettingRow({ icon, label, sub, trailing, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-3.5 ${onClick ? 'pressable' : ''}`}
    >
      <span className="w-8 h-8 rounded-[10px] bg-teal-soft text-teal-hover inline-flex items-center justify-center text-[13px] shrink-0">
        <i className={`fa-solid ${icon}`} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink">{label}</p>
        {sub && <p className="text-[11.5px] text-muted mt-0.5">{sub}</p>}
      </div>
      {trailing}
    </div>
  );
}

function SettingsSection({ title, children }) {
  return (
    <section className="mb-5">
      <h4 className="h-section mb-2 px-1">{title}</h4>
      <div className="bg-warm-card rounded-2xl border border-line divide-y divide-line-soft overflow-hidden">
        {children}
      </div>
    </section>
  );
}

export default function AccountPage() {
  const [notifs, setNotifs] = useState(true);
  const { dark, toggle: toggleDark, collapsed } = useTheme();
  usePageMeta({ title: 'Mon compte', description: 'Gérez votre profil, vos préférences et vos paramètres de sécurité.', path: '/compte', noIndex: true });

  return (
    <div className={`min-h-screen bg-warm-bg text-ink pb-28 md:pb-12 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
      <main id="main-content" className="max-w-md mx-auto px-5 md:px-8">
        <PageHeader
          eyebrow="Votre espace"
          title="Compte"
          action={
            <button
              className="pressable w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center"
              aria-label="Aide"
            >
              <i className="fa-regular fa-circle-question text-[14px]" />
            </button>
          }
        />

        {/* Avatar hero */}
        <div className="flex flex-col items-center pt-3 pb-5">
          <div
            className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-[32px] font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #FAEFD8, #E6DCC5)',
              color: '#0E1A24',
              border: '4px solid #fff',
              boxShadow: '0 8px 24px -10px rgba(15,26,36,0.20)',
            }}
          >
            SH
          </div>
          <p className="text-xl font-bold tracking-tight">Sir Hubert</p>
          <p className="text-[12.5px] text-muted mt-0.5">sir.hubert@hubertapp.fr</p>
          <button className="pressable mt-3 h-8 px-3.5 rounded-[10px] bg-white border border-line text-[12px] font-semibold text-ink inline-flex items-center gap-1.5">
            <i className="fa-regular fa-pen-to-square text-[11px]" />
            Modifier le profil
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { num: '128', sub: '',    lbl: 'Trajets' },
            { num: '3',   sub: '',    lbl: 'Favoris' },
            { num: '42',  sub: ' kg', lbl: 'CO₂ évités' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-line p-3 text-center">
              <p className="text-lg font-bold tracking-tight">
                {s.num}
                {s.sub && <span className="text-[11px] text-muted">{s.sub}</span>}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted mt-0.5">
                {s.lbl}
              </p>
            </div>
          ))}
        </div>

        <SettingsSection title="Coordonnées personnelles">
          <SettingRow icon="fa-user" label="Informations personnelles" sub="Nom, prénom, date de naissance"
            trailing={<i className="fa-solid fa-chevron-right text-soft text-[11px]" />} onClick={() => {}} />
          <SettingRow icon="fa-envelope" label="Adresse e-mail" sub="sir.hubert@hubertapp.fr · vérifiée"
            trailing={<i className="fa-solid fa-chevron-right text-soft text-[11px]" />} onClick={() => {}} />
          <SettingRow icon="fa-key" label="Mot de passe & sécurité" sub="Dernière modification il y a 3 mois"
            trailing={<i className="fa-solid fa-chevron-right text-soft text-[11px]" />} onClick={() => {}} />
        </SettingsSection>

        <SettingsSection title="Préférences">
          <SettingRow icon="fa-bell" label="Notifications" sub="Alertes trafic, rappels de départ"
            trailing={<span className={`togg ${notifs ? '' : 'off'}`} />} onClick={() => setNotifs(v => !v)} />
          <SettingRow icon="fa-moon" label="Mode sombre" sub="Thème nuit activé globalement"
            trailing={<span className={`togg ${dark ? '' : 'off'}`} />} onClick={toggleDark} />
          <SettingRow icon="fa-language" label="Langue & région" sub="Français · Grand Est"
            trailing={<i className="fa-solid fa-chevron-right text-soft text-[11px]" />} onClick={() => {}} />
          <SettingRow icon="fa-shield-halved" label="Gestion des consentements" sub="Cookies, données partagées"
            trailing={<i className="fa-solid fa-chevron-right text-soft text-[11px]" />} onClick={() => {}} />
          <SettingRow icon="fa-sliders" label="Paramètres avancés" sub="Modes préférés, accessibilité"
            trailing={<i className="fa-solid fa-chevron-right text-soft text-[11px]" />} onClick={() => {}} />
        </SettingsSection>

        <button className="w-full h-12 border border-[#F1C8C3] text-danger rounded-2xl font-bold text-[13.5px] hover:bg-danger hover:text-white transition-colors">
          <i className="fa-solid fa-arrow-right-from-bracket mr-2" />
          Se déconnecter
        </button>
        
        <p className="text-center text-[10.5px] text-soft font-mono mt-4">
          Hubert v1.0.0 · © 2025
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
