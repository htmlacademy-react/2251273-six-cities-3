import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Message } from './message';

import { getErrorType } from '../../store/selectors/error-slice';
import { TYPE_OF_ERROR, SYSTEM_MESSAGE } from '../../const';

const { mockUseAppSelector } = vi.hoisted(() => ({
  mockUseAppSelector: vi.fn(),
}));

vi.mock('../../hooks/hooks', () => ({
  useAppSelector: mockUseAppSelector,
}));

vi.mock('../../store/selectors/error-slice', () => ({
  getErrorType: vi.fn(),
}));

vi.mock('../custom-loader/custom-loader', () => ({
  CustomLoader: () => <div data-testid="custom-loader">Loader</div>,
}));

const setupSelector = (errorType: string | null = null) => {
  mockUseAppSelector.mockImplementation((selector) => {
    if (selector === getErrorType) {
      return errorType;
    }
    return undefined;
  });
};

const renderMessage = () => render(<Message />);

describe('Message', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render message container', () => {
    setupSelector();
    renderMessage();

    expect(screen.getByTestId('message')).toBeInTheDocument();
  });

  it('should render CustomLoader when no error', () => {
    setupSelector(null);
    renderMessage();

    expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
  });

  it('should not render CustomLoader when error exists', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_LOADING_OFFERS);
    renderMessage();

    expect(screen.queryByTestId('custom-loader')).not.toBeInTheDocument();
  });

  it('should display error message for ERROR_LOADING_OFFERS', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_LOADING_OFFERS);
    renderMessage();

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOADING_OFFERS)).toBeInTheDocument();
  });

  it('should display error message for ERROR_LOADING_OFFER', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_LOADING_OFFER);
    renderMessage();

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOADING_OFFER)).toBeInTheDocument();
  });

  it('should display error message for ERROR_LOADING_COMMENTS', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_LOADING_COMMENTS);
    renderMessage();

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOADING_COMMENTS)).toBeInTheDocument();
  });

  it('should display error message for ERROR_LOADING_NEAR_OFFERS', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_LOADING_NEAR_OFFERS);
    renderMessage();

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOADING_NEAR_OFFERS)).toBeInTheDocument();
  });

  it('should display error message for ERROR_LOGIN', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_LOGIN);
    renderMessage();

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOGIN)).toBeInTheDocument();
  });

  it('should display error message for ERROR_LOGIN_EMAIL', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_LOGIN_EMAIL);
    renderMessage();

    expect(screen.getByText(/Enter a valid email address/)).toBeInTheDocument();
  });

  it('should display error message for ERROR_LOGIN_PASSWORD', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_LOGIN_PASSWORD);
    renderMessage();

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOGIN_PASSWORD)).toBeInTheDocument();
  });

  it('should display error message for ERROR_ADD_COMMENT', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_ADD_COMMENT);
    renderMessage();

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_ADD_COMMENT)).toBeInTheDocument();
  });

  it('should display empty message for unknown error type', () => {
    setupSelector('UNKNOWN_ERROR');
    renderMessage();

    const messageElement = screen.getByRole('heading', { level: 2 });
    expect(messageElement).toHaveTextContent('');
  });

  it('should have correct class for error message', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_LOADING_OFFERS);
    renderMessage();

    const messageElement = screen.getByRole('heading', { level: 2 });
    expect(messageElement).toHaveClass('message--error');
  });
});
