import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../src/api/stops', () => ({
  fetchStop: vi.fn(),
}));

import { fetchStop } from '../../src/api/stops';
import { useStop } from '../../src/hooks/useStop';

const flush = () => act(async () => {});

describe('useStop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 14, 5, 0));
    fetchStop.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should expose the stop and bound departures to the current time', async () => {
    const stop = { id: 's1', name: 'Gare Routière', departures: [] };
    fetchStop.mockResolvedValue(stop);

    const { result } = renderHook(() => useStop('s1'));
    expect(result.current.loading).toBe(true);

    await flush();

    expect(result.current.stop).toEqual(stop);
    expect(result.current.error).toBeNull();
    expect(fetchStop).toHaveBeenCalledWith(
      expect.objectContaining({ id: 's1', after: '14:05:00' }),
    );
  });

  // `stop(id:)` est nullable : un arrêt inconnu n'est pas une panne, la page
  // doit pouvoir distinguer les deux.
  it('should report an unknown stop as absent rather than as an error', async () => {
    fetchStop.mockResolvedValue(null);

    const { result } = renderHook(() => useStop('inconnu'));
    await flush();

    expect(result.current.stop).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should expose an error message when the request fails', async () => {
    fetchStop.mockRejectedValue(new Error('Réseau indisponible'));

    const { result } = renderHook(() => useStop('s1'));
    await flush();

    expect(result.current.error).toBe('Réseau indisponible');
    expect(result.current.stop).toBeNull();
  });

  it('should refetch on demand', async () => {
    const { result } = renderHook(() => useStop('s1'));
    await flush();
    expect(fetchStop).toHaveBeenCalledTimes(1);

    act(() => result.current.refetch());
    await flush();

    expect(fetchStop).toHaveBeenCalledTimes(2);
  });

  it('should abort the in-flight request when the stop changes', async () => {
    const { rerender } = renderHook(({ id }) => useStop(id), {
      initialProps: { id: 's1' },
    });
    await flush();

    const { signal } = fetchStop.mock.calls[0][0];
    expect(signal.aborted).toBe(false);

    rerender({ id: 's2' });
    await flush();

    expect(signal.aborted).toBe(true);
  });
});
