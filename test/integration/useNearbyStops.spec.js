import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

vi.mock('../../src/api/stops', () => ({
  fetchStopsNearby: vi.fn(),
}));

import { fetchStopsNearby } from '../../src/api/stops';
import { useNearbyStops } from '../../src/hooks/useNearbyStops';

describe('useNearbyStops', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should start in a loading state and expose the fetched stops', async () => {
    const stops = [{ id: 's1', name: 'Gare centrale', distanceMeters: 120 }];
    fetchStopsNearby.mockResolvedValue(stops);

    const { result } = renderHook(() => useNearbyStops({ lat: 49.12, lon: 6.18 }));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stops).toEqual(stops);
    expect(result.current.error).toBeNull();
    expect(fetchStopsNearby).toHaveBeenCalledWith(
      expect.objectContaining({ lat: 49.12, lon: 6.18, radiusMeters: 500, first: 20 }),
    );
  });

  it('should expose an error message and empty stops when the request fails', async () => {
    fetchStopsNearby.mockRejectedValue(new Error('Réseau indisponible'));

    const { result } = renderHook(() => useNearbyStops({ lat: 49.12, lon: 6.18 }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Réseau indisponible');
    expect(result.current.stops).toEqual([]);
  });

  it('should silently ignore AbortError rejections instead of surfacing them', async () => {
    const abortError = new Error('aborted');
    abortError.name = 'AbortError';
    fetchStopsNearby.mockRejectedValue(abortError);

    const { result } = renderHook(() => useNearbyStops({ lat: 49.12, lon: 6.18 }));

    // Laisse la microtask du .catch() s'exécuter ; loading reste true car ni
    // .then() ni la branche d'erreur normale ne s'exécutent pour un AbortError.
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toBeNull();
  });

  it('should issue a new request when lat/lon change', async () => {
    fetchStopsNearby.mockResolvedValue([]);

    const { result, rerender } = renderHook(
      ({ lat, lon }) => useNearbyStops({ lat, lon }),
      { initialProps: { lat: 49.12, lon: 6.18 } },
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ lat: 49.2, lon: 6.2 });
    await waitFor(() => expect(fetchStopsNearby).toHaveBeenCalledTimes(2));

    expect(fetchStopsNearby).toHaveBeenLastCalledWith(
      expect.objectContaining({ lat: 49.2, lon: 6.2 }),
    );
  });

  it('should re-issue the request when refetch() is called with unchanged inputs', async () => {
    fetchStopsNearby.mockResolvedValue([]);

    const { result } = renderHook(() => useNearbyStops({ lat: 49.12, lon: 6.18 }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.refetch());

    await waitFor(() => expect(fetchStopsNearby).toHaveBeenCalledTimes(2));
  });
});
