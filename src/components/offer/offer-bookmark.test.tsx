// OfferBookmark.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { OfferBookmark } from './offer-bookmark';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { getAuthCheckedStatus } from '../../store/selectors/user-selector';
import { AppRoute } from '../../const';
import { useNavigate } from 'react-router-dom';
import type { OfferType } from '../../types/offer';
import '@testing-library/jest-dom/vitest';

// Моки с сохранением оригинальных экспортов
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../hooks/hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/api-actions', () => ({
  postFavoriteOfferAction: vi.fn(),
}));

vi.mock('../../utils', () => ({
  switchButton: vi.fn(),
}));

vi.mock('../../store/selectors/user-selector', () => ({
  getAuthCheckedStatus: vi.fn(),
}));

vi.mock('../../store/action', () => ({
  updateFavoriteSelectedOffer: vi.fn(),
  updateFavoriteOffers: vi.fn(),
}));

const mockOffer: OfferType = { id: '123', isFavorite: false } as OfferType;

describe('OfferBookmark', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Типизированные моки через vi.mocked
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useAppSelector).mockImplementation((selector) =>
      selector === getAuthCheckedStatus ? true : undefined
    );
  });

  const renderComponent = (offer = mockOffer) => {
    const store = configureStore({ reducer: {} });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferBookmark offer={offer} />
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders button with base classes', () => {
    renderComponent();
    const button = screen.getByRole('button');
    expect(button).toHaveClass('offer__bookmark-button', 'button');
  });

  it('renders active class when favorite', () => {
    renderComponent({ ...mockOffer, isFavorite: true });
    expect(screen.getByRole('button')).toHaveClass('offer__bookmark-button--active');
  });

  it('navigates to login if not authenticated', () => {
    vi.mocked(useAppSelector).mockReturnValue(false);
    renderComponent();
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Login);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

});
