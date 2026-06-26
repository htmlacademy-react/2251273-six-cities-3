import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CardBookmark } from './card-bookmark';
import type { OffersElementType } from '../../types/offers';

// 1. Создаем моки с помощью vi.hoisted
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

// 2. Мокаем react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 3. Мокаем Redux hooks
vi.mock('../../hooks/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: mockUseAppSelector,
}));

// 4. Мокаем api-actions
vi.mock('../../store/api-actions', () => ({
  postFavoriteOfferAction: mockPostFavoriteOfferAction,
}));

// 5. Мокаем utils
vi.mock('../../utils', () => ({
  switchButton: vi.fn(),
}));

// 6. Мокаем константы
vi.mock('../../const', () => ({
  AppRoute: { Login: '/login' },
}));

// 7. Мокаем селекторы
vi.mock('../../store/selectors/user-selector', () => ({
  getAuthCheckedStatus: 'user/getAuthCheckedStatus',
}));

describe('CardBookmark', () => {
  const mockOffer: OffersElementType = {
    id: 'offer-1',
    title: 'Test Offer',
    type: 'apartment',
    price: 100,
    city: { name: 'Paris', location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 } },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    isFavorite: false,
    isPremium: false,
    rating: 4,
    previewImage: 'preview.jpg',
  };

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

  it('не должен добавлять активный класс, если оффер не в избранном', () => {
    render(<CardBookmark offer={mockOffer} />);

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('place-card__bookmark-button--active');
  });

  it('при клике должен диспатчить postFavoriteOfferAction, если пользователь авторизован', async () => {
    mockUseAppSelector.mockReturnValue(true);
    render(<CardBookmark offer={mockOffer} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockPostFavoriteOfferAction).toHaveBeenCalledWith({
        id: mockOffer.id,
        status: true, // !isFavoriteState = !false = true
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
    expect(button).not.toHaveClass('place-card__bookmark-button--active');

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveClass('place-card__bookmark-button--active');
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
