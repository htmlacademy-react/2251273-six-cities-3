import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CardImage } from './card-image';
import { AppRoute } from '../../const';

describe('CardImage', () => {
  const mockProps = {
    cardImgSrc: 'https://example.com/image.jpg',
    cardImgAlt: 'Beautiful apartment',
    offerId: '12345',
  };

  it('renders image with correct src and alt', () => {
    render(
      <MemoryRouter>
        <CardImage {...mockProps} />
      </MemoryRouter>
    );

    const img = screen.getByRole('img', { name: mockProps.cardImgAlt });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockProps.cardImgSrc);
    expect(img).toHaveAttribute('alt', mockProps.cardImgAlt);
  });

  it('wraps image in a link pointing to the correct offer page', () => {
    render(
      <MemoryRouter>
        <CardImage {...mockProps} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `${AppRoute.Offer}/${mockProps.offerId}`);
  });

  it('applies correct CSS classes', () => {
    render(
      <MemoryRouter>
        <CardImage {...mockProps} />
      </MemoryRouter>
    );

    const wrapper = screen.getByRole('link').parentElement; // .cities__image-wrapper
    expect(wrapper).toHaveClass('cities__image-wrapper', 'place-card__image-wrapper');

    const img = screen.getByRole('img');
    expect(img).toHaveClass('place-card__image');
  });
});
