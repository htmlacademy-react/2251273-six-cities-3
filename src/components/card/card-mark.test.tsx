import { render, screen } from '@testing-library/react';
import { CardMark } from './card-mark';

describe('CardMark', () => {
  it('renders the premium badge with default label', () => {
    render(<CardMark />);

    // Проверяем, что текст "Premium" присутствует
    const badge = screen.getByText('Premium');
    expect(badge).toBeInTheDocument();

    // Проверяем, что обёртка имеет класс place-card__mark
    const wrapper = badge.closest('.place-card__mark');
    expect(wrapper).toBeInTheDocument();
  });

  it('applies default aria-label when no label provided', () => {
    render(<CardMark />);
    const div = screen.getByText('Premium').closest('.place-card__mark');
    expect(div).toHaveAttribute('aria-label', 'Premium');
  });
});
