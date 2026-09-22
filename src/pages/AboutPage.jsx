import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import BackBar from '../components/layout/BackBar';
import BottomNav from '../components/layout/BottomNav';
import HubertLogo from '../components/ui/HubertLogo';
import { useTheme } from '../context/ThemeContext';
import { usePageMeta } from '../hooks/usePageMeta';

const team = [
  { name: 'Noé ZIADI', role: 'Chef de projet - Développeur Full Stack' },
  { name: 'Loan KEOVILAY', role: 'Lead Développeur Back-end' },
  { name: 'Adel BOUKADA', role: 'Senior Architecte Logiciel' },
  {name: 'Valentin MIGNON', role: 'Senior Développeur Full Stack'},
];

const features = [
  { icon: 'fa-route', label: 'Itinéraires en temps réel', desc: 'Calcul de trajets multimodaux (marche, tram, vélo...) avec horaires à jour.' },
  { icon: 'fa-tower-broadcast', label: 'Alertes trafic', desc: 'Notifications en cas de perturbation sur vos lignes habituelles.' },
  { icon: 'fa-heart', label: 'Favoris & trajets fréquents', desc: 'Retrouvez vos trajets du quotidien en un tap.' },
  { icon: 'fa-suitcase-rolling', label: 'Voyages', desc: "Organisez et suivez vos déplacements, du quotidien aux longs trajets." },
];

function FeatureRow({ icon, label, desc }) {
  return (
    <div className="flex items-start gap-3 px-3.5 py-3.5">
      <span className="w-8 h-8 rounded-[10px] bg-teal-soft text-teal-hover inline-flex items-center justify-center text-[13px] shrink-0 mt-0.5">
        <i className={`fa-solid ${icon}`} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-[11.5px] text-muted mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { collapsed } = useTheme();
  const navigate = useNavigate();
  usePageMeta({ title: 'À propos', description: "À propos de l'application Hubert et de son équipe.", path: '/a-propos', noIndex: true });

  return (
    <div className={`min-h-screen bg-warm-bg text-ink pb-28 md:pb-12 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
      <main id="main-content" className="max-w-2xl mx-auto px-5 md:px-8">
        <BackBar to="/compte" />
        <PageHeader eyebrow="L'application" title="À propos de Hubert" />

        {/* Intro */}
        <div className="bg-warm-card rounded-2xl border border-line p-6 mb-5 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-eff6ff flex items-center justify-center mb-3" style={{ background: '#eff6ff00' }}>
            <HubertLogo size="3rem" iconOnly />
          </div>
          <p className="text-[13px] text-muted leading-relaxed">
            Hubert est votre compagnon de voyage au quotidien : il combine itinéraires multimodaux,
            alertes trafic en temps réel et suivi de vos trajets favoris pour vous aider à vous
            déplacer plus simplement, que ce soit pour un trajet domicile-travail ou un voyage
            occasionnel.
          </p>
          <p className="text-[11px] text-soft font-mono mt-3">Version 1.0.0 · © 2025</p>
        </div>

        {/* Features */}
        <section className="mb-5">
          <h4 className="h-section mb-2 px-1">Ce que propose Hubert</h4>
          <div className="bg-warm-card rounded-2xl border border-line divide-y divide-line-soft overflow-hidden">
            {features.map((f) => (
              <FeatureRow key={f.label} {...f} />
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-5">
          <h4 className="h-section mb-2 px-1">L'équipe</h4>
          <div className="bg-warm-card rounded-2xl border border-line divide-y divide-line-soft overflow-hidden">
            {team.map((m) => (
              <div key={m.name} className="flex items-center gap-3 px-3.5 py-3.5">
                <span className="w-8 h-8 rounded-full bg-line-soft text-muted inline-flex items-center justify-center text-[12px] font-bold shrink-0">
                  {m.name.startsWith('[') ? '?' : m.name.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink">{m.name}</p>
                  <p className="text-[11.5px] text-muted mt-0.5">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="mb-8">
          <div className="bg-warm-card rounded-2xl border border-line divide-y divide-line-soft overflow-hidden">
            <button
              onClick={() => navigate('/mentions-legales')}
              className="pressable w-full flex items-center gap-3 px-3.5 py-3.5 text-left"
            >
              <span className="w-8 h-8 rounded-[10px] bg-teal-soft text-teal-hover inline-flex items-center justify-center text-[13px] shrink-0">
                <i className="fa-solid fa-scale-balanced" />
              </span>
              <p className="text-sm font-semibold text-ink flex-1">Mentions légales</p>
              <i className="fa-solid fa-chevron-right text-soft text-[11px]" />
            </button>
          </div>
        </section>

        <p className="text-center text-[10.5px] text-soft font-mono mb-4">
          Fait avec soin par l'équipe Hubert.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
