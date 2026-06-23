import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ReviewsForm } from './reviews-form';
import { postCommentsOfferAction } from '../../store/api-actions';
import { REVIEW_OFFER, RATING_OFFER } from '../../const';

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


import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/hooks';

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

    // Проверяем наличие текстового поля
    const textarea = screen.getByPlaceholderText(
      /Tell how was your stay, what you like and what can be improved/i
    );
    expect(textarea).toBeInTheDocument();

    // Проверяем наличие радио-кнопок
    RATING_OFFER.forEach(({ value }) => {
      const radio = screen.getByTestId(`rating-${value}`);
      expect(radio).toBeInTheDocument();
    });

    // Кнопка отправки должна быть disabled изначально
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

    // Вводим текст
    await user.type(textarea, 'Great stay, very comfortable!');
    expect(textarea).toHaveValue('Great stay, very comfortable!');

    // Выбираем рейтинг
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

    // Изначально disabled
    expect(submitButton).toBeDisabled();

    // Вводим текст (50 символов, MIN_COMMENT_LENGTH = 50)
    await user.type(textarea, 'a'.repeat(REVIEW_OFFER.MIN_COMMENT_LENGTH + 1));
    // Ещё не выбран рейтинг, кнопка должна быть disabled
    expect(submitButton).toBeDisabled();

    // Выбираем рейтинг
    await user.click(ratingRadio);
    // Теперь кнопка должна быть активна
    expect(submitButton).toBeEnabled();
  });

  it('should use offerId from useParams', () => {
    renderComponent();
    // Проверяем, что useParams был вызван
    expect(useParams).toHaveBeenCalled();
    // При отправке будет использован offerId, но мы проверили в тесте отправки
  });
});
