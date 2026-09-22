import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import BackBar from '../components/layout/BackBar';
import BottomNav from '../components/layout/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { usePageMeta } from '../hooks/usePageMeta';

const CATEGORIES = [
  { icon: 'fa-burger', label: 'Fast-food & restauration' },
  { icon: 'fa-bed', label: 'Hôtellerie' },
  { icon: 'fa-car-side', label: 'VTC & transport (Uber, Wymoo…)' },
  { icon: 'fa-ticket', label: 'Loisirs & culture' },
  { icon: 'fa-store', label: 'Commerces locaux' },
];

const BENEFITS = [
  { icon: 'fa-eye', title: 'Visibilité', text: "Votre enseigne exposée aux usagers actifs de l'app." },
  { icon: 'fa-route', title: 'Contexte trajet', text: 'Recommandée au bon moment, sur le bon itinéraire.' },
  { icon: 'fa-leaf', title: 'Image responsable', text: "Associée à une mobilité plus durable." },
];

const TIERS = [
  {
    id: 'partenaire',
    name: 'Partenaire',
    price: 'Gratuit',
    highlight: false,
    features: [
      "Fiche établissement dans l'app",
      'Présence dans les résultats de recherche',
      'Badge « Partenaire Hubert »',
    ],
  },
  {
    id: 'sponsor',
    name: 'Sponsor officiel',
    price: 'Sur devis',
    highlight: true,
    features: [
      'Tous les avantages Partenaire',
      "Mise en avant en page d'accueil",
      'Notifications push ciblées',
      'Co-branding sur les itinéraires',
      'Statistiques de visibilité',
    ],
  },
];

