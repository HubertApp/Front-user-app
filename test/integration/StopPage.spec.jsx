import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, renderWithProviders } from '../test-utils';
import { ThemeProvider } from '../../src/context/ThemeContext';

vi.mock('../../src/api/stops', () => ({
  fetchStop: vi.fn(),
}));

// La carte n'est pas le sujet de cette page et mapbox-gl n'a pas de contexte
// WebGL sous jsdom.
vi.mock('../../src/components/map/MapView', () => ({
  default: () => <div data-testid="map" />,
}));

import { fetchStop } from '../../src/api/stops';
import StopPage from '../../src/pages/StopPage';

function renderStopPage(id = 's1') {
  return renderWithProviders(
    <Routes>
      <Route path="/arret/:id" element={<StopPage />} />
    </Routes>,
    { route: `/arret/${id}` },
  );
}

// Une fiche est toujours ouverte depuis un écran précédent (proximité ou
// recherche) : on reconstitue cet historique pour vérifier le retour.
function renderStopPageFrom(previousPath) {
  return render(
    <MemoryRouter initialEntries={[previousPath, '/arret/s1']} initialIndex={1}>
      <ThemeProvider>
        <Routes>
          <Route path={previousPath} element={<h1>Écran précédent</h1>} />
          <Route path="/arret/:id" element={<StopPage />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

const gare = {
  id: 's1',
  name: 'Gare Routière',
  location: { latitude: 49.1097, longitude: 6.1778 },
  network: { name: 'Le Met', cityOrRegion: 'Metz' },
  routes: [{ id: 'r1', shortName: 'A', longName: 'Ligne A', type: 0 }],
  departures: [],
};

describe('StopPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchStop.mockResolvedValue(gare);
  });

  it('should show the stop name and the network it belongs to', async () => {
    renderStopPage();

    expect(await screen.findByRole('heading', { name: 'Gare Routière' })).toBeInTheDocument();
    expect(screen.getByText(/Metz/)).toBeInTheDocument();
  });

  it('should list the next departures with their time, line and destination', async () => {
    fetchStop.mockResolvedValue({
      ...gare,
      departures: [
        {
          tripId: 't1',
          departureTime: '14:12:00',
          headsign: 'Woippy Saint-Éloy',
          route: { id: 'r1', shortName: 'A', longName: 'Ligne A', type: 0 },
        },
      ],
    });

    renderStopPage();

    // La ligne A figure aussi dans l'en-tête des lignes desservant l'arrêt :
    // on vise la ligne de passage, pas la page entière.
    const row = (await screen.findByText('14:12')).closest('li');

    expect(within(row).getByText('Woippy Saint-Éloy')).toBeInTheDocument();
    expect(within(row).getByText('A')).toBeInTheDocument();
  });

  // GTFS prolonge l'heure au-delà de 24 pour les courses d'après minuit :
  // « 01:30 » sans mention se lirait comme un passage déjà écoulé.
  it('should mark an after-midnight departure as being the next day', async () => {
    fetchStop.mockResolvedValue({
      ...gare,
      departures: [
        { tripId: 't1', departureTime: '25:30:00', headsign: 'Dépôt', route: null },
      ],
    });

    renderStopPage();

    expect(await screen.findByText('01:30')).toBeInTheDocument();
    expect(screen.getByText(/demain/i)).toBeInTheDocument();
  });

  // Les horaires viennent du GTFS statique : sans cette mention, « 14:12 » se
  // lit comme du temps réel.
  it('should state that the times are timetabled, not live', async () => {
    renderStopPage();

    expect(await screen.findByText(/horaires théoriques/i)).toBeInTheDocument();
  });

  it('should tell the user when no departure is left for today', async () => {
    renderStopPage();

    expect(await screen.findByText(/plus aucun passage/i)).toBeInTheDocument();
  });

  it('should offer a retry when the request fails', async () => {
    fetchStop.mockRejectedValueOnce(new Error('Réseau indisponible'));

    renderStopPage();

    expect(await screen.findByText('Réseau indisponible')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /réessayer/i }));

    await waitFor(() => expect(fetchStop).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole('heading', { name: 'Gare Routière' })).toBeInTheDocument();
  });

  // `stop(id:)` est nullable : un identifiant inconnu n'est pas une panne, et
  // proposer « Réessayer » ne mènerait nulle part.
  it('should show an unknown stop as not found rather than as a failure', async () => {
    fetchStop.mockResolvedValue(null);

    renderStopPage('inconnu');

    expect(await screen.findByText(/arrêt introuvable/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /réessayer/i })).not.toBeInTheDocument();
  });

  it('should take the user back to the screen they came from', async () => {
    renderStopPageFrom('/trafic');
    await screen.findByRole('heading', { name: 'Gare Routière' });

    // Deux affordances de retour coexistent (la barre de la page et celle de
    // l'en-tête mobile) : les deux doivent ramener en arrière.
    const [back] = screen.getAllByRole('button', { name: /retour/i });
    await userEvent.click(back);

    expect(await screen.findByRole('heading', { name: 'Écran précédent' })).toBeInTheDocument();
  });

  // Le bouton retour de PageHeader est en `md:hidden` : sur desktop la fiche
  // n'offrait plus aucun moyen de revenir, d'où la BackBar des pages de détail.
  it('should keep a back control visible on desktop', async () => {
    renderStopPageFrom('/trafic');
    await screen.findByRole('heading', { name: 'Gare Routière' });

    const backControls = screen.getAllByRole('button', { name: /retour/i });

    expect(backControls.some(b => !b.className.includes('md:hidden'))).toBe(true);
  });
});
