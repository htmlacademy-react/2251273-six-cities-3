import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OfferPrice } from './offer-price';
import type { OfferType } from '../../types/offer';

describe('OfferPrice', () => {
  const createMockOffer = (price: number): OfferType => ({
    id: 'offer-1',
    title: 'Test Offer',
    type: 'apartment',
    price,
    city: { name: 'Paris', location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 } },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    isFavorite: false,
    isPremium: false,
    rating: 4,
    description: 'Test description',
    bedrooms: 2,
    goods: ['Wi-Fi'],
    host: { name: 'John', avatarUrl: 'avatar.jpg', isPro: false },
    images: ['image1.jpg'],
    maxAdults: 4,
  });

  it('должен корректно отображать цену', () => {
    const offer = createMockOffer(120);
    render(<OfferPrice offer={offer} />);

    const priceValue = screen.getByText('€120');
    expect(priceValue).toBeInTheDocument();
    expect(priceValue).toHaveClass('offer__price-value');
  });

  it('должен отображать символ евро', () => {
    const offer = createMockOffer(100);
    render(<OfferPrice offer={offer} />);

    const priceValue = screen.getByText('€100');
    expect(priceValue.textContent).toContain('€');
  });

  it('должен отображать текст "night"', () => {
    const offer = createMockOffer(100);
    render(<OfferPrice offer={offer} />);

    const nightText = screen.getByText(/night/i);
    expect(nightText).toBeInTheDocument();
    expect(nightText).toHaveClass('offer__price-text');
  });

  it('должен иметь правильные CSS классы', () => {
    const offer = createMockOffer(100);
    const { container } = render(<OfferPrice offer={offer} />);

    const priceContainer = container.querySelector('.offer__price');
    expect(priceContainer).toBeInTheDocument();

    const priceValue = container.querySelector('.offer__price-value');
    expect(priceValue).toBeInTheDocument();

    const priceText = container.querySelector('.offer__price-text');
    expect(priceText).toBeInTheDocument();
  });

  it('должен корректно отображать цену 0', () => {
    const offer = createMockOffer(0);
    render(<OfferPrice offer={offer} />);

    expect(screen.getByText('€0')).toBeInTheDocument();
  });

  it('должен корректно отображать большую цену', () => {
    const offer = createMockOffer(9999);
    render(<OfferPrice offer={offer} />);

    expect(screen.getByText('€9999')).toBeInTheDocument();
  });

  it('должен корректно отображать дробную цену', () => {
    const offer = createMockOffer(120.5);
    render(<OfferPrice offer={offer} />);

    expect(screen.getByText('€120.5')).toBeInTheDocument();
  });
});
