import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { OfferName } from './offer-name';
import { OfferBookmark } from './offer-bookmark';
import { OfferType } from '../../types/offer';

// Мокаем дочерний компонент, чтобы проверить, что он получает правильные пропсы
vi.mock('./offer-bookmark', () => ({
  OfferBookmark: vi.fn(() => <div data-testid="mock-bookmark" />),
}));

describe('OfferName', () => {
  const mockOffer: OfferType = {
    id: '1',
    title: 'Beautiful apartment in Paris',
    type: 'apartment',
    price: 120,
    city: {
      name: 'Paris',
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 10,
      },
    },
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 10,
    },
    isFavorite: false,
    isPremium: false,
    rating: 4.5,
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    bedrooms: 2,
    maxAdults: 4,
    goods: ['Wi-Fi', 'Kitchen'],
    host: {
      name: 'John Doe',
      isPro: true,
      avatarUrl: 'https://example.com/avatar.jpg',
    },
    description: 'A lovely apartment with a view of the Eiffel Tower.',
  };

  it('renders the offer title in an h1', () => {
    render(<OfferName offer={mockOffer} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Beautiful apartment in Paris');
  });

  it('passes the entire offer object to OfferBookmark', () => {
    render(<OfferName offer={mockOffer} />);

    // Проверяем, что OfferBookmark был вызван с правильным пропом
    expect(OfferBookmark).toHaveBeenCalledWith(
      expect.objectContaining({ offer: mockOffer }),
      expect.anything() // игнорируем контекст или ref
    );
  });

  it('renders the bookmark component', () => {
    render(<OfferName offer={mockOffer} />);
    expect(screen.getByTestId('mock-bookmark')).toBeInTheDocument();
  });
});
