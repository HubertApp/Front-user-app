import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { usePageMeta } from '../hooks/usePageMeta';

const faqData = [
  {
    category: '🚀 Démarrage',
    questions: [
      {
        id: 1,
        question: 'Comment créer un compte sur HubertApp ?',
        answer: 'HubertApp utilise l\'authentification Google. Cliquez sur "Se connecter avec Google" sur la page d\'accueil, autorisez l\'accès à votre compte Google, et votre profil sera automatiquement créé.'
      },
      {
        id: 2,
        question: 'Puis-je utiliser HubertApp sans compte ?',
        answer: 'Oui, vous pouvez utiliser HubertApp sans créer de compte pour rechercher et planifier des trajets. Cependant, certaines fonctionnalités avancées (sauvegarde de favoris, notifications personnalisées, historique des trajets, synchronisation multi-appareils) nécessitent un compte connecté.'
      },
      {
        id: 3,
        question: 'Comment me déconnecter ?',
        answer: 'Accédez à votre profil en cliquant sur votre avatar en haut à gauche, puis sélectionnez "Se déconnecter" en bas de la page Paramètres.'
      }
    ]
  },
  {
    category: '🔍 Recherche et planification',
    questions: [
      {
        id: 4,
        question: 'Comment rechercher un trajet ?',
        answer: 'Cliquez sur la barre de recherche "Un pays, une destination..." sur la page d\'accueil, puis saisissez votre point de départ et votre destination. L\'application vous proposera les meilleurs itinéraires disponibles.'
      },
      {
        id: 5,
        question: 'Quels modes de transport sont disponibles ?',
        answer: 'HubertApp prend en charge la marche, le vélo, le tramway, le bus, le métro, le train, et l\'avion. Vous pouvez combiner plusieurs modes pour un trajet optimal.'
      },
      {
        id: 6,
        question: 'Comment suivre un trajet en temps réel ?',
        answer: 'Une fois votre trajet planifié, cliquez sur "Suivre le trajet" sur la carte du trajet actif. Vous recevrez des notifications à chaque étape de votre parcours.'
      },
      {
        id: 7,
        question: 'Puis-je modifier un trajet en cours ?',
        answer: 'Oui, cliquez sur le trajet en cours depuis l\'accueil, puis sélectionnez "Modifier le trajet" pour ajuster votre itinéraire.'
      }
    ]
  },
  {
    category: '⭐ Favoris et trajets fréquents',
    questions: [
      {
        id: 8,
        question: 'Comment ajouter un trajet aux favoris ?',
        answer: 'Après avoir effectué une recherche, cliquez sur l\'icône cœur ♥ en haut à droite de la carte du trajet. Le trajet sera sauvegardé dans votre section "Favoris".'
      },
      {
        id: 9,
        question: 'Où retrouver mes trajets favoris ?',
        answer: 'Accédez à vos favoris via l\'icône ♥ sur la page d\'accueil, ou depuis le menu de navigation en bas de l\'écran.'
      },
      {
        id: 10,
        question: 'Comment supprimer un favori ?',
        answer: 'Dans la section Favoris, glissez vers la gauche sur le trajet concerné, puis cliquez sur l\'icône de suppression.'
      },
      {
        id: 11,
        question: 'Quelle est la différence entre "Favoris" et "Les plus utilisés" ?',
        answer: '"Les plus utilisés" affiche automatiquement vos trajets les plus fréquents basés sur votre historique. "Favoris" contient les trajets que vous avez manuellement enregistrés.'
      }
    ]
  },
  {
    category: '🚦 Informations trafic',
    questions: [
      {
        id: 12,
        question: 'Comment consulter l\'état du trafic en temps réel ?',
        answer: 'Cliquez sur l\'icône "Trafic" 📡 sur la page d\'accueil. Vous verrez les perturbations, travaux, et incidents sur votre réseau de transport.'
      },
      {
        id: 13,
        question: 'Puis-je recevoir des alertes trafic ?',
        answer: 'Oui, activez les notifications dans vos Paramètres > Notifications, et choisissez les lignes que vous souhaitez suivre dans la section Trafic.'
      },
      {
        id: 14,
        question: 'Les informations trafic sont-elles mises à jour régulièrement ?',
        answer: 'Oui, les données sont actualisées toutes les 2 minutes depuis les opérateurs de transport partenaires.'
      }
    ]
  },
  {
    category: '🧳 Gestion des voyages',
    questions: [
      {
        id: 15,
        question: 'Comment organiser un voyage longue distance ?',
        answer: 'Accédez à la section "Voyages" 🧳, cliquez sur "Nouveau voyage", puis saisissez votre destination et vos dates. L\'application planifiera l\'itinéraire complet avec tous les modes de transport nécessaires.'
      },
      {
        id: 16,
        question: 'Puis-je sauvegarder plusieurs étapes dans un voyage ?',
        answer: 'Oui, lors de la création d\'un voyage, vous pouvez ajouter des étapes intermédiaires en cliquant sur "Ajouter une étape".'
      },
      {
        id: 17,
        question: 'Comment partager un voyage avec d\'autres personnes ?',
        answer: 'Dans la fiche de votre voyage, cliquez sur l\'icône de partage 📤, puis choisissez le mode d\'envoi (lien, email, SMS).'
      }
    ]
  },
  {
    category: '🔔 Notifications',
    questions: [
      {
        id: 18,
        question: 'Quels types de notifications vais-je recevoir ?',
        answer: 'Vous recevrez des notifications pour : départs imminents, retards sur votre trajet, perturbations trafic sur vos lignes favorites, et suggestions de trajets optimisés.'
      },
      {
        id: 19,
        question: 'Comment désactiver certaines notifications ?',
        answer: 'Allez dans Paramètres > Notifications, puis désactivez les catégories que vous ne souhaitez plus recevoir.'
      },
      {
        id: 20,
        question: 'Pourquoi je ne reçois pas de notifications ?',
        answer: 'Vérifiez que vous avez autorisé les notifications dans les paramètres de votre navigateur/appareil, et que les notifications sont activées dans l\'application (Paramètres > Notifications).'
      }
    ]
  },
  {
    category: '⚙️ Compte et paramètres',
    questions: [
      {
        id: 21,
        question: 'Comment modifier mon pseudo ou mes informations personnelles ?',
        answer: 'Accédez à Paramètres (icône ⚙️), puis modifiez les champs de votre profil. Cliquez sur "Enregistrer" pour valider les modifications.'
      },
      {
        id: 22,
        question: 'Comment changer mon adresse e-mail ?',
        answer: 'L\'adresse e-mail est liée à votre compte Google et ne peut pas être modifiée directement. Vous devez créer un nouveau compte avec une autre adresse Google.'
      },
      {
        id: 23,
        question: 'Comment supprimer mon compte ?',
        answer: 'Allez dans Paramètres > Confidentialité et sécurité > Supprimer mon compte. Cette action est irréversible et supprimera toutes vos données (favoris, historique, préférences).'
      },
      {
        id: 24,
        question: 'Mes données personnelles sont-elles sécurisées ?',
        answer: 'Oui, HubertApp utilise un chiffrement de bout en bout. Vos données sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers sans votre consentement. Consultez notre Politique de confidentialité pour plus de détails.'
      }
    ]
  },
  {
    category: '🌙 Thème et personnalisation',
    questions: [
      {
        id: 25,
        question: 'Comment activer le mode sombre ?',
        answer: 'Allez dans Paramètres > Apparence, puis sélectionnez "Mode sombre". Vous pouvez aussi choisir "Automatique" pour suivre les réglages de votre système.'
      },
      {
        id: 26,
        question: 'Puis-je personnaliser la barre de navigation ?',
        answer: 'Actuellement, la barre de navigation est fixe, mais vous pouvez réorganiser vos favoris pour un accès rapide à vos trajets les plus utilisés.'
      }
    ]
  },
  {
    category: '🐛 Problèmes techniques',
    questions: [
      {
        id: 27,
        question: 'L\'application ne charge pas mes trajets, que faire ?',
        answer: 'Vérifiez votre connexion Internet, actualisez la page (F5), et videz le cache de votre navigateur si le problème persiste.'
      },
      {
        id: 28,
        question: 'Un trajet affiché est-il erroné, comment le signaler ?',
        answer: 'Cliquez sur "Signaler un problème" dans la fiche du trajet, décrivez l\'anomalie, et notre équipe la corrigera dans les plus brefs délais.'
      },
      {
        id: 29,
        question: 'L\'application est lente, comment l\'optimiser ?',
        answer: 'Fermez les onglets inutilisés, videz le cache de votre navigateur, et assurez-vous d\'utiliser la dernière version de votre navigateur (Chrome, Firefox, Safari, Edge).'
      },
      {
        id: 30,
        question: 'Qui contacter en cas de problème non résolu ?',
        answer: 'Envoyez un e-mail à support@hubertapp.com avec une description détaillée du problème, des captures d\'écran si possible, et votre navigateur/appareil. Nous vous répondrons sous 48h.'
      }
    ]
  },
  {
    category: '📱 Accessibilité',
    questions: [
      {
        id: 31,
        question: 'HubertApp est-elle accessible aux personnes en situation de handicap ?',
        answer: 'Oui, l\'application respecte les normes WCAG 2.1 niveau AA (navigation au clavier, lecteurs d\'écran, contrastes élevés).'
      },
      {
        id: 32,
        question: 'Puis-je utiliser HubertApp sur mobile ?',
        answer: 'Oui, l\'application est entièrement responsive et fonctionne sur smartphones et tablettes (iOS et Android).'
      }
    ]
  }
];

