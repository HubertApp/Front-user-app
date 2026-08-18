import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserAvatar from '../../src/components/user/UserAvatar';

describe('UserAvatar', () => {
  it('should render the first letter of the pseudo, uppercased, when there is no photo', () => {
    render(<UserAvatar user={{ pseudo: 'noe' }} />);

    expect(screen.getByText('N')).toBeInTheDocument();
  });

  it('should render "?" when there is no user at all', () => {
    render(<UserAvatar user={null} />);

    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('should render an <img> when a photo URL is provided', () => {
    render(<UserAvatar user={{ pseudo: 'noe', photo: 'https://example.com/avatar.jpg' }} />);

    const img = screen.getByRole('img', { name: 'noe' });
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should fall back to the initial when the photo fails to load', () => {
    render(<UserAvatar user={{ pseudo: 'noe', photo: 'https://example.com/broken.jpg' }} />);

    const img = screen.getByRole('img', { name: 'noe' });
    fireEvent.error(img);

    expect(screen.getByText('N')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should reset the broken-photo state when the photo URL changes', () => {
    const { rerender } = render(
      <UserAvatar user={{ pseudo: 'noe', photo: 'https://example.com/broken.jpg' }} />,
    );
    fireEvent.error(screen.getByRole('img', { name: 'noe' }));
    expect(screen.getByText('N')).toBeInTheDocument();

    rerender(<UserAvatar user={{ pseudo: 'noe', photo: 'https://example.com/new.jpg' }} />);

    expect(screen.getByRole('img', { name: 'noe' })).toHaveAttribute(
      'src',
      'https://example.com/new.jpg',
    );
  });
});
