import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OfferMap } from './offer-map';

describe('OfferMap', () => {
  it('должен корректно рендериться', () => {
    const { container } = render(<OfferMap />);

    expect(container).toBeInTheDocument();
  });

  it('должен рендерить section элемент', () => {
    const { container } = render(<OfferMap />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('должен иметь класс "offer__map"', () => {
    const { container } = render(<OfferMap />);

    const section = container.querySelector('.offer__map');
    expect(section).toBeInTheDocument();
  });

  it('должен иметь класс "map"', () => {
    const { container } = render(<OfferMap />);

    const section = container.querySelector('.map');
    expect(section).toBeInTheDocument();
  });

  it('должен иметь оба класса одновременно', () => {
    const { container } = render(<OfferMap />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('offer__map');
    expect(section).toHaveClass('map');
  });

  it('должен быть пустым элементом', () => {
    const { container } = render(<OfferMap />);

    const section = container.querySelector('section');
    expect(section?.children.length).toBe(0);
    expect(section?.textContent).toBe('');
  });

  it('должен иметь правильную структуру DOM', () => {
    const { container } = render(<OfferMap />);

    const section = container.querySelector('section');
    expect(section?.tagName).toBe('SECTION');
  });
});
