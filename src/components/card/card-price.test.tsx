import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardPrice } from './card-price';
import { CardBookmark } from './card-bookmark';
import type { OffersElementType } from '../../types/offers';

vi.mock('./card-bookmark', () => ({
  CardBookmark: vi.fn(() => <div data-testid="card-bookmark" />),
}));

describe('CardPrice', () => {
  const mockOffer: OffersElementType = {
    id: '1',
    title: 'Beautiful apartment',
    type: 'apartment',
    price: 120,
    previewImage: 'https://example.com/image.jpg',
    isFavorite: false,
    isPremium: false,
    rating: 4.5,
    city: {
      name: '',
      location: { latitude: 0, longitude: 0, zoom: 0 },
    },
    location: { latitude: 0, longitude: 0, zoom: 0 },
  };

  it('should render price with euro symbol and " / night" text', () => {
    render(<CardPrice offer={mockOffer} />);
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('/ night')).toBeInTheDocument();
  });

  it('should pass the correct offer prop to CardBookmark', () => {
    render(<CardPrice offer={mockOffer} />);

    // Проверяем, что компонент получил правильный offer (хотя бы в одном из вызовов)
    expect(CardBookmark).toHaveBeenCalledWith(
      { offer: mockOffer },
      expect.anything() // игнорируем второй аргумент (ref или внутренние параметры)
    );
  });
});
