import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LocationsItem } from './locations-item'; // Укажите правильный путь к компоненту

// 1. Создаем моки с помощью vi.hoisted, чтобы избежать проблем с порядком инициализации
const { mockDispatch, mockNavigate, mockUseAppSelector } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  mockNavigate: vi.fn(),
  mockUseAppSelector: vi.fn(),
}));

// 2. Мокаем react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 3. Мокаем хуки Redux
vi.mock('../../hooks/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: mockUseAppSelector,
}));

// 4. Мокаем экшены Redux, чтобы предсказуемо проверять их вызовы
vi.mock('../../store/action', () => ({
  changeCity: vi.fn((city: string) => ({
    type: 'city/changeCity',
    payload: city
  })),
  changeSorting: vi.fn((sort: string) => ({
    type: 'sorting/changeSorting',
    payload: sort
  })),
}));

// 5. Мокаем константы
vi.mock('../../const', () => ({
  AppRoute: { Main: '/' },
  DEFAULT_SORTING: 'POPULAR',
}));

describe('LocationsItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Сбрасываем значение селектора по умолчанию
    mockUseAppSelector.mockReturnValue('');
  });

  it('должен корректно отображать название локации', () => {
    render(<LocationsItem location="Paris" />, { wrapper: MemoryRouter });

    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('должен добавлять активный класс, если локация совпадает с выбранным городом', () => {
    mockUseAppSelector.mockReturnValue('Paris');

    render(<LocationsItem location="Paris" />, { wrapper: MemoryRouter });

    const link = screen.getByText('Paris').closest('a');
    expect(link).toHaveClass('tabs__item--active');
  });

  it('должен добавлять активный класс без учета регистра', () => {
    mockUseAppSelector.mockReturnValue('pArIs');

    render(<LocationsItem location="Paris" />, { wrapper: MemoryRouter });

    const link = screen.getByText('Paris').closest('a');
    expect(link).toHaveClass('tabs__item--active');
  });

  it('не должен добавлять активный класс, если локация не совпадает с городом', () => {
    mockUseAppSelector.mockReturnValue('London');

    render(<LocationsItem location="Paris" />, { wrapper: MemoryRouter });

    const link = screen.getByText('Paris').closest('a');
    expect(link).not.toHaveClass('tabs__item--active');
  });

  it('при клике должен диспатчить экшены смены города и сортировки, а также делать navigate', () => {
    mockUseAppSelector.mockReturnValue('London');

    render(<LocationsItem location="Paris" />, { wrapper: MemoryRouter });

    const link = screen.getByText('Paris').closest('a')!;
    fireEvent.click(link);

    // Проверяем вызовы dispatch
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'city/changeCity',
      payload: 'Paris'
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sorting/changeSorting',
      payload: 'POPULAR'
    });

    // Проверяем вызов navigate
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/'); // AppRoute.Main
  });
});
