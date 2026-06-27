import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FavoriteCard } from './favorites-card';
import { AppRoute } from '../../const';
import { OFFERS } from '../../mocks/mock-offers';
import { OffersElementType } from '../../types/offers';

vi.mock('../card/card-price', () => ({
  CardPrice: vi.fn(({ offer }: { offer: OffersElementType }) => (
    <div data-testid="card-price">{offer.price}</div>
  )),
}));

vi.mock('../card/card-mark', () => ({
  CardMark: vi.fn(() => <div data-testid="card-mark">Premium</div>),
}));

vi.mock('../card/card-rating', () => ({
  CardRating: vi.fn(({ cardRating }: { cardRating: number }) => (
    <div data-testid="card-rating">{cardRating}</div>
  )),
}));

vi.mock('../card/card-name', () => ({
  CardName: vi.fn(({ cardName }: { cardName: string }) => (
    <div data-testid="card-name">{cardName}</div>
  )),
}));

vi.mock('../card/card-type', () => ({
  CardType: vi.fn(({ cardType }: { cardType: string }) => (
    <div data-testid="card-type">{cardType}</div>
  )),
}));

describe('Component: FavoriteCard', () => {
  const baseOffer: OffersElementType = OFFERS.find((offer) => offer.isFavorite)!;

  it('should render correctly with all offer data and premium mark when isPremium is true', () => {
    render(
      <MemoryRouter>
        <FavoriteCard offer={baseOffer} />
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', baseOffer.previewImage);
    expect(img).toHaveAttribute('alt', 'Place image');

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `${AppRoute.Offer}/${baseOffer.id}`);

    expect(screen.getByTestId('card-price')).toHaveTextContent(String(baseOffer.price));
    expect(screen.getByTestId('card-rating')).toHaveTextContent(String(baseOffer.rating));
    expect(screen.getByTestId('card-name')).toHaveTextContent(baseOffer.title);
    expect(screen.getByTestId('card-type')).toHaveTextContent(baseOffer.type);
  });

  it('should not render CardMark when offer is not premium', () => {
    const nonPremiumOffer = { ...baseOffer, isPremium: false };

    render(
      <MemoryRouter>
        <FavoriteCard offer={nonPremiumOffer} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('card-mark')).not.toBeInTheDocument();
  });

  it('should have an image with alt attribute', () => {
    render(
      <MemoryRouter>
        <FavoriteCard offer={baseOffer} />
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt');
  });
});
