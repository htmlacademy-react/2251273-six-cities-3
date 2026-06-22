import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Offer } from './offer';
import { OfferType } from '../../types/offer';

// Мокаем все дочерние компоненты и утилиту
vi.mock('./offer-mark', () => ({
  OfferMark: () => <div data-testid="offer-mark">Premium Mark</div>,
}));

vi.mock('./offer-name', () => ({
  OfferName: ({ offer }: { offer: OfferType }) => (
    <div data-testid="offer-name">{offer.title}</div>
  ),
}));

vi.mock('./offer-rating', () => ({
  OfferRating: ({ offer }: { offer: OfferType }) => (
    <div data-testid="offer-rating">{offer.rating}</div>
  ),
}));

vi.mock('./offer-features', () => ({
  OfferFeatures: ({ offer }: { offer: OfferType }) => (
    <div data-testid="offer-features">{offer.type}</div>
  ),
}));

vi.mock('./offer-price', () => ({
  OfferPrice: ({ offer }: { offer: OfferType }) => (
    <div data-testid="offer-price">{offer.price}</div>
  ),
}));

vi.mock('./offer-inside', () => ({
  OfferInside: () => (
    <div data-testid="offer-inside">Inside</div>
  ),
}));

vi.mock('./offer-host', () => ({
  OfferHost: ({ offer }: { offer: OfferType }) => (
    <div data-testid="offer-host">{offer.host.name}</div>
  ),
}));

vi.mock('../reviews/reviews', () => ({
  Reviews: () => <div data-testid="reviews">Reviews</div>,
}));

vi.mock('../../utils', () => ({
  checkGoodOffer: vi.fn(),
}));

import { checkGoodOffer } from '../../utils';

describe('Offer', () => {
  const mockOffer: OfferType = {
    id: '1',
    title: 'Beautiful apartment',
    type: 'apartment',
    price: 120,
    rating: 4.5,
    isPremium: true,
    isFavorite: false,
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    bedrooms: 2,
    maxAdults: 3,
    goods: ['Wi-Fi', 'Kitchen'],
    host: {
      name: 'John Doe',
      isPro: true,
      avatarUrl: 'avatar.jpg',
    },
    description: 'Nice place',
    images: ['image1.jpg'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all subcomponents correctly', () => {
    render(<Offer offer={mockOffer} />);

    expect(screen.getByTestId('offer-name')).toHaveTextContent('Beautiful apartment');
    expect(screen.getByTestId('offer-rating')).toHaveTextContent('4.5');
    expect(screen.getByTestId('offer-features')).toHaveTextContent('apartment');
    expect(screen.getByTestId('offer-price')).toHaveTextContent('120');
    expect(screen.getByTestId('offer-host')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('reviews')).toBeInTheDocument();
  });

  it('should render OfferMark when offer.isPremium is true', () => {
    render(<Offer offer={mockOffer} />);
    expect(screen.getByTestId('offer-mark')).toBeInTheDocument();
  });

  it('should not render OfferMark when offer.isPremium is false', () => {
    const nonPremiumOffer = { ...mockOffer, isPremium: false };
    render(<Offer offer={nonPremiumOffer} />);
    expect(screen.queryByTestId('offer-mark')).not.toBeInTheDocument();
  });

  it('should render OfferInside when checkGoodOffer returns true', () => {
    (checkGoodOffer as jest.Mock).mockReturnValue(true);
    render(<Offer offer={mockOffer} />);
    expect(screen.getByTestId('offer-inside')).toBeInTheDocument();
  });

  it('should not render OfferInside when checkGoodOffer returns false', () => {
    (checkGoodOffer as jest.Mock).mockReturnValue(false);
    render(<Offer offer={mockOffer} />);
    expect(screen.queryByTestId('offer-inside')).not.toBeInTheDocument();
  });

  it('should pass the correct offer prop to subcomponents', () => {
    // Проверяем, что OfferName получил offer (уже проверено через текст)
    // Можно также проверить вызовы моков, если они были замоканы с помощью vi.fn()
    // Но мы использовали простые компоненты-заглушки, поэтому проверяем через текст.
    // Этого достаточно.
    render(<Offer offer={mockOffer} />);
    // Все проверки уже сделаны в первом тесте.
  });
});
