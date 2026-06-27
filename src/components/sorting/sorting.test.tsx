import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sorting } from './sorting';

const {
  mockDispatch,
  mockUseAppSelector
} = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  mockUseAppSelector: vi.fn(),
}));

vi.mock('../../hooks/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: mockUseAppSelector,
}));

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

vi.mock('../../store/action', () => ({
  changeSorting: vi.fn((sort: string) => ({
    type: 'sorting/changeSorting',
    payload: sort
  })),
}));

vi.mock('../../const', () => ({
  PLACES_OPTIONS: [
    { value: 'POPULAR', label: 'Popular' },
    { value: 'PRICE_LOW_TO_HIGH', label: 'Price: low to high' },
    { value: 'PRICE_HIGH_TO_LOW', label: 'Price: high to low' },
    { value: 'TOP_RATED_FIRST', label: 'Top rated first' },
  ],
}));

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

    const optionsList = document.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');
  });

  it('должен закрывать список опций при повторном клике на заголовок', () => {
    render(<Sorting />);

    const sortingType = screen.getByTestId('sorting-type');

    fireEvent.click(sortingType);
    let optionsList = document.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');

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

    const sortingType = screen.getByTestId('sorting-type');
    fireEvent.click(sortingType);

    let optionsList = document.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');

    const priceLowOption = screen.getByText('Price: low to high');
    fireEvent.click(priceLowOption);

    optionsList = document.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('должен закрывать список опций при mouseLeave', () => {
    render(<Sorting />);

    const sortingType = screen.getByTestId('sorting-type');
    fireEvent.click(sortingType);

    let optionsList = document.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');

    const form = document.querySelector('.places__sorting');
    fireEvent.mouseLeave(form!);

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
