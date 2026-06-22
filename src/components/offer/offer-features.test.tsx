// OfferFeatures.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfferFeatures } from './offer-features';
import type { OfferType } from '../../types/offer';
import '@testing-library/jest-dom/vitest';

describe('OfferFeatures', () => {
  // Создаём базовый мок-объект offer
  const mockOffer: OfferType = {
    id: '1',
    title: 'Test offer',
    type: 'Apartment',
    bedrooms: 2,
    maxAdults: 3,
    // Добавьте другие поля, если они обязательны (заглушки)
  } as OfferType;

  it('renders the list with correct class', () => {
    render(<OfferFeatures offer={mockOffer} />);
    const list = document.querySelector('.offer__features');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass('offer__features');
  });

  it('renders three feature items', () => {
    render(<OfferFeatures offer={mockOffer} />);
    const items = document.querySelectorAll('.offer__feature');
    expect(items).toHaveLength(3);
  });

  it('displays the correct offer type', () => {
    render(<OfferFeatures offer={mockOffer} />);
    const typeItem = screen.getByText('Apartment');
    expect(typeItem).toBeInTheDocument();
    expect(typeItem).toHaveClass('offer__feature', 'offer__feature--entire');
  });

  it('displays the correct bedrooms count', () => {
    render(<OfferFeatures offer={mockOffer} />);
    const bedroomsText = '2 Bedrooms';
    expect(screen.getByText(bedroomsText)).toBeInTheDocument();
    const bedroomsItem = screen.getByText(bedroomsText);
    expect(bedroomsItem).toHaveClass('offer__feature', 'offer__feature--bedrooms');
  });

  it('displays the correct max adults with pluralization (adults)', () => {
    render(<OfferFeatures offer={mockOffer} />);
    const adultsText = 'Max 3 adults';
    expect(screen.getByText(adultsText)).toBeInTheDocument();
    const adultsItem = screen.getByText(adultsText);
    expect(adultsItem).toHaveClass('offer__feature', 'offer__feature--adults');
  });

  it('uses singular "adult" when maxAdults is 1', () => {
    const offerWithOneAdult = { ...mockOffer, maxAdults: 1 };
    render(<OfferFeatures offer={offerWithOneAdult} />);
    expect(screen.getByText('Max 1 adult')).toBeInTheDocument();
    expect(screen.queryByText('Max 1 adults')).not.toBeInTheDocument();
  });

  it('uses plural "adults" when maxAdults is 0', () => {
    const offerWithZeroAdults = { ...mockOffer, maxAdults: 0 };
    render(<OfferFeatures offer={offerWithZeroAdults} />);
    expect(screen.getByText('Max 0 adults')).toBeInTheDocument();
  });

  it('uses plural "adults" when maxAdults is greater than 1', () => {
    const offerWithManyAdults = { ...mockOffer, maxAdults: 5 };
    render(<OfferFeatures offer={offerWithManyAdults} />);
    expect(screen.getByText('Max 5 adults')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<OfferFeatures offer={mockOffer} />);
    expect(container).toMatchSnapshot();
  });
});
