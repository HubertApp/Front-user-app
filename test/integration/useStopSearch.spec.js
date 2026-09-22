import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../src/api/stops', () => ({
  fetchSearchStops: vi.fn(),
}));

import { fetchSearchStops } from '../../src/api/stops';
import { useStopSearch } from '../../src/hooks/useStopSearch';

const DEBOUNCE_MS = 250;

function renderSearch(initialQuery) {
  return renderHook(({ query }) => useStopSearch(query), {
    initialProps: { query: initialQuery },
  });
}

// Laisse passer le debounce puis vide la file de microtâches, pour que la
// promesse de fetchSearchStops soit résolue quand on lit le résultat.
async function settle(ms = DEBOUNCE_MS) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

describe('useStopSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    fetchSearchStops.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Sous 2 caractères normalisés, le resolver lève une ValueError : appeler
  // reviendrait à afficher une erreur à l'utilisateur pendant qu'il tape.
  it('should not call the API while the query is under the search threshold', async () => {
    const { result } = renderSearch('G');

    await settle();

    expect(fetchSearchStops).not.toHaveBeenCalled();
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should issue a single request once the user stops typing', async () => {
    const { rerender } = renderSearch('ga');
    rerender({ query: 'gar' });
    rerender({ query: 'gare' });

    await settle();

    expect(fetchSearchStops).toHaveBeenCalledTimes(1);
    expect(fetchSearchStops).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'gare' }),
    );
  });

  it('should expose the stops returned for the query', async () => {
    const stops = [{ id: 's1', name: 'Gare Routière' }];
    fetchSearchStops.mockResolvedValue(stops);

    const { result } = renderSearch('gare');
    await settle();

    expect(result.current.results).toEqual(stops);
    expect(result.current.error).toBeNull();
  });

  it('should expose an error message and no results when the request fails', async () => {
    fetchSearchStops.mockRejectedValue(new Error('Réseau indisponible'));

    const { result } = renderSearch('gare');
    await settle();

    expect(result.current.error).toBe('Réseau indisponible');
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  // Sans annulation, la réponse d'une frappe antérieure peut arriver après la
  // bonne et écraser les résultats affichés.
  it('should abort the in-flight request when the query changes', async () => {
    const { rerender } = renderSearch('gare');
    await settle();

    const { signal } = fetchSearchStops.mock.calls[0][0];
    expect(signal.aborted).toBe(false);

    rerender({ query: 'republique' });
    await settle();

    expect(signal.aborted).toBe(true);
  });

  // Le bandeau d'erreur propose « Réessayer » : sans relance, le bouton ne
  // ferait rien tant que la saisie ne change pas.
  it('should run the same query again on demand', async () => {
    fetchSearchStops.mockRejectedValueOnce(new Error('Réseau indisponible'));

    const { result } = renderSearch('gare');
    await settle();
    expect(result.current.error).toBe('Réseau indisponible');

    fetchSearchStops.mockResolvedValue([{ id: 's1', name: 'Gare' }]);
    act(() => result.current.refetch());
    await settle();

    expect(fetchSearchStops).toHaveBeenCalledTimes(2);
    expect(result.current.error).toBeNull();
    expect(result.current.results).toHaveLength(1);
  });

  it('should clear results when the query falls back under the threshold', async () => {
    fetchSearchStops.mockResolvedValue([{ id: 's1', name: 'Gare' }]);

    const { result, rerender } = renderSearch('gare');
    await settle();
    expect(result.current.results).toHaveLength(1);

    rerender({ query: '' });
    await settle();

    expect(result.current.results).toEqual([]);
  });
});
