import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import BackBar from '../components/layout/BackBar';
import BottomNav from '../components/layout/BottomNav';
import { SettingRow, SettingsSection } from '../components/ui/SettingRow';
import {
  useCurrentUser,
  useUpdateNotificationPreferences,
} from '../services/userService';
import { useTheme } from '../context/ThemeContext';
import { usePageMeta } from '../hooks/usePageMeta';

const ALL_CHANNELS = ['IN_APP', 'EMAIL'];

export default function NotificationsSettingsPage() {
  const { collapsed } = useTheme();
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();
  const { updateNotificationPreferences } = useUpdateNotificationPreferences();
  usePageMeta({
    title: 'Notifications',
    description: 'Choisissez les notifications que vous souhaitez recevoir.',
    path: '/notifications',
    noIndex: true,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return null;
  }

  const disabledChannels = user.notificationChannelsDisabled || [];
  const isChannelEnabled = (channel) => !disabledChannels.includes(channel);
  const toggleChannel = (channel) => {
    const next = isChannelEnabled(channel)
      ? [...disabledChannels, channel]
      : disabledChannels.filter((c) => c !== channel);
    updateNotificationPreferences(next);
  };

  return (
    <div className={`min-h-screen bg-warm-bg text-ink pb-28 md:pb-12 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
      <main id="main-content" className="max-w-md mx-auto px-5 md:px-8">
        <BackBar to="/compte" />
        <PageHeader eyebrow="Votre espace" title="Notifications" />

        <p className="text-[12.5px] text-muted leading-relaxed mb-4">
          Choisissez comment Hubert peut vous contacter. D'autres types de notifications
          (alertes trafic, rappels de départ…) viendront s'ajouter ici au fil des prochaines
          fonctionnalités.
        </p>

        <SettingsSection title="Tout activer / désactiver">
          <SettingRow
            icon="fa-toggle-on"
            label="Toutes les notifications"
            sub={disabledChannels.length === 0 ? 'Tout est activé' : 'Certaines notifications sont désactivées'}
            trailing={<span className={`togg ${disabledChannels.length === 0 ? '' : 'off'}`} />}
            onClick={() =>
              updateNotificationPreferences(disabledChannels.length === 0 ? ALL_CHANNELS : [])
            }
          />
        </SettingsSection>

        <SettingsSection title="Canaux">
          <SettingRow
            icon="fa-bell"
            label="Notifications dans l'app"
            sub="Visibles dans le centre de notifications"
            trailing={<span className={`togg ${isChannelEnabled('IN_APP') ? '' : 'off'}`} />}
            onClick={() => toggleChannel('IN_APP')}
          />
          <SettingRow
            icon="fa-envelope"
            label="Notifications par e-mail"
            sub="Récapitulatifs et alertes envoyés par e-mail"
            trailing={<span className={`togg ${isChannelEnabled('EMAIL') ? '' : 'off'}`} />}
            onClick={() => toggleChannel('EMAIL')}
          />
        </SettingsSection>
      </main>

      <BottomNav />
    </div>
  );
}
