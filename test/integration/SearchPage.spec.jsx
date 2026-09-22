import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';

vi.mock('../../src/api/stops', () => ({
  fetchSearchStops: vi.fn(),
}));

vi.mock('../../src/components/map/MapView', () => ({
  default: () => <div data-testid="map" />,
}));

import { fetchSearchStops } from '../../src/api/stops';
import SearchPage from '../../src/pages/SearchPage';

const gare = {
  id: 's1',
  name: 'Gare Routière',
  network: { name: 'Le Met', cityOrRegion: 'Metz' },
  location: { latitude: 49.1097, longitude: 6.1778 },
};

function renderSearchPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/recherche" element={<SearchPage />} />
      <Route path="/arret/:id" element={<h1>Fiche arrêt</h1>} />
    </Routes>,
    { route: '/recherche' },
  );
}

const searchBox = () => screen.getByPlaceholderText(/rechercher/i);

describe('SearchPage — recherche généraliste', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchSearchStops.mockResolvedValue([gare]);
  });

  it('should group matching stops under their own section', async () => {
    renderSearchPage();

    await userEvent.type(searchBox(), 'gare');

    expect(await screen.findByText('Arrêts')).toBeInTheDocument();
    expect(screen.getByText('Gare Routière')).toBeInTheDocument();
    expect(screen.getByText(/Metz/)).toBeInTheDocument();
  });

  // Le type du résultat décide de la destination : un arrêt a une fiche.
  it('should open the stop sheet when a stop result is tapped', async () => {
    renderSearchPage();

    await userEvent.type(searchBox(), 'gare');
    // Le bouton d'itinéraire porte lui aussi le nom de l'arrêt : on vise la
    // ligne de résultat, qui commence par lui.
    await userEvent.click(await screen.findByRole('button', { name: /^Gare Routière/ }));

    expect(await screen.findByRole('heading', { name: 'Fiche arrêt' })).toBeInTheDocument();
  });

  // Un arrêt porte ses coordonnées : il vaut aussi comme extrémité de trajet,
  // mais seulement sur une action explicite.
  it('should start an itinerary to the stop from its secondary action', async () => {
    renderSearchPage();

    await userEvent.type(searchBox(), 'gare');
    await userEvent.click(await screen.findByRole('button', { name: /itinéraire vers Gare Routière/i }));

    expect(await screen.findByRole('heading', { name: /votre itinéraire/i })).toBeInTheDocument();
  });

  it('should keep the saved places while the query is under the threshold', async () => {
    renderSearchPage();

    await userEvent.type(searchBox(), 'g');

    expect(screen.getByText('Lieux enregistrés')).toBeInTheDocument();
    expect(fetchSearchStops).not.toHaveBeenCalled();
  });

  it('should tell the user when nothing matches the query', async () => {
    fetchSearchStops.mockResolvedValue([]);

    renderSearchPage();

    await userEvent.type(searchBox(), 'zzzz');

    expect(await screen.findByText(/aucun résultat/i)).toBeInTheDocument();
  });
});
