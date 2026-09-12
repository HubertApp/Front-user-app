import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import { ThemeProvider } from '../../src/context/ThemeContext';
import AccountPage from '../../src/pages/AccountPage';
import { GET_ME_QUERY } from '../../src/services/userService';
import { GET_ALL_NOTIFICATIONS_QUERY } from '../../src/services/notificationService';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    set: vi.fn(async () => undefined),
    get: vi.fn(async () => ({ value: 'fake-jwt' })),
    remove: vi.fn(async () => undefined),
  },
}));

const notificationsMock = {
  request: { query: GET_ALL_NOTIFICATIONS_QUERY },
  result: { data: { getAllNotifications: [] } },
};

function meMock(user) {
  return {
    request: { query: GET_ME_QUERY },
    result: { data: { getMe: user } },
  };
}

function renderAccountPage(user, extraMocks = []) {
  return render(
    <MemoryRouter initialEntries={['/compte']}>
      <ThemeProvider>
        <MockedProvider mocks={[meMock(user), notificationsMock, ...extraMocks]}>
          <Routes>
            <Route path="/compte" element={<AccountPage />} />
            <Route path="/login" element={<div>Page de connexion</div>} />
            <Route path="/notifications" element={<div>Page notifications</div>} />
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

describe('AccountPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display the authenticated user profile once loaded', async () => {
    renderAccountPage(user);

    expect(await screen.findByText('noe')).toBeInTheDocument();
    expect(screen.getByText('noe@example.com')).toBeInTheDocument();
  });

  it('should redirect to /login when there is no authenticated user', async () => {
    renderAccountPage(null);

    expect(await screen.findByText('Page de connexion')).toBeInTheDocument();
  });

  it('should clear the token, clear the Apollo store, and navigate to /login on logout', async () => {
    const { Preferences } = await import('@capacitor/preferences');
    renderAccountPage(user);

    await screen.findByText('noe');
    await userEvent.click(screen.getByText('Se déconnecter'));

    await waitFor(() => expect(Preferences.remove).toHaveBeenCalledWith({ key: 'jwt' }));
    expect(await screen.findByText('Page de connexion')).toBeInTheDocument();
  });

  it('should show a summary of the notification preferences and link to the dedicated page', async () => {
    renderAccountPage(user);

    const label = await screen.findByText('Notifications');
    expect(screen.getByText('Activées')).toBeInTheDocument();

    await userEvent.click(label.closest('.pressable'));

    expect(await screen.findByText('Page notifications')).toBeInTheDocument();
  });

  it('should summarize partially and fully disabled channels', async () => {
    renderAccountPage({ ...user, notificationChannelsDisabled: ['EMAIL'] });
    expect(await screen.findByText('E-mail désactivé')).toBeInTheDocument();
  });
});
