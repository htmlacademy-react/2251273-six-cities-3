import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OfferImage } from './offer-image';

describe('OfferImage', () => {
  const mockImgSrc = 'https://example.com/image.jpg';
  const mockImgAlt = 'Beautiful apartment';

  it('должен корректно рендериться', () => {
    render(<OfferImage imgSrc={mockImgSrc} imgAlt={mockImgAlt} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
  });

  it('должен отображать изображение с правильным src', () => {
    render(<OfferImage imgSrc={mockImgSrc} imgAlt={mockImgAlt} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockImgSrc);
  });

  it('должен отображать изображение с правильным alt', () => {
    render(<OfferImage imgSrc={mockImgSrc} imgAlt={mockImgAlt} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', mockImgAlt);
  });

  it('должен иметь правильный CSS класс для контейнера', () => {
    const { container } = render(<OfferImage imgSrc={mockImgSrc} imgAlt={mockImgAlt} />);

    const wrapper = container.querySelector('.offer__image-wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  it('должен иметь правильный CSS класс для изображения', () => {
    const { container } = render(<OfferImage imgSrc={mockImgSrc} imgAlt={mockImgAlt} />);

    const image = container.querySelector('.offer__image');
    expect(image).toBeInTheDocument();
    expect(image?.tagName).toBe('IMG');
  });

  it('должен иметь правильную структуру DOM', () => {
    const { container } = render(<OfferImage imgSrc={mockImgSrc} imgAlt={mockImgAlt} />);

    const wrapper = container.querySelector('.offer__image-wrapper');
    expect(wrapper?.tagName).toBe('DIV');

    const image = wrapper?.querySelector('img');
    expect(image).toBeInTheDocument();
  });

  it('должен корректно отображать изображение с пустым alt', () => {
    render(<OfferImage imgSrc={mockImgSrc} imgAlt="" />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', '');
  });

  it('должен корректно отображать изображение с длинным alt', () => {
    const longAlt = 'A very long description of the image that contains multiple words and details about what is shown in the picture';
    render(<OfferImage imgSrc={mockImgSrc} imgAlt={longAlt} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', longAlt);
  });

  it('должен корректно отображать изображение с разными src', () => {
    const differentSrc = 'https://another-example.com/different-image.png';
    render(<OfferImage imgSrc={differentSrc} imgAlt={mockImgAlt} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', differentSrc);
  });

  it('должен иметь только один элемент img', () => {
    const { container } = render(<OfferImage imgSrc={mockImgSrc} imgAlt={mockImgAlt} />);

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(1);
  });
});
