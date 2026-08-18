import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import HomePage from '../../src/pages/HomePage';
import { GET_ME_QUERY } from '../../src/services/userService';
import { GET_ALL_NOTIFICATIONS_QUERY } from '../../src/services/notificationService';

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

describe('HomePage', () => {
  it('should greet the authenticated user by pseudo once the profile has loaded', async () => {
    const user = {
      __typename: 'User',
      googleId: 'google-123',
      email: 'noe@example.com',
      age: 25,
      pseudo: 'noe',
      role: 'user',
      photo: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    renderWithProviders(<HomePage />, {
      route: '/',
      mocks: [meMock(user), notificationsMock],
    });

    await waitFor(() => expect(screen.getByText('Bonjour, noe')).toBeInTheDocument());
  });

  it('should fall back to "voyageur" when there is no authenticated user', async () => {
    renderWithProviders(<HomePage />, {
      route: '/',
      mocks: [meMock(null), notificationsMock],
    });

    await waitFor(() => expect(screen.getByText('Bonjour, voyageur')).toBeInTheDocument());
  });

  it('should render the main quick actions and the frequent routes', async () => {
    renderWithProviders(<HomePage />, {
      route: '/',
      mocks: [meMock(null), notificationsMock],
    });

    // "Favoris"/"Trafic"/"Voyages" apparaissent aussi dans BottomNav (barre
    // mobile + sidebar desktop, toutes deux rendues en même temps en jsdom) :
    // on vérifie la présence, pas l'unicité.
    expect(screen.getAllByText('Favoris').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Trafic').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Voyages').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Paramètres').length).toBeGreaterThan(0);
  });
});
