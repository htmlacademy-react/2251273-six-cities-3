// OfferGallery.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfferGallery } from './offer-gallery';
import { OfferImage } from './offer-image';
import type { OfferType } from '../../types/offer';
import '@testing-library/jest-dom/vitest';

// Мокаем дочерний компонент OfferImage
vi.mock('./offer-image', () => ({
  OfferImage: vi.fn(({ imgSrc, imgAlt }: { imgSrc: string; imgAlt: string }) => (
    <div data-testid="mock-offer-image" data-src={imgSrc} data-alt={imgAlt}>
      Mock Image: {imgAlt}
    </div>
  )),
}));

describe('OfferGallery', () => {
  const mockOffer: OfferType = {
    id: '1',
    title: 'Cozy Apartment',
    images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
    // Добавьте другие необходимые поля, если тип требует (можно as any)
  } as OfferType;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the container with correct classes', () => {
    render(<OfferGallery offer={mockOffer} />);
    const container = document.querySelector('.offer__gallery-container.container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('offer__gallery-container');
    expect(container).toHaveClass('container');

    const gallery = document.querySelector('.offer__gallery');
    expect(gallery).toBeInTheDocument();
    expect(gallery).toHaveClass('offer__gallery');
  });

  it('renders the correct number of OfferImage components', () => {
    render(<OfferGallery offer={mockOffer} />);
    const images = screen.getAllByTestId('mock-offer-image');
    expect(images).toHaveLength(mockOffer.images.length);
  });

  it('passes correct imgSrc and imgAlt props to each OfferImage', () => {
    render(<OfferGallery offer={mockOffer} />);
    const images = screen.getAllByTestId('mock-offer-image');

    images.forEach((img, index) => {
      expect(img).toHaveAttribute('data-src', mockOffer.images[index]);
      expect(img).toHaveAttribute('data-alt', mockOffer.title);
    });
  });

  it('calls OfferImage with correct props (including key)', () => {
    render(<OfferGallery offer={mockOffer} />);
    expect(OfferImage).toHaveBeenCalledTimes(mockOffer.images.length);

    mockOffer.images.forEach((src) => {
      expect(OfferImage).toHaveBeenCalledWith(
        expect.objectContaining({
          imgSrc: src,
          imgAlt: mockOffer.title,
        }),
        expect.anything() // для контекста или второго аргумента (обычно undefined)
      );
    });
  });

  it('renders nothing when images array is empty', () => {
    const emptyOffer = { ...mockOffer, images: [] };
    render(<OfferGallery offer={emptyOffer} />);
    const gallery = document.querySelector('.offer__gallery');
    expect(gallery).toBeInTheDocument(); // Контейнер всё равно есть
    expect(gallery?.children).toHaveLength(0); // Внутри нет дочерних элементов

    // OfferImage не вызывается
    expect(OfferImage).not.toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { container } = render(<OfferGallery offer={mockOffer} />);
    expect(container).toMatchSnapshot();
  });
});
