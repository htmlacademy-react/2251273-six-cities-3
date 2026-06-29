import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Reviews } from './reviews';
import { AuthorizationStatus, TYPE_OF_ERROR } from '../../const';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { useParams } from 'react-router-dom';
import { fetchCommentsOfferAction } from '../../store/api-actions';
import { setErrorType } from '../../store/action';
import { CommentElementType } from '../../types/comments';
type RootState = Parameters<Parameters<typeof useAppSelector>[0]>[0];

vi.mock('../../hooks/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

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

  const renderComponent = (initialState: {
    OFFER: { selectedOfferComments: CommentElementType[]; selectedOfferCommentsLoadingStatus: boolean };
    USER: { authorizationStatus: AuthorizationStatus };
  }) => {
    vi.mocked(useAppSelector).mockImplementation((selector) =>
      selector({
        OFFER: initialState.OFFER,
        USER: initialState.USER,
      } as unknown as RootState)
    );

    render(<Reviews />);
  };

  it('should dispatch fetchCommentsOfferAction on mount', () => {
    const initialState = {
      OFFER: { selectedOfferComments: [], selectedOfferCommentsLoadingStatus: true },
      USER: { authorizationStatus: AuthorizationStatus.Auth },
    };

    renderComponent(initialState);

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

    renderComponent(initialState);

    expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
    expect(screen.queryByTestId('reviews-form')).not.toBeInTheDocument();
  });

  it('should render ReviewsForm when user is authorized', () => {
    const initialState = {
      OFFER: { selectedOfferComments: [], selectedOfferCommentsLoadingStatus: true },
      USER: { authorizationStatus: AuthorizationStatus.Auth },
    };

    renderComponent(initialState);

    expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
    expect(screen.getByTestId('reviews-form')).toBeInTheDocument();
  });

  it('should show Message and dispatch setErrorType when loading status is false', () => {
    const initialState = {
      OFFER: { selectedOfferComments: [], selectedOfferCommentsLoadingStatus: false },
      USER: { authorizationStatus: AuthorizationStatus.Auth },
    };

    renderComponent(initialState);

    expect(screen.getByTestId('message')).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith(setErrorType(TYPE_OF_ERROR.ERROR_LOADING_COMMENTS));
  });
});
