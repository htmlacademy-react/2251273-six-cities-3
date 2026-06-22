import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardType } from './card-type';

describe('Компонент CardType', () => {
  it('отображает переданный cardType', () => {
    render(<CardType cardType="Apartment" />);
    const paragraph = screen.getByText('Apartment');
    expect(paragraph).toBeInTheDocument();
  });

  it('имеет правильный CSS-класс', () => {
    render(<CardType cardType="Room" />);
    const paragraph = screen.getByText('Room');
    expect(paragraph).toHaveClass('place-card__type');
  });

  it('корректно отображает разные типы', () => {
    const types = ['Apartment', 'Room', 'House', 'Hotel'];
    types.forEach((type) => {
      const { unmount } = render(<CardType cardType={type} />);
      expect(screen.getByText(type)).toBeInTheDocument();
      unmount();
    });
  });

  // Опционально: snapshot-тест
  it('соответствует снепшоту', () => {
    const { container } = render(<CardType cardType="Apartment" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
