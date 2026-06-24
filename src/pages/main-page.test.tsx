// main-page.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MainPage } from './main-page';

// Мокаем хуки
vi.mock('../hooks/hooks', () => ({
  useAppDispatch: vi.fn(() => vi.fn()),
  useAppSelector: vi.fn(),
}));

// Мокаем селекторы
vi.mock('../store/selectors/city-slice', () => ({
  getSelectedCity: vi.fn(() => 'Paris'),
}));
vi.mock('../store/selectors/offers-slice', () => ({
  getOffers: vi.fn(() => []),
}));
vi.mock('../store/selectors/sorting-slice', () => ({
  getSelectedSorting: vi.fn(() => 'Popular'),
}));
vi.mock('../store/selectors/error-slice', () => ({
  checkErrorEmptyOffers: vi.fn(() => false),
}));

// Мокаем экшн
vi.mock('../store/api-actions', () => ({
  fetchOffersAction: vi.fn(() => ({ type: 'FETCH_OFFERS' })),
}));

// Мокаем дочерние компоненты
vi.mock('../components/locations/locations', () => ({
  Locations: () => <div>Locations</div>,
}));
vi.mock('../components/cities/cities', () => ({
  Cities: ({ offers, city }: { offers: unknown[]; city: string }) => (
    <div>
      Cities: {city}, offers: {offers.length}
    </div>
  ),
}));

// Мокаем утилиты
vi.mock('../utils', () => ({
  filterOffersByCity: vi.fn(() => []),
  getSortedOffersByType: vi.fn(() => []),
}));

// Мокаем clsx (опционально, можно оставить реальный)
vi.mock('clsx', () => ({
  clsx: vi.fn((...args: unknown[]) => args.filter(Boolean).join(' ')),
}));

describe('MainPage', () => {
  it('renders without crashing and contains the hidden title "Cities"', () => {
    render(<MainPage />);

    // Проверяем, что скрытый заголовок присутствует в DOM
    expect(screen.getByText('Cities')).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 1, name: 'Cities' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('visually-hidden');
    const locationsElement = screen.getByText('Locations');
    expect(locationsElement.tagName).toBe('DIV');
  });
});
