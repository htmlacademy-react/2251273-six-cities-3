import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from './login-form';

const {
  mockDispatch,
  mockNavigate,
  mockUseAppSelector,
  mockLoginAction,
  mockSwitchButton
} = vi.hoisted(() => ({
  mockDispatch: vi.fn(() => ({ unwrap: vi.fn(() => Promise.resolve()) })),
  mockNavigate: vi.fn(),
  mockUseAppSelector: vi.fn(),
  mockLoginAction: vi.fn(),
  mockSwitchButton: vi.fn(),
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
  loginAction: mockLoginAction,
}));

vi.mock('../../store/action', () => ({
  setErrorType: vi.fn((error: string | null) => ({
    type: 'error/setErrorType',
    payload: error
  })),
}));

vi.mock('../../utils', () => ({
  switchButton: mockSwitchButton,
}));

vi.mock('../../const', () => ({
  AppRoute: { Main: '/', Login: '/login' },
  TYPE_OF_ERROR: {
    ERROR_LOGIN: 'ERROR_LOGIN',
    ERROR_LOGIN_EMAIL: 'ERROR_LOGIN_EMAIL',
    ERROR_LOGIN_PASSWORD: 'ERROR_LOGIN_PASSWORD',
  },
  EMAIL_REGEXP: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD_REGEXP: /^(?=.*[A-Za-z])(?=.*\d).+$/,
}));

vi.mock('../../store/selectors/error-slice', () => ({
  getErrorType: 'error/getErrorType',
}));

vi.mock('../message/message', () => ({
  Message: () => <div data-testid="message">Error Message</div>,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppSelector.mockReturnValue(null);
    mockDispatch.mockReturnValue({ unwrap: vi.fn(() => Promise.resolve()) });
  });

  describe('Рендеринг', () => {
    it('должен корректно рендериться', () => {
      const { container } = render(<LoginForm />);
      expect(container).toBeInTheDocument();
    });

    it('должен отображать форму с правильными классами', () => {
      const { container } = render(<LoginForm />);
      const form = container.querySelector('.login__form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveClass('form');
    });

    it('должен отображать поле email', () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(emailInput).toHaveClass('login__input');
      expect(emailInput).toHaveClass('form__input');
    });

    it('должен отображать поле password', () => {
      render(<LoginForm />);
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('name', 'password');
      expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');
    });

    it('должен отображать кнопку Sign in', () => {
      render(<LoginForm />);
      const submitButton = screen.getByRole('button', { name: /Sign in/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveClass('login__submit');
      expect(submitButton).toHaveClass('form__submit');
      expect(submitButton).toHaveClass('button');
    });

    it('должен отображать компонент Message при наличии errorType', () => {
      mockUseAppSelector.mockReturnValue('ERROR_LOGIN');
      render(<LoginForm />);
      expect(screen.getByTestId('message')).toBeInTheDocument();
    });

    it('не должен отображать компонент Message при отсутствии errorType', () => {
      mockUseAppSelector.mockReturnValue(null);
      render(<LoginForm />);
      expect(screen.queryByTestId('message')).not.toBeInTheDocument();
    });
  });

  describe('Валидация формы', () => {
    it('должен блокировать кнопку при невалидном email', () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button');

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, { target: { value: 'password1' } });

      expect(submitButton).toHaveAttribute('disabled');
    });

    it('должен блокировать кнопку при невалидном пароле', () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });

      expect(submitButton).toHaveAttribute('disabled');
    });

    it('должен разблокировать кнопку при валидных данных', () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password1' } });

      expect(submitButton).not.toHaveAttribute('disabled');
    });

    it('должен диспатчить setErrorType с ERROR_LOGIN_EMAIL при невалидном email', () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'error/setErrorType',
        payload: 'ERROR_LOGIN_EMAIL',
      });
    });

    it('должен диспатчить setErrorType с null при валидном email', () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'error/setErrorType',
        payload: null,
      });
    });

    it('должен диспатчить setErrorType с ERROR_LOGIN_PASSWORD при невалидном пароле', () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      fireEvent.change(passwordInput, { target: { value: 'password' } });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'error/setErrorType',
        payload: 'ERROR_LOGIN_PASSWORD',
      });
    });

    it('должен диспатчить setErrorType с null при валидном пароле', () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password1' } });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'error/setErrorType',
        payload: null,
      });
    });
  });

  describe('Отправка формы', () => {
    it('должен диспатчить loginAction при успешной отправке', async () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password1' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginAction).toHaveBeenCalledWith({
          login: 'test@example.com',
          password: 'password1',
        });
      });
    });

    it('должен вызывать switchButton с true при начале отправки', async () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password1' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSwitchButton).toHaveBeenCalledWith(expect.anything(), true);
      });
    });

    it('должен вызывать switchButton с false после завершения отправки', async () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password1' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSwitchButton).toHaveBeenCalledWith(expect.anything(), false);
      });
    });

    it('должен навигировать на главную страницу при успешной отправке', async () => {
      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password1' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('не должен отправлять форму при пустых полях', () => {
      render(<LoginForm />);
      const submitButton = screen.getByRole('button');

      fireEvent.click(submitButton);

      expect(mockLoginAction).not.toHaveBeenCalled();
    });

    it('должен обрабатывать ошибку при отправке', async () => {
      mockDispatch.mockReturnValue({
        unwrap: vi.fn(() => Promise.reject(new Error('API Error'))),
      });

      render(<LoginForm />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password1' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLoginAction).toHaveBeenCalled();
      });

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'error/setErrorType',
        payload: 'ERROR_LOGIN',
      });

      expect(mockNavigate).toHaveBeenCalledWith('/login');

      expect(mockSwitchButton).toHaveBeenCalledWith(expect.anything(), false);
    });
  });

  describe('Структура DOM', () => {
    it('должен иметь правильную структуру формы', () => {
      const { container } = render(<LoginForm />);

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute('action', '#');
      expect(form).toHaveAttribute('method', 'post');
      expect(form).toHaveAttribute('autocomplete', 'off');
    });

    it('должен иметь label с visually-hidden классом для email', () => {
      const { container } = render(<LoginForm />);

      const labels = container.querySelectorAll('label');
      const emailLabel = Array.from(labels).find((label) => label.textContent === 'E-mail');
      expect(emailLabel).toBeInTheDocument();
      expect(emailLabel).toHaveClass('visually-hidden');
    });

    it('должен иметь label с visually-hidden классом для password', () => {
      const { container } = render(<LoginForm />);

      const labels = container.querySelectorAll('label');
      const passwordLabel = Array.from(labels).find((label) => label.textContent === 'Password');
      expect(passwordLabel).toBeInTheDocument();
      expect(passwordLabel).toHaveClass('visually-hidden');
    });

    it('должен иметь правильные wrapper классы', () => {
      const { container } = render(<LoginForm />);

      const wrappers = container.querySelectorAll('.login__input-wrapper');
      expect(wrappers).toHaveLength(2);

      wrappers.forEach((wrapper) => {
        expect(wrapper).toHaveClass('form__input-wrapper');
      });
    });
  });
});
