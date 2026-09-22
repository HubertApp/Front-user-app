import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StopCard from '../../src/components/traffic/StopCard';

describe('StopCard', () => {
  it('should show the distance when the stop comes from a nearby search', () => {
    render(<StopCard name="Gare Routière" distanceMeters={120} />);

    expect(screen.getByText(/120 m/)).toBeInTheDocument();
  });

  it('should show kilometres beyond a thousand metres', () => {
    render(<StopCard name="Gare Routière" distanceMeters={1500} />);

    expect(screen.getByText(/1,5 km/)).toBeInTheDocument();
  });

  // searchStops est volontairement global et ne renvoie pas de distance : sans
  // la ville, deux « Gare » de réseaux différents seraient indiscernables.
  it('should show the network city when there is no distance', () => {
    render(
      <StopCard
        name="Gare"
        network={{ name: 'Le Met', cityOrRegion: 'Metz' }}
      />,
    );

    expect(screen.getByText(/Metz/)).toBeInTheDocument();
  });

  it('should list the lines serving the stop', () => {
    render(
      <StopCard
        name="République"
        routes={[{ id: 'r1', shortName: 'A' }, { id: 'r2', shortName: 'B' }]}
      />,
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('should call onClick when the card is activated', async () => {
    const onClick = vi.fn();
    render(<StopCard name="République" onClick={onClick} />);

    await userEvent.click(screen.getByRole('button', { name: /République/ }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
