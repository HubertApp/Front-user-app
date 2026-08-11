import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import BackBar from '../components/layout/BackBar';
import BottomNav from '../components/layout/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { usePageMeta } from '../hooks/usePageMeta';

function LegalSection({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-[15px] font-bold text-ink mb-2">{title}</h2>
      <div className="text-[13px] text-muted leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}

export default function LegalNoticePage() {
  const { collapsed } = useTheme();
  const navigate = useNavigate();
  usePageMeta({ title: 'Mentions légales', description: "Mentions légales de l'application Hubert.", path: '/mentions-legales', noIndex: true });

  return (
    <div className={`min-h-screen bg-warm-bg text-ink pb-28 md:pb-12 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
      <main id="main-content" className="max-w-2xl mx-auto px-5 md:px-8">
        <BackBar to="/compte" />
        <PageHeader eyebrow="Informations légales" title="Mentions légales" />

        <div className="bg-warm-card rounded-2xl border border-line p-5 md:p-7 mb-6">
          <LegalSection title="1. Éditeur de l'application">
            <p>
              L'application Hubert est éditée par : <strong>HurbanFlow</strong>,
              SASU, au capital de 500 €, immatriculée au RCS de Metz sous le
              numéro 832 932 456 00019, dont le siège social est situé au 123 Rue de la Paix, 57000 Metz.
            </p>
            <p>Numéro de TVA intracommunautaire : FR 12 345 678 901.</p>
            <p>Directeur de la publication : Cédric Brasseur.</p>
            <p>Contact : contact@hubert.fr.</p>
          </LegalSection>

          <LegalSection title="2. Hébergement">
            <p>
              L'application et ses services associés sont hébergés par : <strong>Hostinger</strong>.
            </p>
          </LegalSection>

          <LegalSection title="3. Propriété intellectuelle">
            <p>
              L'ensemble des éléments composant l'application Hubert (textes, graphismes, logos,
              icônes, logiciels) est la propriété exclusive de son éditeur ou de ses partenaires,
              sauf mention contraire, et est protégé par les lois françaises et internationales
              relatives à la propriété intellectuelle. Toute reproduction, représentation,
              modification ou exploitation, totale ou partielle, sans autorisation préalable
              écrite, est interdite.
            </p>
          </LegalSection>

          <LegalSection title="4. Données personnelles">
            <p>
              Le traitement des données personnelles réalisé par Hubert (compte utilisateur,
              connexion via Google, historique de trajets, notifications) est décrit dans la
              politique de confidentialité de l'application. Conformément au Règlement Général sur
              la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez
              d'un droit d'accès, de rectification, de suppression et de portabilité de vos
              données, ainsi que d'un droit d'opposition et de limitation du traitement.
            </p>
            <p>
              Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante :
              contact@hubert.fr.
            </p>
          </LegalSection>

          <LegalSection title="5. Cookies et traceurs">
            <p>
              L'application peut utiliser des cookies ou technologies équivalentes nécessaires à
              son fonctionnement (authentification, préférences) ainsi que, le cas échéant, des
              cookies de mesure d'audience soumis à votre consentement. Vous pouvez gérer vos
              préférences depuis la section "Gestion des consentements" de votre compte.
            </p>
          </LegalSection>

          <LegalSection title="6. Limitation de responsabilité">
            <p>
              Les informations fournies par Hubert (itinéraires, horaires, trafic) le sont à titre
              indicatif et peuvent être soumises à des aléas indépendants de notre volonté.
              L'éditeur ne saurait être tenu responsable des conséquences directes ou indirectes
              résultant de l'utilisation de ces informations.
            </p>
          </LegalSection>

          <LegalSection title="7. Droit applicable">
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige et
              à défaut d'accord amiable, les tribunaux français seront seuls compétents.
            </p>
          </LegalSection>

          <p className="text-[11px] text-soft font-mono mt-6">
            Dernière mise à jour : 11/08/2026
          </p>
        </div>


                   <section className="mb-8">
          <div className="bg-warm-card rounded-2xl border border-line divide-y divide-line-soft overflow-hidden">
            <button
              onClick={() => navigate('/compte')}
              className="pressable w-full flex items-center gap-3 px-3.5 py-3.5 text-left"
            >
              <span className="w-8 h-8 rounded-[10px] bg-teal-soft text-teal-hover inline-flex items-center justify-center text-[13px] shrink-0">
                <i className="fa-solid fa-door-open" />
              </span>
              <p className="text-sm font-semibold text-ink flex-1">Compte</p>
              <i className="fa-solid fa-chevron-right text-soft text-[11px]" />
            </button>
          </div>
        </section>

      </main>
      

      <BottomNav />
    </div>
  );
}
