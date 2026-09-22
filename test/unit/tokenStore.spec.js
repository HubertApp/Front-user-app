import { describe, it, expect, vi, beforeEach } from 'vitest';

const store = new Map();

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    set: vi.fn(async ({ key, value }) => {
      store.set(key, value);
    }),
    get: vi.fn(async ({ key }) => ({ value: store.has(key) ? store.get(key) : null })),
    remove: vi.fn(async ({ key }) => {
      store.delete(key);
    }),
  },
}));

import { setToken, getToken, clearToken } from '../../src/pages/tokenStore';
import { Preferences } from '@capacitor/preferences';

describe('tokenStore', () => {
  beforeEach(() => {
    store.clear();
    vi.clearAllMocks();
  });

  it('should return null when no token has ever been set', async () => {
    const token = await getToken();
    expect(token).toBeNull();
  });

  it('should persist and retrieve a token via Preferences', async () => {
    await setToken('jwt-abc');

    expect(Preferences.set).toHaveBeenCalledWith({ key: 'jwt', value: 'jwt-abc' });
    expect(await getToken()).toBe('jwt-abc');
  });

  it('should return null after clearToken', async () => {
    await setToken('jwt-abc');
    await clearToken();

    expect(Preferences.remove).toHaveBeenCalledWith({ key: 'jwt' });
    expect(await getToken()).toBeNull();
  });

  it('should not throw and should return null if Preferences.get fails (native plugin unavailable)', async () => {
    Preferences.get.mockRejectedValueOnce(new Error('plugin not implemented on web'));

    const token = await getToken();

    expect(token).toBeNull();
  });
});
