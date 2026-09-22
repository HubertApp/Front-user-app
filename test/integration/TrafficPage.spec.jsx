import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';

vi.mock('../../src/api/stops', () => ({
  fetchStopsNearby: vi.fn(),
  fetchSearchStops: vi.fn(),
}));

vi.mock('../../src/components/map/MapView', () => ({
  default: () => <div data-testid="map" />,
}));

import { fetchStopsNearby, fetchSearchStops } from '../../src/api/stops';
import TrafficPage from '../../src/pages/TrafficPage';

const nearby = [{ id: 's1', name: 'République', distanceMeters: 120, routes: [] }];
const found = [
  { id: 's9', name: 'Gare Routière', network: { name: 'Le Met', cityOrRegion: 'Metz' }, routes: [] },
];

async function openNearbyTab() {
  await userEvent.click(screen.getByRole('button', { name: /ma position/i }));
}

function renderTrafficPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/trafic" element={<TrafficPage />} />
      <Route path="/arret/:id" element={<h1>Fiche arrêt</h1>} />
    </Routes>,
    { route: '/trafic' },
  );
}

describe('TrafficPage — recherche d\'arrêts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchStopsNearby.mockResolvedValue(nearby);
    fetchSearchStops.mockResolvedValue(found);
  });

  it('should keep showing the nearby stops while the query is too short', async () => {
    renderTrafficPage();
    await openNearbyTab();

    await userEvent.type(screen.getByRole('searchbox'), 'G');

    await waitFor(() => expect(screen.getByText('République')).toBeInTheDocument());
    expect(fetchSearchStops).not.toHaveBeenCalled();
  });

  it('should replace the nearby stops with the search results', async () => {
    renderTrafficPage();
    await openNearbyTab();

    await userEvent.type(screen.getByRole('searchbox'), 'gare');

    expect(await screen.findByText('Gare Routière')).toBeInTheDocument();
    expect(screen.queryByText('République')).not.toBeInTheDocument();
  });

  it('should tell the user when nothing matches the query', async () => {
    fetchSearchStops.mockResolvedValue([]);

    renderTrafficPage();
    await openNearbyTab();

    await userEvent.type(screen.getByRole('searchbox'), 'zzzz');

    expect(await screen.findByText(/aucun arrêt ne correspond/i)).toBeInTheDocument();
  });

  it('should open the stop sheet when a nearby stop is tapped', async () => {
    renderTrafficPage();
    await openNearbyTab();

    await userEvent.click(await screen.findByRole('button', { name: /République/ }));

    expect(await screen.findByRole('heading', { name: 'Fiche arrêt' })).toBeInTheDocument();
  });

  it('should open the stop sheet when a search result is tapped', async () => {
    renderTrafficPage();
    await openNearbyTab();

    await userEvent.type(screen.getByRole('searchbox'), 'gare');
    await userEvent.click(await screen.findByRole('button', { name: /Gare Routière/ }));

    expect(await screen.findByRole('heading', { name: 'Fiche arrêt' })).toBeInTheDocument();
  });
});
