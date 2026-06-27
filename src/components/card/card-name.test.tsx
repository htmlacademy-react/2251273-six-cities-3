import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CardName } from './card-name';
import { AppRoute } from '../../const';

describe('CardName', () => {
  it('renders a link with the correct title and href', () => {
    const title = 'Cozy Cottage';
    const offerId = 'abc-123';

    render(
      <MemoryRouter>
        <CardName cardName={title} offerId={offerId} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: title });
    expect(link).toBeInTheDocument();

    const expectedHref = `${AppRoute.Offer}/${offerId}`;
    expect(link).toHaveAttribute('href', expectedHref);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('place-card__name');
    expect(heading).toContainElement(link);
  });

  it('renders with different title and id', () => {
    const title = 'Modern Loft';
    const offerId = 'xyz-789';

    render(
      <MemoryRouter>
        <CardName cardName={title} offerId={offerId} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: title });
    expect(link).toHaveAttribute('href', `${AppRoute.Offer}/${offerId}`);
  });
});
