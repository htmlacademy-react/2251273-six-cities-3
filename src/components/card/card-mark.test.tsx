import { render, screen } from '@testing-library/react';
import { CardMark } from './card-mark';

describe('CardMark', () => {
  it('renders the premium badge with default label', () => {
    render(<CardMark />);

    const badge = screen.getByText('Premium');
    expect(badge).toBeInTheDocument();

    const wrapper = badge.closest('.place-card__mark');
    expect(wrapper).toBeInTheDocument();
  });
});