function TierCard({ tier, selected, onSelect }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-3 md:p-5 border transition-colors bg-warm-card ${
        selected ? 'border-teal' : 'border-line'
      }`}
      style={selected ? { boxShadow: '0 0 0 3px var(--color-teal-soft)' } : undefined}
    >
      {tier.highlight && (
        <span className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 bg-teal text-white text-[8.5px] md:text-[10px] font-bold uppercase tracking-wider px-2 md:px-3 py-0.5 md:py-1 rounded-full whitespace-nowrap">
          Recommandé
        </span>
      )}
      <p className="text-[13px] md:text-lg font-bold text-ink mt-2 md:mt-2.5 leading-tight">{tier.name}</p>
      <p className="text-teal-hover font-extrabold text-[15px] md:text-2xl mb-2.5 md:mb-4">{tier.price}</p>
      <ul className="space-y-1.5 md:space-y-2.5 mb-3 md:mb-5 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-1.5 md:gap-2 text-[10.5px] md:text-[13px] text-muted leading-snug">
            <i className="fa-solid fa-check text-teal mt-0.5 text-[9px] md:text-[11px] shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(tier.id)}
        className={`pressable w-full h-9 md:h-11 rounded-[10px] text-[11.5px] md:text-[13.5px] font-bold transition-colors ${
          selected ? 'bg-teal text-white' : 'border border-line text-ink'
        }`}
      >
        <span className="md:hidden">{selected ? 'Sélectionné' : 'Choisir'}</span>
        <span className="hidden md:inline">{selected ? 'Sélectionné' : 'Choisir cette offre'}</span>
      </button>
    </div>
  );
}

export default function BecomePartnerPage() {
  const { collapsed } = useTheme();
  const navigate = useNavigate();
  usePageMeta({
    title: 'Devenir partenaire',
    description: 'Rejoignez le programme partenaires et sponsors de Hubert.',
    path: '/devenir-partenaire',
    noIndex: true,
  });

  const [form, setForm] = useState({
    company: '',
    sector: 'Fast-food & restauration',
    city: '',
    email: '',
    tier: 'partenaire',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const selectTier = (id) => {
    setForm((f) => ({ ...f, tier: id }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Formulaire purement visuel : aucune requête envoyée au backend.
    setSubmitted(true);
  };

  const canSubmit = form.company.trim() && form.email.trim();

  return (
    <div className={`min-h-screen bg-warm-bg text-ink pb-28 md:pb-12 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
      <main id="main-content" className="max-w-2xl mx-auto px-5 md:px-8">
        <BackBar to="/compte" />
        <PageHeader eyebrow="Votre espace" title="Devenir partenaire" />

        {/* Hero */}
        <div
          className="relative overflow-hidden rounded-3xl mb-6 md:mb-8 px-5 md:px-10 pt-6 md:pt-10 pb-7 md:pb-10 text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-teal) 0%, #0E1A24 100%)' }}
        >
          <i className="fa-solid fa-burger absolute text-white/10 text-[64px] md:text-[110px] -right-2 md:right-4 -top-3 md:-top-6 rotate-12" />
          <i className="fa-solid fa-car-side absolute text-white/10 text-[56px] md:text-[90px] right-16 md:right-40 bottom-0 -rotate-6" />
          <span
            className="relative inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'JetBrains Mono', monospace" }}
          >
            Programme partenaires
          </span>
          <p className="relative text-2xl md:text-4xl font-extrabold tracking-tight mt-1.5 md:mt-3 max-w-[240px] md:max-w-md leading-tight text-white">
            Faites découvrir votre enseigne aux usagers de Hubert
          </p>
          <p className="relative text-[12.5px] md:text-[15px] leading-relaxed mt-2 md:mt-3 max-w-[280px] md:max-w-lg" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Fast-foods, hôtels, sociétés de transport (VTC, taxis…) : rejoignez le réseau de
            partenaires et sponsors de l'application.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-warm-card rounded-2xl border border-line p-3 md:p-5 text-center">
              <span className="w-8 h-8 md:w-11 md:h-11 rounded-[10px] bg-teal-soft text-teal-hover inline-flex items-center justify-center text-[13px] md:text-[17px] mb-1.5 md:mb-2.5">
                <i className={`fa-solid ${b.icon}`} />
              </span>
              <p className="text-[11.5px] md:text-[14px] font-bold text-ink leading-tight">{b.title}</p>
              <p className="text-[10.5px] md:text-[12.5px] text-muted leading-snug mt-0.5">{b.text}</p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <section className="mb-6 md:mb-8">
          <h4 className="h-section mb-2 md:mb-3 px-1">Secteurs concernés</h4>
          <div className="flex flex-wrap gap-2 md:gap-2.5">
            {CATEGORIES.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-warm-card px-3 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13.5px] font-semibold text-ink"
              >
                <i className={`fa-solid ${c.icon} text-teal-hover text-[11px] md:text-[13px]`} />
                {c.label}
              </span>
            ))}
          </div>
        </section>

        {/* Tiers */}
        <section className="mb-6 md:mb-8">
          <h4 className="h-section mb-2 md:mb-3 px-1">Choisissez votre formule</h4>
          <div className="grid grid-cols-2 gap-3 md:gap-5 items-stretch">
            {TIERS.map((tier) => (
              <TierCard key={tier.id} tier={tier} selected={form.tier === tier.id} onSelect={selectTier} />
            ))}
          </div>
        </section>

        {/* Form */}
        <section ref={formRef} className="mb-8 scroll-mt-6">
          <h4 className="h-section mb-2 md:mb-3 px-1">Faire une demande</h4>

          {submitted ? (
            <div className="bg-warm-card rounded-2xl border border-line p-6 md:p-10 text-center">
              <span className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-teal-soft text-teal-hover inline-flex items-center justify-center text-xl md:text-2xl mb-3">
                <i className="fa-solid fa-circle-check" />
              </span>
              <p className="text-base md:text-xl font-bold text-ink mb-1">Demande envoyée !</p>
              <p className="text-[12.5px] md:text-sm text-muted leading-relaxed mb-4 md:max-w-sm md:mx-auto">
                Merci {form.company ? `à ${form.company}` : ''} pour votre intérêt. Notre équipe
                partenariats reviendra vers vous prochainement.
              </p>
              <button
                onClick={() => navigate('/compte')}
                className="pressable h-11 md:h-12 px-5 md:px-6 rounded-[10px] bg-teal text-white text-[13px] md:text-sm font-bold"
              >
                Retour au compte
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-warm-card rounded-2xl border border-line p-4 md:p-7 space-y-3 md:space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-[11.5px] md:text-[12.5px] font-semibold text-muted mb-1 block">
                    Nom de l'entreprise *
                  </label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Ex. Chez Momo, Ibis Metz Centre, VTC Est…"
                    className="w-full h-11 md:h-12 px-3.5 rounded-[10px] border border-line text-[13px] md:text-[14px] outline-none focus:border-teal"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11.5px] md:text-[12.5px] font-semibold text-muted mb-1 block">Secteur</label>
                  <select
                    name="sector"
                    value={form.sector}
                    onChange={handleChange}
                    className="w-full h-11 md:h-12 px-3.5 rounded-[10px] border border-line text-[13px] md:text-[14px] outline-none focus:border-teal bg-warm-card"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.label} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11.5px] md:text-[12.5px] font-semibold text-muted mb-1 block">Ville</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Metz, Nancy, Thionville…"
                    className="w-full h-11 md:h-12 px-3.5 rounded-[10px] border border-line text-[13px] md:text-[14px] outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="text-[11.5px] md:text-[12.5px] font-semibold text-muted mb-1 block">
                    E-mail de contact *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="contact@votre-entreprise.fr"
                    className="w-full h-11 md:h-12 px-3.5 rounded-[10px] border border-line text-[13px] md:text-[14px] outline-none focus:border-teal"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11.5px] md:text-[12.5px] font-semibold text-muted mb-1 block">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Parlez-nous de votre établissement…"
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-line text-[13px] md:text-[14px] outline-none focus:border-teal resize-none"
                />
              </div>

              <p className="text-[10.5px] md:text-[12px] text-soft leading-relaxed">
                Formule sélectionnée : <span className="font-semibold text-ink">{TIERS.find((t) => t.id === form.tier)?.name}</span>
              </p>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-12 md:h-13 rounded-2xl font-bold text-[13.5px] md:text-[15px] text-white transition-colors disabled:cursor-not-allowed"
                style={{ backgroundColor: canSubmit ? 'var(--color-teal)' : 'var(--color-teal-soft)' }}
              >
                Envoyer ma demande
              </button>
            </form>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
