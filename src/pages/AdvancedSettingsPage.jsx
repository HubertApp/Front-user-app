import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import BackBar from '../components/layout/BackBar';
import BottomNav from '../components/layout/BottomNav';
import { useTheme } from '../context/ThemeContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCurrentUser, useDeleteAccount } from '../services/userService';

function DeleteAccountModal({ email, onClose, onConfirm, deleting }) {
  const [confirmText, setConfirmText] = useState('');
  const canDelete = confirmText.trim() === email;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: 'rgba(15,26,36,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-line w-full max-w-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base font-bold text-ink mb-1">Supprimer définitivement le compte</p>
        <p className="text-[12.5px] text-muted leading-relaxed mb-4">
          Cette action est irréversible. Votre profil, vos favoris et vos préférences seront
          supprimés. Pour confirmer, retapez votre adresse e-mail :
          <span className="font-semibold text-ink"> {email}</span>
        </p>

        <input
          type="email"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          onPaste={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          placeholder={email}
          autoComplete="off"
          className="w-full h-11 px-3.5 rounded-[10px] border border-line text-[13px] mb-4 outline-none focus:border-danger"
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-[10px] border border-line text-[13px] font-semibold text-ink"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={!canDelete || deleting}
            className="flex-1 h-11 rounded-[10px] text-[13px] font-bold text-white transition-colors"
            style={{
              backgroundColor: canDelete ? '#dc2626' : '#f1c8c3',
              cursor: canDelete && !deleting ? 'pointer' : 'not-allowed',
            }}
          >
            {deleting ? 'Suppression...' : 'Supprimer définitivement'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdvancedSettingsPage() {
  const { collapsed } = useTheme();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useCurrentUser();
  const { deleteAccount, loading: deleting } = useDeleteAccount();
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  usePageMeta({ title: 'Paramètres avancés', description: 'Paramètres avancés et suppression de compte.', path: '/parametres-avances', noIndex: true });

  const handleConfirmDelete = async () => {
    setError(null);
    try {
      await deleteAccount();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Erreur lors de la suppression du compte:', err);
      setError("La suppression a échoué, merci de réessayer.");
      setModalOpen(false);
    }
  };

  return (
    <div className={`min-h-screen bg-warm-bg text-ink pb-28 md:pb-12 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
      <main id="main-content" className="max-w-md mx-auto px-5 md:px-8">
        <BackBar to="/compte" />
        <PageHeader eyebrow="Votre espace" title="Paramètres avancés" />

        <section className="mb-5">
          <h4 className="h-section mb-2 px-1">Zone de danger</h4>
          <div className="bg-warm-card rounded-2xl border border-[#F1C8C3] p-4">
            <p className="text-sm font-semibold text-ink mb-1">Supprimer mon compte</p>
            <p className="text-[12.5px] text-muted leading-relaxed mb-3">
              Supprime définitivement votre profil et vos données associées. Cette action est
              irréversible.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              disabled={userLoading || !user}
              className="w-full h-11 rounded-[10px] border border-[#F1C8C3] text-danger text-[13px] font-bold hover:bg-danger hover:text-white transition-colors"
            >
              <i className="fa-solid fa-trash-can mr-2" />
              Supprimer mon compte
            </button>
            {error && <p className="text-[12px] text-danger mt-2">{error}</p>}
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-warm-card rounded-2xl border border-line divide-y divide-line-soft overflow-hidden">
            <button
              onClick={() => navigate('/a-propos')}
              className="pressable w-full flex items-center gap-3 px-3.5 py-3.5 text-left"
            >
              <span className="w-8 h-8 rounded-[10px] bg-teal-soft text-teal-hover inline-flex items-center justify-center text-[13px] shrink-0">
                <i className="fa-solid fa-circle-info" />
              </span>
              <p className="text-sm font-semibold text-ink flex-1">À propos de Hubert</p>
              <i className="fa-solid fa-chevron-right text-soft text-[11px]" />
            </button>
          </div>
        </section>

      </main>

      {modalOpen && user && (
        <DeleteAccountModal
          email={user.email}
          deleting={deleting}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      <BottomNav />
    </div>
  );
}
