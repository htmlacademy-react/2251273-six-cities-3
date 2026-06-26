import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OfferHost } from './offer-host';
import type { OfferType } from '../../types/offer';

// Мокаем utils
vi.mock('../../utils', () => ({
  getFirstName: vi.fn((name: string) => name.split(' ')[0]),
}));

describe('OfferHost', () => {
  const createMockOffer = (isPro: boolean = false, description: string = 'Test description'): OfferType => ({
    id: 'offer-1',
    title: 'Test Offer',
    type: 'apartment',
    price: 100,
    city: { name: 'Paris', location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 } },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    isFavorite: false,
    isPremium: false,
    rating: 4,
    description,
    bedrooms: 2,
    goods: ['Wi-Fi'],
    host: {
      name: 'John Doe',
      avatarUrl: 'https://example.com/avatar.jpg',
      isPro
    },
    images: ['image1.jpg'],
    maxAdults: 4,
  });

  it('должен корректно отображать заголовок', () => {
    const offer = createMockOffer();
    render(<OfferHost offer={offer} />);

    expect(screen.getByText('Meet the host')).toBeInTheDocument();
    expect(screen.getByText('Meet the host')).toHaveClass('offer__host-title');
  });

  it('должен отображать аватар хоста с правильными атрибутами', () => {
    const offer = createMockOffer();
    render(<OfferHost offer={offer} />);

    const avatar = screen.getByAltText('Host avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(avatar).toHaveAttribute('width', '74');
    expect(avatar).toHaveAttribute('height', '74');
    expect(avatar).toHaveClass('offer__avatar');
    expect(avatar).toHaveClass('user__avatar');
  });

  it('должен отображать описание оффера', () => {
    const description = 'This is a beautiful apartment in Paris';
    const offer = createMockOffer(false, description);
    render(<OfferHost offer={offer} />);

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('должен добавлять класс offer__avatar-wrapper--pro для pro хоста', () => {
    const offer = createMockOffer(true);
    const { container } = render(<OfferHost offer={offer} />);

    const avatarWrapper = container.querySelector('.offer__avatar-wrapper');
    expect(avatarWrapper).toHaveClass('offer__avatar-wrapper--pro');
    expect(avatarWrapper).toHaveClass('offer__avatar-wrapper');
    expect(avatarWrapper).toHaveClass('user__avatar-wrapper');
  });

  it('не должен добавлять класс offer__avatar-wrapper--pro для обычного хоста', () => {
    const offer = createMockOffer(false);
    const { container } = render(<OfferHost offer={offer} />);

    const avatarWrapper = container.querySelector('.offer__avatar-wrapper');
    expect(avatarWrapper).not.toHaveClass('offer__avatar-wrapper--pro');
    expect(avatarWrapper).toHaveClass('offer__avatar-wrapper');
    expect(avatarWrapper).toHaveClass('user__avatar-wrapper');
  });

  it('должен отображать статус "Pro" для pro хоста', () => {
    const offer = createMockOffer(true);
    render(<OfferHost offer={offer} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toHaveClass('offer__user-status');
  });

  it('не должен отображать статус "Pro" для обычного хоста', () => {
    const offer = createMockOffer(false);
    render(<OfferHost offer={offer} />);

    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });

  it('должен иметь правильные CSS классы', () => {
    const offer = createMockOffer();
    const { container } = render(<OfferHost offer={offer} />);

    expect(container.querySelector('.offer__host')).toBeInTheDocument();
    expect(container.querySelector('.offer__host-title')).toBeInTheDocument();
    expect(container.querySelector('.offer__host-user')).toBeInTheDocument();
    expect(container.querySelector('.user')).toBeInTheDocument();
    expect(container.querySelector('.offer__avatar-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.user__avatar-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.offer__avatar')).toBeInTheDocument();
    expect(container.querySelector('.user__avatar')).toBeInTheDocument();
    expect(container.querySelector('.offer__user-name')).toBeInTheDocument();
    expect(container.querySelector('.offer__description')).toBeInTheDocument();
  });

  it('должен иметь правильную структуру DOM', () => {
    const offer = createMockOffer();
    const { container } = render(<OfferHost offer={offer} />);

    const hostContainer = container.querySelector('.offer__host');
    expect(hostContainer?.tagName).toBe('DIV');

    const title = hostContainer?.querySelector('h2');
    expect(title).toBeInTheDocument();

    const hostUser = hostContainer?.querySelector('.offer__host-user');
    expect(hostUser).toBeInTheDocument();

    const avatarWrapper = hostUser?.querySelector('.offer__avatar-wrapper');
    expect(avatarWrapper).toBeInTheDocument();

    const avatar = avatarWrapper?.querySelector('img');
    expect(avatar).toBeInTheDocument();

    const userName = hostUser?.querySelector('.offer__user-name');
    expect(userName).toBeInTheDocument();

    const description = hostContainer?.querySelector('.offer__description');
    expect(description).toBeInTheDocument();
  });

  it('должен корректно обрабатывать про хоста', () => {
    const offer = createMockOffer(true);
    const { container } = render(<OfferHost offer={offer} />);

    const avatarWrapper = container.querySelector('.offer__avatar-wrapper');
    expect(avatarWrapper).toHaveClass('offer__avatar-wrapper--pro');

    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('должен корректно обрабатывать обычного хоста', () => {
    const offer = createMockOffer(false);
    const { container } = render(<OfferHost offer={offer} />);

    const avatarWrapper = container.querySelector('.offer__avatar-wrapper');
    expect(avatarWrapper).not.toHaveClass('offer__avatar-wrapper--pro');

    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });

  it('должен корректно обрабатывать длинное описание', () => {
    const longDescription = 'This is a very long description that contains multiple sentences and provides detailed information about the host and the property. It includes various details about the amenities, location, and other features.';
    const offer = createMockOffer(false, longDescription);
    render(<OfferHost offer={offer} />);

    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  it('должен корректно обрабатывать пустое описание', () => {
    const offer = createMockOffer(false, '');
    const { container } = render(<OfferHost offer={offer} />);

    const description = container.querySelector('.offer__description');
    expect(description).toBeInTheDocument();
    expect(description?.textContent).toBe('');
  });
});
