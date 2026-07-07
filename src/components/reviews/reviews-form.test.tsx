import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ReviewsForm } from './reviews-form';

import { postCommentsOfferAction, fetchCommentsOfferAction } from '../../store/api-actions';
import { setErrorType } from '../../store/action';
import { REVIEW_OFFER, RATING_OFFER } from '../../const';

const { mockDispatch, mockUseParams } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  mockUseParams: vi.fn(() => ({ offerId: 'test-offer-id' })),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: mockUseParams,
  };
});

vi.mock('../../hooks/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('../../store/api-actions', () => ({
  postCommentsOfferAction: vi.fn(),
  fetchCommentsOfferAction: vi.fn(),
}));

vi.mock('../../store/action', () => ({
  setErrorType: vi.fn(),
}));

const renderReviewsForm = () => render(
  <MemoryRouter>
    <ReviewsForm />
  </MemoryRouter>
);

const fillValidForm = () => {
  fireEvent.click(screen.getByTestId('rating-5'));
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'a'.repeat(REVIEW_OFFER.MIN_COMMENT_LENGTH) },
  });
};

const submitForm = () => {
  const form = document.querySelector('form') as HTMLFormElement;
  fireEvent.submit(form);
};

describe('ReviewsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ offerId: 'test-offer-id' });
    mockDispatch.mockImplementation(() => ({ unwrap: () => Promise.resolve() }));

    vi.mocked(postCommentsOfferAction).mockImplementation(() => ({
      unwrap: () => Promise.resolve(),
    }) as unknown as ReturnType<typeof postCommentsOfferAction>);

    vi.mocked(fetchCommentsOfferAction).mockImplementation(() => ({
      type: 'mock',
    }) as unknown as ReturnType<typeof fetchCommentsOfferAction>);
  });

  it('should render form with textarea and submit button', () => {
    renderReviewsForm();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('should render all rating inputs', () => {
    renderReviewsForm();
    RATING_OFFER.forEach(({ value }) => {
      expect(screen.getByTestId(`rating-${value}`)).toBeInTheDocument();
    });
  });

  it('should have submit button disabled when rating is 0', () => {
    renderReviewsForm();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeDisabled();
  });

  it('should enable submit button when rating and comment are valid', () => {
    renderReviewsForm();
    fillValidForm();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeEnabled();
  });

  it('should update rating when clicking on rating input', () => {
    renderReviewsForm();
    fireEvent.click(screen.getByTestId('rating-4'));
    expect(screen.getByTestId('rating-4')).toBeChecked();
  });

  it('should update comment when typing in textarea', () => {
    renderReviewsForm();
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Great place!' } });
    expect(textarea).toHaveValue('Great place!');
  });

  it('should dispatch postCommentsOfferAction on form submit', async () => {
    renderReviewsForm();
    fillValidForm();

    await act(async () => {
      submitForm();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(postCommentsOfferAction).toHaveBeenCalledWith({
      offerId: 'test-offer-id',
      comment: 'a'.repeat(REVIEW_OFFER.MIN_COMMENT_LENGTH),
      rating: 5,
    });
  });

  it('should reset form after successful submit', async () => {
    renderReviewsForm();
    fillValidForm();

    await act(async () => {
      submitForm();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    RATING_OFFER.forEach(({ value }) => {
      expect(screen.getByTestId(`rating-${value}`)).not.toBeChecked();
    });
  });

  it('should dispatch setErrorType with null after successful submit', async () => {
    renderReviewsForm();
    fillValidForm();

    await act(async () => {
      submitForm();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(setErrorType).toHaveBeenCalledWith(null);
    });
  });

  it('should dispatch fetchCommentsOfferAction after successful submit', async () => {
    renderReviewsForm();
    fillValidForm();

    await act(async () => {
      submitForm();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(fetchCommentsOfferAction).toHaveBeenCalledWith('test-offer-id');
    });
  });

  it('should disable form inputs while submitting', async () => {
    let resolvePromise: (() => void) | undefined;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    let callCount = 0;
    mockDispatch.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { unwrap: () => promise };
      }
      return { unwrap: () => Promise.resolve() };
    });

    renderReviewsForm();
    fillValidForm();

    await act(async () => {
      submitForm();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent(/Submitting/i);
    });

    expect(screen.getByRole('textbox')).toBeDisabled();

    RATING_OFFER.forEach(({ value }) => {
      expect(screen.getByTestId(`rating-${value}`)).toBeDisabled();
    });

    resolvePromise?.();
  });

  it('should show "Submitting..." text while submitting', async () => {
    let resolvePromise: (() => void) | undefined;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    mockDispatch.mockReturnValueOnce({ unwrap: () => promise });

    renderReviewsForm();
    fillValidForm();

    await act(async () => {
      submitForm();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent(/Submitting/i);
    });

    resolvePromise?.();
  });

  it('should display help text with min comment length', () => {
    renderReviewsForm();
    expect(screen.getByText(new RegExp(`${REVIEW_OFFER.MIN_COMMENT_LENGTH} characters`))).toBeInTheDocument();
  });
});
