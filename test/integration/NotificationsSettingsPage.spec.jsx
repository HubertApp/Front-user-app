import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import { ThemeProvider } from '../../src/context/ThemeContext';
import NotificationsSettingsPage from '../../src/pages/NotificationsSettingsPage';
import {
  GET_ME_QUERY,
  UPDATE_NOTIFICATION_PREFERENCES_MUTATION,
} from '../../src/services/userService';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    set: vi.fn(async () => undefined),
    get: vi.fn(async () => ({ value: 'fake-jwt' })),
    remove: vi.fn(async () => undefined),
  },
}));

function meMock(user) {
  return {
    request: { query: GET_ME_QUERY },
    result: { data: { getMe: user } },
  };
}

function updateNotifMock(disabledChannels, resultDisabledChannels) {
  return {
    request: {
      query: UPDATE_NOTIFICATION_PREFERENCES_MUTATION,
      variables: { disabledChannels },
    },
    result: {
      data: {
        updateNotificationPreferences: {
          __typename: 'GetUserResponse',
          googleId: 'google-123',
          notificationChannelsDisabled: resultDisabledChannels,
        },
      },
    },
  };
}

function renderPage(user, extraMocks = []) {
  return render(
    <MemoryRouter initialEntries={['/notifications']}>
      <ThemeProvider>
        <MockedProvider mocks={[meMock(user), ...extraMocks]}>
          <Routes>
            <Route path="/notifications" element={<NotificationsSettingsPage />} />
            <Route path="/login" element={<div>Page de connexion</div>} />
            <Route path="/compte" element={<div>Page compte</div>} />
          </Routes>
        </MockedProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

const user = {
  __typename: 'User',
  googleId: 'google-123',
  email: 'noe@example.com',
  age: 25,
  pseudo: 'noe',
  role: 'user',
  photo: null,
  notificationChannelsDisabled: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe('NotificationsSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to /login when there is no authenticated user', async () => {
    renderPage(null);

    expect(await screen.findByText('Page de connexion')).toBeInTheDocument();
  });

  it('should display both channels as enabled by default', async () => {
    renderPage(user);

    const inApp = await screen.findByText("Notifications dans l'app");
    const email = await screen.findByText('Notifications par e-mail');

    expect(inApp.closest('.pressable').querySelector('.togg')).not.toHaveClass('off');
    expect(email.closest('.pressable').querySelector('.togg')).not.toHaveClass('off');
  });

  it('should disable in-app notifications when its toggle is clicked', async () => {
    renderPage(user, [
      updateNotifMock(['IN_APP'], ['IN_APP']),
      meMock({ ...user, notificationChannelsDisabled: ['IN_APP'] }),
    ]);

    const row = (await screen.findByText("Notifications dans l'app")).closest('.pressable');
    await userEvent.click(row);

    await waitFor(() => expect(row.querySelector('.togg')).toHaveClass('off'));
  });

  it('should show the master switch on when every channel is enabled', async () => {
    renderPage(user);

    const row = (await screen.findByText('Toutes les notifications')).closest('.pressable');
    expect(row.querySelector('.togg')).not.toHaveClass('off');
    expect(screen.getByText('Tout est activé')).toBeInTheDocument();
  });

  it('should show the master switch off when at least one channel is disabled', async () => {
    renderPage({ ...user, notificationChannelsDisabled: ['EMAIL'] });

    const row = (await screen.findByText('Toutes les notifications')).closest('.pressable');
    expect(row.querySelector('.togg')).toHaveClass('off');
    expect(screen.getByText('Certaines notifications sont désactivées')).toBeInTheDocument();
  });

  it('should disable every channel when the master switch is clicked while everything is on', async () => {
    renderPage(user, [
      updateNotifMock(['IN_APP', 'EMAIL'], ['IN_APP', 'EMAIL']),
      meMock({ ...user, notificationChannelsDisabled: ['IN_APP', 'EMAIL'] }),
    ]);

    const masterRow = (await screen.findByText('Toutes les notifications')).closest('.pressable');
    await userEvent.click(masterRow);

    await waitFor(async () => {
      const inApp = screen.getByText("Notifications dans l'app").closest('.pressable');
      const email = screen.getByText('Notifications par e-mail').closest('.pressable');
      expect(inApp.querySelector('.togg')).toHaveClass('off');
      expect(email.querySelector('.togg')).toHaveClass('off');
    });
  });

  it('should re-enable every channel when the master switch is clicked while something is off', async () => {
    renderPage(
      { ...user, notificationChannelsDisabled: ['IN_APP', 'EMAIL'] },
      [updateNotifMock([], []), meMock({ ...user, notificationChannelsDisabled: [] })],
    );

    const masterRow = (await screen.findByText('Toutes les notifications')).closest('.pressable');
    await userEvent.click(masterRow);

    await waitFor(async () => {
      const inApp = screen.getByText("Notifications dans l'app").closest('.pressable');
      const email = screen.getByText('Notifications par e-mail').closest('.pressable');
      expect(inApp.querySelector('.togg')).not.toHaveClass('off');
      expect(email.querySelector('.togg')).not.toHaveClass('off');
    });
  });
});
