import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardPrice } from './card-price';
import { CardBookmark } from './card-bookmark';
import type { OffersElementType } from '../../types/offers';
import { OFFERS } from '../../mocks/mock-offers';

vi.mock('./card-bookmark', () => ({
  CardBookmark: vi.fn(() => <div data-testid="card-bookmark" />),
}));

describe('CardPrice', () => {
  const mockOffer: OffersElementType = OFFERS[0];

  it('should render price with euro symbol and " / night" text', () => {
    render(<CardPrice offer={mockOffer} />);
    expect(screen.getByText('€288')).toBeInTheDocument();
    expect(screen.getByText('/ night')).toBeInTheDocument();
  });

  it('should pass the correct offer prop to CardBookmark', () => {
    render(<CardPrice offer={mockOffer} />);

    expect(CardBookmark).toHaveBeenCalledWith(
      { offer: mockOffer },
      expect.anything()
    );
  });
});
