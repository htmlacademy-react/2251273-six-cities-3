import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CardBookmark } from './card-bookmark';
import type { OffersElementType } from '../../types/offers';
import { OFFERS } from '../../mocks/mock-offers';

const {
  mockDispatch,
  mockNavigate,
  mockUseAppSelector,
  mockPostFavoriteOfferAction
} = vi.hoisted(() => ({
  mockDispatch: vi.fn(() => ({ unwrap: vi.fn(() => Promise.resolve()) })),
  mockNavigate: vi.fn(),
  mockUseAppSelector: vi.fn(),
  mockPostFavoriteOfferAction: vi.fn(),
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

vi.mock('../../store/api-actions', () => ({
  postFavoriteOfferAction: mockPostFavoriteOfferAction,
}));

vi.mock('../../utils', () => ({
  switchButton: vi.fn(),
}));

vi.mock('../../store/selectors/user-selector', () => ({
  getAuthCheckedStatus: 'user/getAuthCheckedStatus',
}));

describe('CardBookmark', () => {
  const mockOffer: OffersElementType = OFFERS[0];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppSelector.mockReturnValue(true);
    mockDispatch.mockReturnValue({ unwrap: vi.fn(() => Promise.resolve()) });
  });

  it('должен корректно отображать кнопку закладки', () => {
    render(<CardBookmark offer={mockOffer} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('place-card__bookmark-button');
  });

  it('должен добавлять активный класс, если оффер в избранном', () => {
    const favoriteOffer = { ...mockOffer, isFavorite: true };
    render(<CardBookmark offer={favoriteOffer} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('place-card__bookmark-button--active');
  });

  it('должен добавлять активный класс, если оффер в избранном', () => {
    render(<CardBookmark offer={mockOffer} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('place-card__bookmark-button--active');
  });

  it('при клике должен диспатчить postFavoriteOfferAction, если пользователь авторизован', async () => {
    mockUseAppSelector.mockReturnValue(true);
    render(<CardBookmark offer={mockOffer} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockPostFavoriteOfferAction).toHaveBeenCalledWith({
        id: mockOffer.id,
        status: false,
      });
    });
  });

  it('при клике должен делать navigate на страницу логина, если пользователь не авторизован', () => {
    mockUseAppSelector.mockReturnValue(false);
    render(<CardBookmark offer={mockOffer} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockPostFavoriteOfferAction).not.toHaveBeenCalled();
  });

  it('должен переключать состояние isFavorite после успешного dispatch', async () => {
    mockUseAppSelector.mockReturnValue(true);
    render(<CardBookmark offer={mockOffer} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('place-card__bookmark-button--active');

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).not.toHaveClass('place-card__bookmark-button--active');
    });
  });

  it('должен вызывать preventDefault при клике', () => {
    render(<CardBookmark offer={mockOffer} />);

    const button = screen.getByRole('button');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

    button.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

});
