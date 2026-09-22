import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../src/api/stops', () => ({
  fetchSearchStops: vi.fn(),
}));

import { fetchSearchStops } from '../../src/api/stops';
import { useGeneralSearch } from '../../src/hooks/useGeneralSearch';

const settle = () => act(async () => { vi.advanceTimersByTime(250); });

const gare = {
  id: 's1',
  name: 'Gare Routière',
  network: { name: 'Le Met', cityOrRegion: 'Metz' },
  location: { latitude: 49.1097, longitude: 6.1778 },
};

describe('useGeneralSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    fetchSearchStops.mockResolvedValue([]);
  });

  afterEach(() => vi.useRealTimers());

  it('should group stop matches under a titled section of typed results', async () => {
    fetchSearchStops.mockResolvedValue([gare]);

    const { result } = renderHook(() => useGeneralSearch('gare'));
    await settle();

    expect(result.current.sections).toEqual([
      {
        type: 'stop',
        title: 'Arrêts',
        results: [expect.objectContaining({ type: 'stop', id: 's1', label: 'Gare Routière' })],
      },
    ]);
  });

  // Une section vide afficherait un en-tête « Arrêts » suivi de rien.
  it('should omit a section that has no match', async () => {
    fetchSearchStops.mockResolvedValue([]);

    const { result } = renderHook(() => useGeneralSearch('zzzz'));
    await settle();

    expect(result.current.sections).toEqual([]);
  });

  it('should report that a search is running', async () => {
    const { result } = renderHook(() => useGeneralSearch('gare'));

    expect(result.current.loading).toBe(true);
    await settle();
    expect(result.current.loading).toBe(false);
  });

  it('should surface a provider failure', async () => {
    fetchSearchStops.mockRejectedValue(new Error('Réseau indisponible'));

    const { result } = renderHook(() => useGeneralSearch('gare'));
    await settle();

    expect(result.current.error).toBe('Réseau indisponible');
    expect(result.current.sections).toEqual([]);
  });

  it('should stay idle while the query is under the search threshold', async () => {
    const { result } = renderHook(() => useGeneralSearch('g'));
    await settle();

    expect(fetchSearchStops).not.toHaveBeenCalled();
    expect(result.current.sections).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
