import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import NotificationCenter from '../../src/components/notifications/NotificationCenter';
import {
  GET_ALL_NOTIFICATIONS_QUERY,
  MARK_NOTIFICATION_AS_READ_MUTATION,
} from '../../src/services/notificationService';

const notif = (id, content) => ({
  __typename: 'Notification',
  id,
  content,
  type: 'MANUAL',
  source: 'test',
  triggeredBy: null,
  isRead: false,
  createdAt: new Date().toISOString(),
});

function mockList(notifications) {
  return {
    request: { query: GET_ALL_NOTIFICATIONS_QUERY },
    result: { data: { getAllNotifications: notifications } },
  };
}

function mockMarkAsRead(id) {
  return {
    request: { query: MARK_NOTIFICATION_AS_READ_MUTATION, variables: { id } },
    result: { data: { markNotificationAsRead: { __typename: 'Notification', id, isRead: true } } },
  };
}

describe('NotificationCenter', () => {
  it('should not show the unread indicator when there are no notifications', async () => {
    renderWithProviders(<NotificationCenter />, { mocks: [mockList([])] });

    await waitFor(() => {
      // Attend la fin du fetch initial avant d'affirmer une absence.
      expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    });

    expect(document.querySelector('.bg-danger')).not.toBeInTheDocument();
  });

  it('should show the unread indicator and list notifications when the panel is opened', async () => {
    const notifications = [notif('n1', 'Trafic perturbé ligne 3'), notif('n2', 'Bienvenue sur Hubert')];
    renderWithProviders(<NotificationCenter />, {
      // Le test démonte le composant avec le panneau encore ouvert : l'effet
      // de nettoyage marque alors comme lues toutes les notifs vues (voir
      // seenIdsRef dans NotificationCenter.jsx) -- il faut des mocks pour
      // absorber ces appels, sinon rejet non intercepté par MockedProvider.
      mocks: [mockList(notifications), mockMarkAsRead('n1'), mockMarkAsRead('n2')],
    });

    await waitFor(() => expect(document.querySelector('.bg-danger')).toBeInTheDocument());

    await userEvent.click(screen.getByLabelText('Notifications'));

    expect(await screen.findByText('Trafic perturbé ligne 3')).toBeInTheDocument();
    expect(screen.getByText('Bienvenue sur Hubert')).toBeInTheDocument();
  });

  it('should show an empty state message when the panel is opened with zero notifications', async () => {
    renderWithProviders(<NotificationCenter />, { mocks: [mockList([])] });

    await userEvent.click(screen.getByLabelText('Notifications'));

    expect(await screen.findByText("Vous n'avez aucune notification.")).toBeInTheDocument();
  });

  it('should mark a notification as read when clicked directly', async () => {
    const notifications = [notif('n1', 'Trafic perturbé ligne 3')];
    const markAsReadMock = mockMarkAsRead('n1');
    const markAsReadSpy = vi.fn();
    markAsReadMock.result = () => {
      markAsReadSpy();
      return { data: { markNotificationAsRead: { __typename: 'Notification', id: 'n1', isRead: true } } };
    };
    // Un clic direct sur une notif ne la retire pas de seenIdsRef (voir
    // NotificationCenter.jsx) : à la fermeture/démontage du panneau, elle
    // sera marquée lue une seconde fois -- comportement idempotent réel,
    // donc un second mock est nécessaire pour ne pas casser le test.
    const secondMarkAsReadMock = mockMarkAsRead('n1');

    renderWithProviders(<NotificationCenter />, {
      mocks: [mockList(notifications), markAsReadMock, secondMarkAsReadMock],
    });

    await userEvent.click(screen.getByLabelText('Notifications'));
    const item = await screen.findByText('Trafic perturbé ligne 3');
    await userEvent.click(item);

    await waitFor(() => expect(markAsReadSpy).toHaveBeenCalled());
  });

  it('should mark all displayed notifications as read when the panel is closed via outside click', async () => {
    const notifications = [notif('n1', 'Alerte A'), notif('n2', 'Alerte B')];
    const spyA = vi.fn();
    const spyB = vi.fn();
    const mockA = mockMarkAsRead('n1');
    mockA.result = () => {
      spyA();
      return { data: { markNotificationAsRead: { __typename: 'Notification', id: 'n1', isRead: true } } };
    };
    const mockB = mockMarkAsRead('n2');
    mockB.result = () => {
      spyB();
      return { data: { markNotificationAsRead: { __typename: 'Notification', id: 'n2', isRead: true } } };
    };

    renderWithProviders(
      <div>
        <NotificationCenter />
        <button>Ailleurs</button>
      </div>,
      { mocks: [mockList(notifications), mockA, mockB] },
    );

    await userEvent.click(screen.getByLabelText('Notifications'));
    await screen.findByText('Alerte A');

    // Clic en dehors du panneau : ferme le centre de notifications, ce qui
    // doit marquer comme lues toutes les notifs vues pendant l'ouverture
    // (voir seenIdsRef dans NotificationCenter.jsx), même sans clic individuel.
    await userEvent.click(screen.getByText('Ailleurs'));

    await waitFor(() => {
      expect(spyA).toHaveBeenCalled();
      expect(spyB).toHaveBeenCalled();
    });
  });
});
