import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Reviews } from './reviews';
import { AuthorizationStatus, TYPE_OF_ERROR } from '../../const';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { useParams } from 'react-router-dom';
import { fetchCommentsOfferAction } from '../../store/api-actions';
import { setErrorType } from '../../store/action';
import * as ReactRouterDom from 'react-router-dom';
import { CommentElementType } from '../../types/comments';

vi.mock('../../hooks/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouterDom>();
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('../../store/api-actions', () => ({
  fetchCommentsOfferAction: vi.fn(),
}));

vi.mock('../../store/action', () => ({
  setErrorType: vi.fn(),
}));

vi.mock('./reviews-list', () => ({
  ReviewsList: () => <div data-testid="reviews-list">ReviewsList Mock</div>,
}));

vi.mock('./reviews-form', () => ({
  ReviewsForm: () => <div data-testid="reviews-form">ReviewsForm Mock</div>,
}));

vi.mock('../message/message', () => ({
  Message: () => <div data-testid="message">Message Mock</div>,
}));

describe('Reviews', () => {
  const mockDispatch = vi.fn();
  const mockOfferId = 'offer123';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ offerId: mockOfferId });
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
  });

  const renderWithStore = (initialState: {
    OFFER: { selectedOfferComments: CommentElementType[]; selectedOfferCommentsLoadingStatus: boolean };
    USER: { authorizationStatus: AuthorizationStatus };
  }) => {
    const store = configureStore({
      reducer: {
        OFFER: () => initialState.OFFER,
        USER: () => initialState.USER,
      },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Reviews />
        </MemoryRouter>
      </Provider>
    );
  };

  it('should dispatch fetchCommentsOfferAction on mount', () => {
    const initialState = {
      OFFER: { selectedOfferComments: [], selectedOfferCommentsLoadingStatus: true },
      USER: { authorizationStatus: AuthorizationStatus.Auth },
    };
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.toString().includes('getSelectedOfferCommentsLoadingStatus')) {
        return initialState.OFFER.selectedOfferCommentsLoadingStatus;
      }
      if (selector.toString().includes('state.OFFER.selectedOfferComments')) {
        return initialState.OFFER.selectedOfferComments;
      }
      if (selector.toString().includes('state.USER.authorizationStatus')) {
        return initialState.USER.authorizationStatus;
      }
      return undefined;
    });

    renderWithStore(initialState);
    expect(mockDispatch).toHaveBeenCalledWith(fetchCommentsOfferAction(mockOfferId));
  });

  it('should render ReviewsList and not render ReviewsForm when user is not authorized', () => {
    const mockComment: CommentElementType = {
      id: '1',
      date: '2026-06-23T10:00:00Z',
      user: {
        name: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg',
        isPro: false
      },
      comment: 'Тестовый комментарий',
      rating: 4,
    };
    const initialState = {
      OFFER: {
        selectedOfferComments: [mockComment],
        selectedOfferCommentsLoadingStatus: true,
      },
      USER: { authorizationStatus: AuthorizationStatus.NoAuth },
    };
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.toString().includes('getSelectedOfferCommentsLoadingStatus')) {
        return initialState.OFFER.selectedOfferCommentsLoadingStatus;
      }
      if (selector.toString().includes('state.OFFER.selectedOfferComments')) {
        return initialState.OFFER.selectedOfferComments;
      }
      if (selector.toString().includes('state.USER.authorizationStatus')) {
        return initialState.USER.authorizationStatus;
      }
      return undefined;
    });

    renderWithStore(initialState);
    expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
    expect(screen.queryByTestId('reviews-form')).not.toBeInTheDocument();
  });

  it('should render ReviewsForm when user is authorized', () => {
    const initialState = {
      OFFER: { selectedOfferComments: [], selectedOfferCommentsLoadingStatus: true },
      USER: { authorizationStatus: AuthorizationStatus.Auth },
    };
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.toString().includes('getSelectedOfferCommentsLoadingStatus')) {
        return initialState.OFFER.selectedOfferCommentsLoadingStatus;
      }
      if (selector.toString().includes('state.OFFER.selectedOfferComments')) {
        return initialState.OFFER.selectedOfferComments;
      }
      if (selector.toString().includes('state.USER.authorizationStatus')) {
        return initialState.USER.authorizationStatus;
      }
      return undefined;
    });

    renderWithStore(initialState);
    expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
    expect(screen.getByTestId('reviews-form')).toBeInTheDocument();
  });

  it('should show Message and dispatch setErrorType when loading status is false', () => {
    const initialState = {
      OFFER: { selectedOfferComments: [], selectedOfferCommentsLoadingStatus: false },
      USER: { authorizationStatus: AuthorizationStatus.Auth },
    };
    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector.toString().includes('getSelectedOfferCommentsLoadingStatus')) {
        return initialState.OFFER.selectedOfferCommentsLoadingStatus;
      }
      if (selector.toString().includes('state.OFFER.selectedOfferComments')) {
        return initialState.OFFER.selectedOfferComments;
      }
      if (selector.toString().includes('state.USER.authorizationStatus')) {
        return initialState.USER.authorizationStatus;
      }
      return undefined;
    });

    renderWithStore(initialState);
    expect(screen.getByTestId('message')).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith(setErrorType(TYPE_OF_ERROR.ERROR_LOADING_COMMENTS));
  });
});
