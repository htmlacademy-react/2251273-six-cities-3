// src/components/offer-price/offer-price.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfferPrice } from './offer-price';
import type { OfferType } from '../../types/offer';

describe('OfferPrice', () => {
  const mockOffer = {
    price: 120,
    // остальные поля OfferType не важны для этого компонента
  } as OfferType;

  it('should render price and "night" text', () => {
    render(<OfferPrice offer={mockOffer} />);

    // Проверяем наличие цены со знаком евро
    const priceElement = screen.getByText('€120');
    expect(priceElement).toBeInTheDocument();
    expect(priceElement).toHaveClass('offer__price-value');

    // Проверяем текст "night"
    const nightText = screen.getByText('night');
    expect(nightText).toBeInTheDocument();
    expect(nightText).toHaveClass('offer__price-text');
  });

  it('should render correct price for different values', () => {
    const offers = [{ price: 0 }, { price: 999 }, { price: 1234.5 }] as OfferType[];

    offers.forEach((offer) => {
      const { unmount } = render(<OfferPrice offer={offer} />);
      const priceRegex = new RegExp(`€${offer.price}`);
      expect(screen.getByText(priceRegex)).toBeInTheDocument();
      unmount();
    });
  });

  it('should contain the wrapping div with class "offer__price"', () => {
    const { container } = render(<OfferPrice offer={mockOffer} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('offer__price');
    expect(wrapper.tagName).toBe('DIV');
  });

  // Опционально: snapshot-тест (если требуется)
  it('should match snapshot', () => {
    const { container } = render(<OfferPrice offer={mockOffer} />);
    expect(container).toMatchSnapshot();
  });
});
