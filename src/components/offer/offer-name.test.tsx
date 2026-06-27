import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { OfferName } from './offer-name';
import { OfferBookmark } from './offer-bookmark';
import { OfferType } from '../../types/offer';
import { OFFER } from '../../mocks/mock-offer';

vi.mock('./offer-bookmark', () => ({
  OfferBookmark: vi.fn(() => <div data-testid="mock-bookmark" />),
}));

describe('OfferName', () => {
  const mockOffer: OfferType = OFFER;

  it('renders the offer title in an h1', () => {
    render(<OfferName offer={mockOffer} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Beautiful & luxurious studio at great location');
  });

  it('passes the entire offer object to OfferBookmark', () => {
    render(<OfferName offer={mockOffer} />);

    expect(OfferBookmark).toHaveBeenCalledWith(
      expect.objectContaining({ offer: mockOffer }),
      expect.anything()
    );
  });

  it('renders the bookmark component', () => {
    render(<OfferName offer={mockOffer} />);
    expect(screen.getByTestId('mock-bookmark')).toBeInTheDocument();
  });
});
