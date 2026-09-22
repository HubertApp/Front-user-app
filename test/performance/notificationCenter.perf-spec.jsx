// Équivalent front des tests de charge back (voir MS-User /
// MS-notifications test/performance/*.perf-spec.ts) : pas de serveur à
// bombarder côté SPA statique, donc on mesure plutôt le rendu déterministe
// sous volume de données (jsdom) et la robustesse sous interactions rapides.
// Pour un vrai test de charge HTTP contre la gateway GraphQL, voir le script
// équivalent côté microservice (MS-User/scripts/load-test.mjs) qui tape déjà
// sur getMe/getAllNotifications réellement consommés par ce front.
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import NotificationCenter from '../../src/components/notifications/NotificationCenter';
import {
  GET_ALL_NOTIFICATIONS_QUERY,
  MARK_NOTIFICATION_AS_READ_MUTATION,
} from '../../src/services/notificationService';

function makeNotifications(count) {
  return Array.from({ length: count }, (_, i) => ({
    __typename: 'Notification',
    id: `n${i}`,
    content: `Notification numéro ${i}`,
    type: 'MANUAL',
    source: 'perf-test',
    triggeredBy: null,
    isRead: false,
    createdAt: new Date().toISOString(),
  }));
}

function mockList(notifications) {
  return {
    request: { query: GET_ALL_NOTIFICATIONS_QUERY },
    result: { data: { getAllNotifications: notifications } },
  };
}

// À la fermeture/démontage du panneau, NotificationCenter marque comme lues
// toutes les notifs vues pendant l'ouverture (voir seenIdsRef) : il faut un
// mock markAsRead par id présent, sinon MockedProvider lève un rejet non
// intercepté pour chaque appel sans réponse simulée.
function markAsReadMocksFor(notifications) {
  return notifications.map((n) => ({
    request: { query: MARK_NOTIFICATION_AS_READ_MUTATION, variables: { id: n.id } },
    result: { data: { markNotificationAsRead: { __typename: 'Notification', id: n.id, isRead: true } } },
  }));
}

describe('NotificationCenter (performance)', () => {
  it('shouldRenderALargeNotificationListWithinABoundedTime', async () => {
    const COUNT = 500;
    const notifications = makeNotifications(COUNT);

    const start = performance.now();
    renderWithProviders(<NotificationCenter />, {
      mocks: [mockList(notifications), ...markAsReadMocksFor(notifications)],
    });

    await waitFor(() => expect(document.querySelector('.bg-danger')).toBeInTheDocument());

    await userEvent.click(screen.getByLabelText('Notifications'));
    await screen.findByText('Notification numéro 0');
    await screen.findByText(`Notification numéro ${COUNT - 1}`);
    const elapsedMs = performance.now() - start;

    // Budget large et déterministe (jsdom, pas de vrai réseau) : sert de
    // garde-fou contre une régression grossière (ex: re-render en O(n²)),
    // pas une mesure de perf navigateur réelle.
    expect(elapsedMs).toBeLessThan(5000);
    expect(screen.getAllByText(/Notification numéro/)).toHaveLength(COUNT);
  }, 20000);

  it('shouldStayResponsiveWhenTogglingTheBellRapidlyManyTimes', async () => {
    // Liste vide ici volontairement : avec des notifs réelles, un cycle
    // ouverture/fermeture déclenche markAsRead (voir seenIdsRef), et sa
    // résolution asynchrone entre en course avec les clics suivants
    // (nombre de mocks nécessaires non déterministe). Ce test cible
    // uniquement la robustesse du toggle d'UI, pas la persistance des
    // lectures sous charge (déjà couverte par les tests d'intégration).
    renderWithProviders(<NotificationCenter />, { mocks: [mockList([])] });
    await waitFor(() => expect(screen.getByLabelText('Notifications')).toBeInTheDocument());

    const bell = screen.getByLabelText('Notifications');
    const start = performance.now();
    for (let i = 0; i < 30; i++) {
      await userEvent.click(bell);
    }
    const elapsedMs = performance.now() - start;

    expect(elapsedMs).toBeLessThan(10000);
    // Nombre pair de clics : le panneau doit être revenu à son état fermé,
    // sans exception jetée par les effets de nettoyage.
    expect(screen.queryByText("Vous n'avez aucune notification.")).not.toBeInTheDocument();
  }, 20000);
});
