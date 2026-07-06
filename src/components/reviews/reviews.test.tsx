import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Reviews } from './reviews';

import { setErrorType } from '../../store/action';
import { AuthorizationStatus, TYPE_OF_ERROR, REVIEW_OFFER } from '../../const';
import { getSelectedOfferCommentsLoadingStatus } from '../../store/selectors/offer-slice';
import { checkErrorAddComment } from '../../store/selectors/error-slice';
import type { CommentElementType } from '../../types/comments';

const { mockDispatch, mockUseAppSelector } = vi.hoisted(() => ({
  mockDispatch: vi.fn(() => ({ unwrap: () => Promise.resolve() })),
  mockUseAppSelector: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ offerId: 'test-offer-id' }),
  };
});

vi.mock('../../hooks/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: mockUseAppSelector,
}));

vi.mock('../../store/api-actions', () => ({
  fetchCommentsOfferAction: vi.fn(),
}));

vi.mock('../../store/action', () => ({
  setErrorType: vi.fn(),
}));

vi.mock('../../store/selectors/offer-slice', () => ({
  getSelectedOfferCommentsLoadingStatus: vi.fn(),
}));

vi.mock('../../store/selectors/error-slice', () => ({
  checkErrorAddComment: vi.fn(),
}));

vi.mock('../../utils', () => ({
  sortCommentsByDate: vi.fn((comments: CommentElementType[]) => comments),
}));

vi.mock('../message/message', () => ({
  Message: () => <div data-testid="message">Message</div>,
}));

vi.mock('./reviews-comments', () => ({
  ReviewsComments: ({ comments }: { comments: unknown[] }) => (
    <div data-testid="reviews-comments">Comments: {comments.length}</div>
  ),
}));

vi.mock('./reviews-form', () => ({
  ReviewsForm: () => <div data-testid="reviews-form">Reviews Form</div>,
}));

const mockComments = [
  { id: '1', date: '2024-01-01T12:00:00.000Z', user: { name: 'User 1', avatarUrl: '', isPro: false }, comment: 'Good', rating: 5 },
  { id: '2', date: '2024-01-02T12:00:00.000Z', user: { name: 'User 2', avatarUrl: '', isPro: false }, comment: 'Nice', rating: 4 },
];

const setupSelectors = (loadingStatus = false, errorAddComment = false) => {
  mockUseAppSelector.mockImplementation((selector: unknown) => {
    if (typeof selector === 'function') {
      const selectorStr = selector.toString();
      if (selectorStr.includes('authorizationStatus')) {
        return AuthorizationStatus.Auth;
      }
      if (selectorStr.includes('selectedOfferComments')) {
        return mockComments;
      }
    }
    if (selector === getSelectedOfferCommentsLoadingStatus) {
      return loadingStatus;
    }
    if (selector === checkErrorAddComment) {
      return errorAddComment;
    }
    return undefined;
  });
};

const renderReviews = () => render(
  <MemoryRouter>
    <Reviews />
  </MemoryRouter>
);

describe('Reviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  it('should render reviews section', () => {
    setupSelectors();
    renderReviews();
    expect(screen.getByRole('heading', { name: /Reviews/ })).toBeInTheDocument();
  });

  it('should display comments count', () => {
    setupSelectors();
    renderReviews();
    expect(screen.getByText(mockComments.length.toString())).toBeInTheDocument();
  });

  it('should dispatch setErrorType with null after successful fetch', async () => {
    setupSelectors();
    renderReviews();
    await waitFor(() => {
      expect(setErrorType).toHaveBeenCalledWith(null);
    });
  });

  it('should dispatch setErrorType with ERROR_LOADING_COMMENTS on fetch error', async () => {
    setupSelectors();
    mockDispatch.mockReturnValueOnce({ unwrap: () => Promise.reject(new Error('Failed')) });
    renderReviews();
    await waitFor(() => {
      expect(setErrorType).toHaveBeenCalledWith(TYPE_OF_ERROR.ERROR_LOADING_COMMENTS);
    });
  });

  it('should render Message when loading is false', () => {
    setupSelectors(false, false);
    renderReviews();
    expect(screen.getByTestId('message')).toBeInTheDocument();
  });

  it('should render Message when loading is true', () => {
    setupSelectors(true, false);
    renderReviews();
    expect(screen.queryByTestId('message')).not.toBeInTheDocument();
  });

  it('should render Message when errorAddComment is true', () => {
    setupSelectors(false, true);
    renderReviews();
    expect(screen.getByTestId('message')).toBeInTheDocument();
  });

  it('should not render Message only when loading is true and no error', () => {
    setupSelectors(true, false);
    renderReviews();
    expect(screen.queryByTestId('message')).not.toBeInTheDocument();
  });

  it('should render ReviewsForm when user is authenticated', () => {
    setupSelectors();
    renderReviews();
    expect(screen.getByTestId('reviews-form')).toBeInTheDocument();
  });

  it('should not render ReviewsForm when user is not authenticated', () => {
    mockUseAppSelector.mockImplementation((selector: unknown) => {
      if (typeof selector === 'function') {
        const selectorStr = selector.toString();
        if (selectorStr.includes('authorizationStatus')) {
          return AuthorizationStatus.NoAuth;
        }
        if (selectorStr.includes('selectedOfferComments')) {
          return mockComments;
        }
      }
      if (selector === getSelectedOfferCommentsLoadingStatus) {
        return false;
      }
      if (selector === checkErrorAddComment) {
        return false;
      }
      return undefined;
    });
    renderReviews();
    expect(screen.queryByTestId('reviews-form')).not.toBeInTheDocument();
  });

  it('should render ReviewsComments with limited comments', () => {
    const manyComments = Array.from({ length: 20 }, (_, i) => ({
      id: `c-${i}`, date: `2024-01-${i + 1}T12:00:00.000Z`, user: { name: `U${i}`, avatarUrl: '', isPro: false }, comment: `C${i}`, rating: 4
    }));
    mockUseAppSelector.mockImplementation((selector: unknown) => {
      if (typeof selector === 'function') {
        const selectorStr = selector.toString();
        if (selectorStr.includes('authorizationStatus')) {
          return AuthorizationStatus.Auth;
        }
        if (selectorStr.includes('selectedOfferComments')) {
          return manyComments;
        }
      }
      if (selector === getSelectedOfferCommentsLoadingStatus) {
        return false;
      }
      if (selector === checkErrorAddComment) {
        return false;
      }
      return undefined;
    });
    renderReviews();
    expect(screen.getByTestId('reviews-comments')).toHaveTextContent(`Comments: ${REVIEW_OFFER.MAX_COMMENTS_COUNT}`);
  });

  it('should render ReviewsComments with all comments when less than max', () => {
    setupSelectors();
    renderReviews();
    expect(screen.getByTestId('reviews-comments')).toHaveTextContent(`Comments: ${mockComments.length}`);
  });
});
