import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sorting } from './sorting';

// 1. Создаем моки с помощью vi.hoisted
const {
  mockDispatch,
  mockUseAppSelector
} = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  mockUseAppSelector: vi.fn(),
}));

// 2. Мокаем Redux hooks
vi.mock('../../hooks/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: mockUseAppSelector,
}));

// 3. Мокаем utils
vi.mock('../../utils', () => ({
  getPlacesOptionsLabel: vi.fn((value: string) => {
    const labels: Record<string, string> = {
      POPULAR: 'Popular',
      PRICE_LOW_TO_HIGH: 'Price: low to high',
      PRICE_HIGH_TO_LOW: 'Price: high to low',
      TOP_RATED_FIRST: 'Top rated first',
    };
    return labels[value] || value;
  }),
}));

// 4. Мокаем action
vi.mock('../../store/action', () => ({
  changeSorting: vi.fn((sort: string) => ({
    type: 'sorting/changeSorting',
    payload: sort
  })),
}));

// 5. Мокаем константы
vi.mock('../../const', () => ({
  PLACES_OPTIONS: [
    { value: 'POPULAR', label: 'Popular' },
    { value: 'PRICE_LOW_TO_HIGH', label: 'Price: low to high' },
    { value: 'PRICE_HIGH_TO_LOW', label: 'Price: high to low' },
    { value: 'TOP_RATED_FIRST', label: 'Top rated first' },
  ],
}));

// 6. Мокаем селекторы
vi.mock('../../store/selectors/sorting-slice', () => ({
  getSelectedSorting: 'sorting/getSelectedSorting',
}));

describe('Sorting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppSelector.mockReturnValue('POPULAR');
  });

  it('должен корректно отображать компонент сортировки', () => {
    render(<Sorting />);

    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByTestId('sorting-type')).toHaveTextContent('Popular');
  });

  it('должен открывать список опций при клике на заголовок', () => {
    render(<Sorting />);

    const sortingType = screen.getByTestId('sorting-type');
    fireEvent.click(sortingType);

    // Проверяем, что класс places__options--opened был добавлен
    const optionsList = document.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');
  });

  it('должен закрывать список опций при повторном клике на заголовок', () => {
    render(<Sorting />);

    const sortingType = screen.getByTestId('sorting-type');

    // Открываем
    fireEvent.click(sortingType);
    let optionsList = document.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');

    // Закрываем
    fireEvent.click(sortingType);
    optionsList = document.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('должен диспатчить changeSorting при выборе опции', () => {
    render(<Sorting />);

    const priceLowOption = screen.getByText('Price: low to high');
    fireEvent.click(priceLowOption);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sorting/changeSorting',
      payload: 'PRICE_LOW_TO_HIGH',
    });
  });

  it('должен закрывать список опций при выборе опции', () => {
    render(<Sorting />);

    // Сначала открываем список
    const sortingType = screen.getByTestId('sorting-type');
    fireEvent.click(sortingType);

    let optionsList = document.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');

    // Выбираем опцию
    const priceLowOption = screen.getByText('Price: low to high');
    fireEvent.click(priceLowOption);

    // Список должен закрыться
    optionsList = document.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('должен закрывать список опций при mouseLeave', () => {
    render(<Sorting />);

    // Сначала открываем список
    const sortingType = screen.getByTestId('sorting-type');
    fireEvent.click(sortingType);

    let optionsList = document.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');

    // Симулируем mouseLeave на форме
    const form = document.querySelector('.places__sorting');
    fireEvent.mouseLeave(form!);

    // Список должен закрыться
    optionsList = document.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('должен отображать правильный label для текущей сортировки', () => {
    mockUseAppSelector.mockReturnValue('PRICE_HIGH_TO_LOW');
    render(<Sorting />);

    expect(screen.getByTestId('sorting-type')).toHaveTextContent('Price: high to low');
  });

  it('должен вызывать preventDefault при клике на заголовок', () => {
    render(<Sorting />);

    const sortingType = screen.getByTestId('sorting-type');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

    sortingType.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

});
