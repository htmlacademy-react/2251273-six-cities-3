import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Offer } from './offer';
import { OfferType } from '../../types/offer';
import { OFFER } from '../../mocks/mock-offer';

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
  const mockOffer: OfferType = OFFER;

  it('should render all subcomponents correctly', () => {
    render(<Offer offer={mockOffer} />);

    expect(screen.getByTestId('offer-name')).toHaveTextContent('Beautiful & luxurious studio at great location');
    expect(screen.getByTestId('offer-rating')).toHaveTextContent('4');
    expect(screen.getByTestId('offer-features')).toHaveTextContent('apartment');
    expect(screen.getByTestId('offer-price')).toHaveTextContent('777');
    expect(screen.getByTestId('offer-host')).toHaveTextContent('Oliver Conner');
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
});
