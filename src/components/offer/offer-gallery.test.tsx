import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OfferGallery } from './offer-gallery';
import type { OfferType } from '../../types/offer';

// Мокаем OfferImage
vi.mock('./offer-image', () => ({
  OfferImage: vi.fn(({ imgSrc, imgAlt }: { imgSrc: string; imgAlt: string }) => (
    <div data-testid="offer-image" data-src={imgSrc} data-alt={imgAlt}>
      Mocked OfferImage
    </div>
  )),
}));

describe('OfferGallery', () => {
  const createMockOffer = (images: string[], title: string = 'Test Offer'): OfferType => ({
    id: 'offer-1',
    title,
    type: 'apartment',
    price: 100,
    city: { name: 'Paris', location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 } },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    isFavorite: false,
    isPremium: false,
    rating: 4,
    description: 'Test description',
    bedrooms: 2,
    goods: ['Wi-Fi'],
    host: { name: 'John', avatarUrl: 'avatar.jpg', isPro: false },
    images,
    maxAdults: 4,
  });

  it('должен корректно рендериться', () => {
    const offer = createMockOffer(['image1.jpg']);
    const { container } = render(<OfferGallery offer={offer} />);

    expect(container).toBeInTheDocument();
  });

  it('должен иметь правильные CSS классы для контейнера', () => {
    const offer = createMockOffer(['image1.jpg']);
    const { container } = render(<OfferGallery offer={offer} />);

    const galleryContainer = container.querySelector('.offer__gallery-container');
    expect(galleryContainer).toBeInTheDocument();
    expect(galleryContainer).toHaveClass('container');
  });

  it('должен иметь правильный CSS класс для галереи', () => {
    const offer = createMockOffer(['image1.jpg']);
    const { container } = render(<OfferGallery offer={offer} />);

    const gallery = container.querySelector('.offer__gallery');
    expect(gallery).toBeInTheDocument();
  });

  it('должен рендерить OfferImage для каждого изображения', () => {
    const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
    const offer = createMockOffer(images);
    render(<OfferGallery offer={offer} />);

    const offerImages = screen.getAllByTestId('offer-image');
    expect(offerImages).toHaveLength(3);
  });

  it('должен передавать правильные пропсы в OfferImage', () => {
    const images = ['image1.jpg', 'image2.jpg'];
    const title = 'Beautiful Apartment';
    const offer = createMockOffer(images, title);
    render(<OfferGallery offer={offer} />);

    const offerImages = screen.getAllByTestId('offer-image');

    expect(offerImages[0]).toHaveAttribute('data-src', 'image1.jpg');
    expect(offerImages[0]).toHaveAttribute('data-alt', title);

    expect(offerImages[1]).toHaveAttribute('data-src', 'image2.jpg');
    expect(offerImages[1]).toHaveAttribute('data-alt', title);
  });

  it('должен корректно обрабатывать пустой массив images', () => {
    const offer = createMockOffer([]);
    const { container } = render(<OfferGallery offer={offer} />);

    const gallery = container.querySelector('.offer__gallery');
    expect(gallery).toBeInTheDocument();
    expect(gallery?.children.length).toBe(0);
  });

  it('должен корректно обрабатывать одно изображение', () => {
    const offer = createMockOffer(['image1.jpg']);
    render(<OfferGallery offer={offer} />);

    const offerImages = screen.getAllByTestId('offer-image');
    expect(offerImages).toHaveLength(1);
  });

  it('должен корректно обрабатывать много изображений', () => {
    const images = Array.from({ length: 10 }, (_, i) => `image${i + 1}.jpg`);
    const offer = createMockOffer(images);
    render(<OfferGallery offer={offer} />);

    const offerImages = screen.getAllByTestId('offer-image');
    expect(offerImages).toHaveLength(10);
  });

  it('должен иметь правильную структуру DOM', () => {
    const offer = createMockOffer(['image1.jpg', 'image2.jpg']);
    const { container } = render(<OfferGallery offer={offer} />);

    const galleryContainer = container.querySelector('.offer__gallery-container');
    expect(galleryContainer?.tagName).toBe('DIV');

    const gallery = galleryContainer?.querySelector('.offer__gallery');
    expect(gallery).toBeInTheDocument();
    expect(gallery?.tagName).toBe('DIV');

    const images = gallery?.querySelectorAll('[data-testid="offer-image"]');
    expect(images?.length).toBe(2);
  });

  it('должен использовать title оффера как alt для всех изображений', () => {
    const title = 'Luxury Villa';
    const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
    const offer = createMockOffer(images, title);
    render(<OfferGallery offer={offer} />);

    const offerImages = screen.getAllByTestId('offer-image');
    offerImages.forEach((image) => {
      expect(image).toHaveAttribute('data-alt', title);
    });
  });

  it('должен сохранять порядок изображений', () => {
    const images = ['first.jpg', 'second.jpg', 'third.jpg'];
    const offer = createMockOffer(images);
    render(<OfferGallery offer={offer} />);

    const offerImages = screen.getAllByTestId('offer-image');
    expect(offerImages[0]).toHaveAttribute('data-src', 'first.jpg');
    expect(offerImages[1]).toHaveAttribute('data-src', 'second.jpg');
    expect(offerImages[2]).toHaveAttribute('data-src', 'third.jpg');
  });
});
