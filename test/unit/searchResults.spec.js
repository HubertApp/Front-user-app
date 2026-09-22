import { describe, it, expect } from 'vitest';
import { toStopResult, resolveResultTarget } from '../../src/utils/searchResults';

describe('toStopResult', () => {
  it('should turn a stop into a typed result carrying its coordinates', () => {
    const stop = {
      id: 's1',
      name: 'Gare Routière',
      network: { name: 'Le Met', cityOrRegion: 'Metz' },
      location: { latitude: 49.1097, longitude: 6.1778 },
    };

    expect(toStopResult(stop)).toEqual({
      type: 'stop',
      id: 's1',
      label: 'Gare Routière',
      sublabel: 'Metz',
      coordinates: { latitude: 49.1097, longitude: 6.1778 },
      raw: stop,
    });
  });

  // searchStops est global : sans ville, deux homonymes seraient identiques à
  // l'écran. On retombe alors sur le nom du réseau.
  it('should fall back to the network name when there is no city', () => {
    const result = toStopResult({ id: 's1', name: 'Gare', network: { name: 'Le Met' } });

    expect(result.sublabel).toBe('Le Met');
  });

  it('should tolerate a stop without network or location', () => {
    const result = toStopResult({ id: 's1', name: 'Gare' });

    expect(result.sublabel).toBe('Arrêt');
    expect(result.coordinates).toBeNull();
  });
});

describe('resolveResultTarget', () => {
  it('should send a stop to its detail page', () => {
    expect(resolveResultTarget({ type: 'stop', id: 's1' }))
      .toEqual({ kind: 'navigate', to: '/arret/s1' });
  });

  it('should send a line to its detail page', () => {
    expect(resolveResultTarget({ type: 'route', id: 'r1' }))
      .toEqual({ kind: 'navigate', to: '/ligne/r1' });
  });

  // Un lieu n'a pas de fiche : il ne vaut que comme extrémité d'un trajet.
  it('should turn a place into an itinerary destination', () => {
    const coordinates = { latitude: 49.1, longitude: 6.1 };
    const place = { type: 'place', id: 'p1', label: 'Metz', coordinates };

    expect(resolveResultTarget(place))
      .toEqual({ kind: 'itinerary', destination: { label: 'Metz', coordinates } });
  });

  it('should return null for a type it does not know how to open', () => {
    expect(resolveResultTarget({ type: 'inconnu', id: 'x' })).toBeNull();
  });
});
