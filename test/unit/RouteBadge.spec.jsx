import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RouteBadge, { modeForRouteType } from '../../src/components/traffic/RouteBadge';

describe('RouteBadge', () => {
  it('should show the short name of the line', () => {
    render(<RouteBadge route={{ id: 'r1', shortName: 'A', longName: 'Ligne A' }} />);

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  // Tous les GTFS ne renseignent pas route_short_name : sans repli, le badge
  // serait vide.
  it('should fall back to the long name, then to the id', () => {
    const { rerender } = render(<RouteBadge route={{ id: 'r1', longName: 'Ligne A' }} />);
    expect(screen.getByText('Ligne A')).toBeInTheDocument();

    rerender(<RouteBadge route={{ id: 'r1' }} />);
    expect(screen.getByText('r1')).toBeInTheDocument();
  });

  it('should apply the colours carried by the GTFS feed', () => {
    render(<RouteBadge route={{ id: 'r1', shortName: 'A', color: 'D4145A', textColor: 'FFFFFF' }} />);

    expect(screen.getByText('A')).toHaveStyle({
      backgroundColor: '#D4145A',
      color: '#FFFFFF',
    });
  });
});

describe('modeForRouteType', () => {
  it('should map the GTFS route types that have a dedicated icon', () => {
    expect(modeForRouteType(0)).toBe('tram');
    expect(modeForRouteType(2)).toBe('train');
    expect(modeForRouteType(3)).toBe('bus');
  });

  // Au-delà de 3 (ferry, funiculaire, téléphérique...) aucun pictogramme
  // dédié n'existe dans MODE_META.
  it('should fall back to bus for an unknown or missing type', () => {
    expect(modeForRouteType(4)).toBe('bus');
    expect(modeForRouteType(null)).toBe('bus');
  });
});
