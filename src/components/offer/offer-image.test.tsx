// OfferImage.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfferImage } from './offer-image';
import '@testing-library/jest-dom/vitest';

describe('OfferImage', () => {
  const defaultProps = {
    imgSrc: 'https://example.com/photo.jpg',
    imgAlt: 'Beautiful view',
  };

  it('renders a div with correct class', () => {
    render(<OfferImage {...defaultProps} />);
    const wrapper = document.querySelector('.offer__image-wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('offer__image-wrapper');
  });

  it('renders an img with correct class', () => {
    render(<OfferImage {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('offer__image');
  });

  it('sets src and alt attributes correctly', () => {
    render(<OfferImage {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', defaultProps.imgSrc);
    expect(img).toHaveAttribute('alt', defaultProps.imgAlt);
  });

  it('renders with empty src and alt', () => {
    render(<OfferImage imgSrc="" imgAlt="" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '');
    expect(img).toHaveAttribute('alt', '');
  });

  it('matches snapshot', () => {
    const { container } = render(<OfferImage {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });
});
