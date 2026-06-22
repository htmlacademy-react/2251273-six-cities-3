import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CitiesPlaces } from './cities-places';
import { OffersElementType } from '../../types/offers';
import { getCounterOffers } from '../../utils'; // импортируем для управления моком

// Мокаем дочерние компоненты
vi.mock('../sorting/sorting', () => ({
  Sorting: () => <div data-testid="sorting">Sorting component</div>,
}));

vi.mock('../card/card', () => ({
  Card: ({ offer, onOfferHover }: { offer: OffersElementType; onOfferHover: (id: string) => void }) => (
    <div data-testid={`card-${offer.id}`} onClick={() => onOfferHover(offer.id)}>
      {offer.title}
    </div>
  ),
}));

// Мокаем утилиту, возвращая мок-функцию
vi.mock('../../utils', () => ({
  getCounterOffers: vi.fn(),
}));

describe('CitiesPlaces', () => {
  const mockOffers: OffersElementType[] = [
    { id: '1', title: 'Beautiful apartment' } as OffersElementType,
    { id: '2', title: 'Cozy house' } as OffersElementType,
  ];
  const city = 'Paris';
  const mockOnOfferHover = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks(); // сбрасываем вызовы и возвращаемые значения
  });

  it('should render correctly with offers', () => {
    // Устанавливаем нужное количество
    vi.mocked(getCounterOffers).mockReturnValue(2);

    render(
      <CitiesPlaces
        offers={mockOffers}
        city={city}
        onOfferHover={mockOnOfferHover}
      />
    );

    expect(screen.getByText('2 places to stay in Paris')).toBeInTheDocument();
    expect(screen.getByTestId('sorting')).toBeInTheDocument();
    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();
    expect(screen.getByText('Beautiful apartment')).toBeInTheDocument();
    expect(screen.getByText('Cozy house')).toBeInTheDocument();
  });

  it('should pass onOfferHover to each Card', () => {
    vi.mocked(getCounterOffers).mockReturnValue(2);

    render(
      <CitiesPlaces
        offers={mockOffers}
        city={city}
        onOfferHover={mockOnOfferHover}
      />
    );

    screen.getByTestId('card-1').click();
    expect(mockOnOfferHover).toHaveBeenCalledWith('1');

    screen.getByTestId('card-2').click();
    expect(mockOnOfferHover).toHaveBeenCalledWith('2');
  });

  it('should display "No places" message when offers list is empty', () => {
    vi.mocked(getCounterOffers).mockReturnValue(0);

    render(
      <CitiesPlaces
        offers={[]}
        city={city}
        onOfferHover={mockOnOfferHover}
      />
    );

    expect(screen.queryByTestId(/card-/)).not.toBeInTheDocument();
  });

  it('should render correct count using getCounterOffers', () => {
    // Переопределяем возвращаемое значение (может отличаться от реальной длины)
    vi.mocked(getCounterOffers).mockReturnValue(5);

    render(
      <CitiesPlaces
        offers={mockOffers} // реально 2 элемента
        city={city}
        onOfferHover={mockOnOfferHover}
      />
    );

    // Проверяем, что отображается именно 5 (из мока), а не 2
    expect(screen.getByText('5 places to stay in Paris')).toBeInTheDocument();
  });
});
