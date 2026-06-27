import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LocationsItem } from './locations-item';

const { mockDispatch, mockNavigate, mockUseAppSelector } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  mockNavigate: vi.fn(),
  mockUseAppSelector: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../hooks/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: mockUseAppSelector,
}));

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

vi.mock('../../const', () => ({
  AppRoute: { Main: '/' },
  DEFAULT_SORTING: 'POPULAR',
}));

describe('LocationsItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'city/changeCity',
      payload: 'Paris'
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sorting/changeSorting',
      payload: 'POPULAR'
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
