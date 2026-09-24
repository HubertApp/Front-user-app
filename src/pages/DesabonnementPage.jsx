import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useUnsubscribeFromEmails } from '../services/userService';
import { usePageMeta } from '../hooks/usePageMeta';


export default function DesabonnementPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const { unsubscribeFromEmails } = useUnsubscribeFromEmails();
  const [status, setStatus] = useState('pending'); // pending | success | error | missing

  usePageMeta({
    title: 'Désabonnement',
    description: 'Se désabonner des e-mails HubertApp.',
    path: '/desabonnement',
    noIndex: true,
  });

  useEffect(() => {
    if (!userId) {
      setStatus('missing');
      return;
    }

    let cancelled = false;
    unsubscribeFromEmails(userId)
      .then((ok) => {
        if (!cancelled) setStatus(ok ? 'success' : 'error');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => { cancelled = true; };
  }, [userId]);

  return (
    <div className="min-h-screen bg-warm-bg text-ink flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-5">
          <i
            className={`fa-solid ${
              status === 'success'
                ? 'fa-envelope-circle-check'
                : status === 'error' || status === 'missing'
                ? 'fa-triangle-exclamation'
                : 'fa-envelope'
            } text-teal text-[20px]`}
          />
        </div>

        {status === 'pending' && (
          <p className="text-[14px] text-soft">Désabonnement en cours…</p>
        )}

        {status === 'success' && (
          <>
            <h1 className="text-[18px] font-bold mb-2">Vous êtes désabonné</h1>
            <p className="text-[14px] text-soft leading-relaxed">
              Vous ne recevrez plus d'e-mails de HubertApp. Vous pouvez réactiver ces
              notifications à tout moment depuis vos paramètres.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-[18px] font-bold mb-2">Une erreur est survenue</h1>
            <p className="text-[14px] text-soft leading-relaxed">
              Le désabonnement n'a pas pu être pris en compte. Réessayez dans quelques
              instants, ou gérez vos préférences directement depuis vos paramètres.
            </p>
          </>
        )}

        {status === 'missing' && (
          <>
            <h1 className="text-[18px] font-bold mb-2">Lien invalide</h1>
            <p className="text-[14px] text-soft leading-relaxed">
              Ce lien de désabonnement est incomplet. Gérez vos préférences de
              notifications directement depuis votre compte.
            </p>
          </>
        )}

        <Link
          to="/notifications"
          className="pressable inline-flex items-center justify-center gap-2 mt-6 h-11 px-5 rounded-xl bg-ink text-white text-[14px] font-semibold"
        >
          Gérer mes préférences
        </Link>
      </div>
    </div>
  );
}
