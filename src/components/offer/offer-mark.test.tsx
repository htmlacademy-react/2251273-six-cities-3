import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OfferMark } from './offer-mark';

describe('OfferMark', () => {
  it('должен корректно отображать текст "Premium"', () => {
    render(<OfferMark />);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('должен иметь правильный CSS класс для контейнера', () => {
    const { container } = render(<OfferMark />);

    const markContainer = container.querySelector('.offer__mark');
    expect(markContainer).toBeInTheDocument();
  });

  it('должен рендерить span внутри div', () => {
    const { container } = render(<OfferMark />);

    const markContainer = container.querySelector('.offer__mark');
    const spanElement = markContainer?.querySelector('span');

    expect(spanElement).toBeInTheDocument();
    expect(spanElement).toHaveTextContent('Premium');
  });

  it('должен иметь правильную структуру DOM', () => {
    const { container } = render(<OfferMark />);

    const markContainer = container.querySelector('.offer__mark');
    expect(markContainer?.tagName).toBe('DIV');

    const spanElement = markContainer?.querySelector('span');
    expect(spanElement?.tagName).toBe('SPAN');
  });

  it('должен отображать только один элемент с текстом "Premium"', () => {
    render(<OfferMark />);

    const premiumElements = screen.getAllByText('Premium');
    expect(premiumElements).toHaveLength(1);
  });
});
