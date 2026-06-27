import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, useParams } from 'react-router-dom';
import { ReviewsForm } from './reviews-form';
import { postCommentsOfferAction } from '../../store/api-actions';
import { REVIEW_OFFER, RATING_OFFER } from '../../const';
import { useAppDispatch } from '../../hooks/hooks';

// Мокируем зависимости
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('../../store/api-actions', () => ({
  postCommentsOfferAction: vi.fn(),
}));

vi.mock('../../utils', () => ({
  switchButton: vi.fn(),
}));

vi.mock('../../hooks/hooks', () => ({
  useAppDispatch: vi.fn(),
}));

describe('ReviewsForm', () => {
  const mockDispatch = vi.fn();
  const mockOfferId = 'offer123';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ offerId: mockOfferId });
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
    vi.mocked(postCommentsOfferAction).mockReturnValue({
      unwrap: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof postCommentsOfferAction>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const store = configureStore({
      reducer: {},
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ReviewsForm />
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render form fields and submit button', () => {
    renderComponent();

    const textarea = screen.getByPlaceholderText(
      /Tell how was your stay, what you like and what can be improved/i
    );
    expect(textarea).toBeInTheDocument();

    RATING_OFFER.forEach(({ value }) => {
      const radio = screen.getByTestId(`rating-${value}`);
      expect(radio).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should update rating and comment on user input', async () => {
    const user = userEvent.setup();
    renderComponent();

    const textarea = screen.getByPlaceholderText(
      /Tell how was your stay, what you like and what can be improved/i
    );
    const ratingRadio = screen.getByTestId('rating-5');

    await user.type(textarea, 'Great stay, very comfortable!');
    expect(textarea).toHaveValue('Great stay, very comfortable!');

    await user.click(ratingRadio);
    expect(ratingRadio).toBeChecked();
  });

  it('should enable submit button when rating >= 1 and comment length > MIN_COMMENT_LENGTH', async () => {
    const user = userEvent.setup();
    renderComponent();

    const textarea = screen.getByPlaceholderText(
      /Tell how was your stay, what you like and what can be improved/i
    );
    const ratingRadio = screen.getByTestId('rating-1');
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    expect(submitButton).toBeDisabled();

    await user.type(textarea, 'a'.repeat(REVIEW_OFFER.MIN_COMMENT_LENGTH + 1));

    expect(submitButton).toBeDisabled();

    await user.click(ratingRadio);

    expect(submitButton).toBeEnabled();
  });

  it('should use offerId from useParams', () => {
    renderComponent();

    expect(useParams).toHaveBeenCalled();
  });
});