function FAQItem({ question, answer, isOpen, onToggle, navigate }) {
  const parseAnswerWithLinks = (text) => {
    const parts = [];
    let lastIndex = 0;
    
    // Définir les patterns de remplacement avec leurs routes
    const patterns = [
      { regex: /Paramètres > Notifications/g, text: 'Paramètres > Notifications', route: '/notifications' },
      { regex: /Paramètres > Apparence/g, text: 'Paramètres > Apparence', route: '/compte' },
      { regex: /Paramètres > Confidentialité et sécurité/g, text: 'Paramètres > Confidentialité et sécurité', route: '/parametres-avances' },
      { regex: /section "Favoris"/g, text: 'section "Favoris"', route: '/favoris' },
      { regex: /section Favoris/g, text: 'section Favoris', route: '/favoris' },
      { regex: /Dans la section Favoris/g, text: 'section Favoris', route: '/favoris', prefix: 'Dans la ' },
      { regex: /section Trafic/g, text: 'section Trafic', route: '/trafic' },
      { regex: /section "Voyages"/g, text: 'section "Voyages"', route: '/voyages' },
      { regex: /Paramètres \(icône ⚙️\)/g, text: 'Paramètres', route: '/compte' },
      { regex: /page Paramètres/g, text: 'page Paramètres', route: '/compte' },
      { regex: /page d'accueil/g, text: 'page d\'accueil', route: '/' },
      { regex: /Politique de confidentialité/g, text: 'Politique de confidentialité', route: '/mentions-legales' },
    ];
    
    // Créer un tableau avec toutes les correspondances
    const matches = [];
    patterns.forEach(({ regex, text, route, prefix = '' }) => {
      const regexCopy = new RegExp(regex.source, 'g');
      let match;
      while ((match = regexCopy.exec(answer)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          text: text,
          route: route,
          prefix: prefix,
          fullMatch: match[0]
        });
      }
    });
    
    // Trier par index
    matches.sort((a, b) => a.index - b.index);
    
    // Construire le résultat
    matches.forEach((match, i) => {
      // Ajouter le texte avant le lien
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${i}`}>
            {answer.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      // Ajouter le lien
      parts.push(
        <button
          key={`link-${i}`}
          onClick={(e) => {
            e.stopPropagation();
            navigate(match.route);
          }}
          className="text-teal hover:underline font-semibold"
        >
          {match.fullMatch}
        </button>
      );
      
      lastIndex = match.index + match.length;
    });
    
    // Ajouter le reste du texte
    if (lastIndex < answer.length) {
      parts.push(
        <span key="text-end">
          {answer.substring(lastIndex)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : answer;
  };

  return (
    <div className="border-b border-line last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 px-5 flex items-start justify-between gap-4 text-left hover:bg-warm-bg/50 transition-colors group"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[15px] leading-snug flex-1 group-hover:text-teal transition-colors">
          {question}
        </span>
        <i 
          className={`fa-solid fa-chevron-down text-soft text-xs mt-1 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-4 text-[14px] leading-relaxed text-soft">
          {parseAnswerWithLinks(answer)}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const navigate = useNavigate();
  const { collapsed } = useTheme();
  const [openItem, setOpenItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  usePageMeta({ title: 'FAQ - Foire aux questions', description: 'Trouvez rapidement des réponses à vos questions sur HubertApp', path: '/faq' });

  const filteredData = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className={`min-h-screen bg-warm-bg text-ink pb-28 md:pb-12 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
      <main id="main-content" className="max-w-3xl mx-auto px-5 md:px-8 pt-6 md:pt-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="pressable w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center"
            aria-label="Retour"
          >
            <i className="fa-solid fa-arrow-left text-[15px]" />
          </button>
          <div>
            <h1 className="text-[26px] md:text-[32px] font-bold tracking-tight">
              Foire aux questions
            </h1>
            <p className="text-[14px] text-soft mt-1">
              Trouvez rapidement des réponses à vos questions
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-soft text-[14px]" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-white border border-line rounded-xl text-[15px] placeholder:text-soft focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* FAQ Content */}
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <i className="fa-regular fa-circle-question text-[48px] text-soft/30 mb-4" />
            <p className="text-soft text-[15px]">Aucune question ne correspond à votre recherche</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredData.map((category) => (
              <section key={category.category}>
                <h2 className="text-[18px] font-bold mb-3 px-2">
                  {category.category}
                </h2>
                <div className="bg-white rounded-xl border border-line overflow-hidden">
                  {category.questions.map((item) => (
                    <FAQItem
                      key={item.id}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openItem === item.id}
                      onToggle={() => setOpenItem(openItem === item.id ? null : item.id)}
                      navigate={navigate}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-8 p-5 bg-white border border-line rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-headset text-teal text-[18px]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[15px] mb-1">
                Besoin d'aide supplémentaire ?
              </h3>
              <p className="text-[14px] text-soft mb-3">
                Notre équipe de support est disponible pour répondre à vos questions spécifiques.
              </p>
              <a
                href="mailto:support@hubertapp.com"
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-teal hover:underline"
              >
                <i className="fa-regular fa-envelope" />
                support@hubertapp.com
              </a>
            </div>
          </div>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
