import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CardBookmark } from './card-bookmark';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { switchButton } from '../../utils';
import { getAuthCheckedStatus } from '../../store/selectors/user-selector';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../const';
import { OffersElementType } from '../../types/offers';

// Мокаем все внешние зависимости
vi.mock('../../store/api-actions', () => ({
  postFavoriteOfferAction: vi.fn(),
}));

vi.mock('../../hooks/hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../utils', () => ({
  switchButton: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../../store/selectors/user-selector', () => ({
  getAuthCheckedStatus: vi.fn(),
}));

describe('CardBookmark', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  // Минимальный объект предложения для тестов
  const mockOffer: OffersElementType = {
    id: '1',
    isFavorite: false,
    // Добавьте остальные обязательные поля в соответствии с вашим типом
    // (например, title, type, price, rating, previewImage, etc.)
  } as OffersElementType;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    // По умолчанию считаем пользователя авторизованным
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector === getAuthCheckedStatus) {
        return true;
      }
      return undefined;
    });
  });

  it('should render button with active class when offer.isFavorite is true', () => {
    const offerWithFavorite = { ...mockOffer, isFavorite: true };
    render(<CardBookmark offer={offerWithFavorite} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('place-card__bookmark-button--active');
  });

  it('should render button without active class when offer.isFavorite is false', () => {
    render(<CardBookmark offer={mockOffer} />);

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('place-card__bookmark-button--active');
  });

  it('should navigate to login page if user is not authenticated', () => {
    // Переопределяем селектор для неавторизованного пользователя
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector === getAuthCheckedStatus) {
        return false;
      }
      return undefined;
    });

    render(<CardBookmark offer={mockOffer} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Login);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(switchButton).not.toHaveBeenCalled();
  });
});
