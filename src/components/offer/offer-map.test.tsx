// OfferMap.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { OfferMap } from './offer-map';

// Подключаем matchers из @testing-library/jest-dom (нужно настроить в setup-файле)
import '@testing-library/jest-dom/vitest';

describe('OfferMap', () => {
  it('renders a section element with correct classes', () => {
    render(<OfferMap />);

    // Ищем элемент section с обоими классами
    const section = document.querySelector('section.offer__map.map');

    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('offer__map');
    expect(section).toHaveClass('map');
  });

  it('renders without errors', () => {
    expect(() => render(<OfferMap />)).not.toThrow();
  });

  it('matches snapshot', () => {
    const { container } = render(<OfferMap />);
    expect(container).toMatchSnapshot();
  });
});
