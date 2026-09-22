import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchSearchStops, fetchStop } from '../../src/api/stops';

function mockGraphQL(data) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data }),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function variablesOf(fetchMock) {
  return JSON.parse(fetchMock.mock.calls[0][1].body).variables;
}

describe('fetchSearchStops', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('should pass the query and page size, and return the matching stops', async () => {
    const stops = [{ id: 's1', name: 'Gare' }];
    const fetchMock = mockGraphQL({ searchStops: stops });

    await expect(fetchSearchStops({ query: 'gare', first: 15 })).resolves.toEqual(stops);
    expect(variablesOf(fetchMock)).toEqual({ query: 'gare', first: 15 });
  });

  it('should return an empty list when the field comes back null', async () => {
    mockGraphQL({ searchStops: null });

    await expect(fetchSearchStops({ query: 'gare' })).resolves.toEqual([]);
  });
});

describe('fetchStop', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('should pass the id and the departures window, and return the stop', async () => {
    const stop = { id: 's1', name: 'Gare', departures: [] };
    const fetchMock = mockGraphQL({ stop });

    await expect(
      fetchStop({ id: 's1', first: 8, after: '14:00:00' }),
    ).resolves.toEqual(stop);
    expect(variablesOf(fetchMock)).toEqual({ id: 's1', first: 8, after: '14:00:00' });
  });

  // `stop(id:)` est nullable côté schéma : un identifiant inconnu n'est pas
  // une erreur réseau, c'est une fiche introuvable.
  it('should return null for an unknown stop', async () => {
    mockGraphQL({ stop: null });

    await expect(fetchStop({ id: 'inconnu' })).resolves.toBeNull();
  });
});
