import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CitiesPlaces } from './cities-places';
import { OffersElementType } from '../../types/offers';
import { getCounterOffers } from '../../utils';
import { OFFERS } from '../../mocks/mock-offers';

vi.mock('../sorting/sorting', () => ({
  Sorting: () => <div data-testid="sorting">Sorting component</div>,
}));

vi.mock('../card/card', () => ({
  Card: ({ offer, onOfferHover }: { offer: OffersElementType; onOfferHover: (id: string) => void }) => (
    <div data-testid={`card-${offer.id}`} onClick={() => onOfferHover(offer.id)}>
      {offer.title}
    </div>
  ),
}));

vi.mock('../../utils', () => ({
  getCounterOffers: vi.fn(),
}));

describe('CitiesPlaces', () => {
  const mockOffers: OffersElementType[] = OFFERS.slice(0, 2);
  const city = 'Paris';
  const mockOnOfferHover = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with offers', () => {
    vi.mocked(getCounterOffers).mockReturnValue(2);

    render(
      <CitiesPlaces
        offers={mockOffers}
        city={city}
        onOfferHover={mockOnOfferHover}
      />
    );

    expect(screen.getByText('2 places to stay in Paris')).toBeInTheDocument();
    expect(screen.getByTestId('sorting')).toBeInTheDocument();
    expect(screen.getByText('The Joshua Tree House')).toBeInTheDocument();
    expect(screen.getByText('Canal View Prinsengracht')).toBeInTheDocument();
  });

  it('should display "No places" message when offers list is empty', () => {
    vi.mocked(getCounterOffers).mockReturnValue(0);

    render(
      <CitiesPlaces
        offers={[]}
        city={city}
        onOfferHover={mockOnOfferHover}
      />
    );

    expect(screen.queryByTestId(/card-/)).not.toBeInTheDocument();
  });

  it('should render correct count using getCounterOffers', () => {
    vi.mocked(getCounterOffers).mockReturnValue(5);

    render(
      <CitiesPlaces
        offers={mockOffers}
        city={city}
        onOfferHover={mockOnOfferHover}
      />
    );

    expect(screen.getByText('5 places to stay in Paris')).toBeInTheDocument();
  });
});
