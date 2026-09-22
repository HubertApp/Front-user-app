import { describe, it, expect } from 'vitest';
import { formatGtfsTime, nowAsGtfsTime } from '../../src/utils/gtfsTime';

describe('formatGtfsTime', () => {
  it('should render a same-day departure as HH:MM', () => {
    expect(formatGtfsTime('14:05:00')).toEqual({ label: '14:05', nextDay: false });
  });

  // GTFS encode les courses d'après minuit en prolongeant l'heure au-delà de
  // 24 : affiché tel quel, « 25:30 » n'a aucun sens pour un voyageur.
  it('should wrap an after-midnight departure past 24h and flag it', () => {
    expect(formatGtfsTime('25:30:00')).toEqual({ label: '01:30', nextDay: true });
  });

  it('should treat midnight itself as the next day', () => {
    expect(formatGtfsTime('24:00:00')).toEqual({ label: '00:00', nextDay: true });
  });

  it('should pad a single-digit hour', () => {
    expect(formatGtfsTime('8:05:00')).toEqual({ label: '08:05', nextDay: false });
  });

  it('should return null when the time is missing or malformed', () => {
    expect(formatGtfsTime(null)).toBeNull();
    expect(formatGtfsTime('pas une heure')).toBeNull();
  });
});

describe('nowAsGtfsTime', () => {
  it('should render a local time as the HH:MM:SS the API expects', () => {
    expect(nowAsGtfsTime(new Date(2026, 0, 15, 9, 7, 3))).toBe('09:07:03');
  });
});
