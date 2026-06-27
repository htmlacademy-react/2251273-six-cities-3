import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Message } from './message';
import { useAppSelector } from '../../hooks/hooks';
import { TYPE_OF_ERROR, SYSTEM_MESSAGE } from '../../const';

vi.mock('../../hooks/hooks', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../custom-loader/custom-loader', () => ({
  CustomLoader: () => <div data-testid="custom-loader">Loading...</div>,
}));

describe('Component: Message', () => {
  it('should render error message when errorType is ERROR_LOADING_OFFERS', () => {
    (useAppSelector as jest.Mock).mockReturnValue(TYPE_OF_ERROR.ERROR_LOADING_OFFERS);

    render(<Message />);

    const messageElement = screen.getByTestId('message');
    expect(messageElement).toBeInTheDocument();
    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOADING_OFFERS)).toBeInTheDocument();
    expect(screen.queryByTestId('custom-loader')).not.toBeInTheDocument();
  });

  it('should render error message when errorType is ERROR_LOADING_OFFER', () => {
    (useAppSelector as jest.Mock).mockReturnValue(TYPE_OF_ERROR.ERROR_LOADING_OFFER);

    render(<Message />);

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOADING_OFFER)).toBeInTheDocument();
    expect(screen.queryByTestId('custom-loader')).not.toBeInTheDocument();
  });

  it('should render error message when errorType is ERROR_LOADING_COMMENTS', () => {
    (useAppSelector as jest.Mock).mockReturnValue(TYPE_OF_ERROR.ERROR_LOADING_COMMENTS);

    render(<Message />);

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOADING_COMMENTS)).toBeInTheDocument();
    expect(screen.queryByTestId('custom-loader')).not.toBeInTheDocument();
  });

  it('should render error message when errorType is ERROR_LOADING_NEAR_OFFERS', () => {
    (useAppSelector as jest.Mock).mockReturnValue(TYPE_OF_ERROR.ERROR_LOADING_NEAR_OFFERS);

    render(<Message />);

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOADING_NEAR_OFFERS)).toBeInTheDocument();
    expect(screen.queryByTestId('custom-loader')).not.toBeInTheDocument();
  });

  it('should render error message when errorType is ERROR_LOGIN', () => {
    (useAppSelector as jest.Mock).mockReturnValue(TYPE_OF_ERROR.ERROR_LOGIN);

    render(<Message />);

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOGIN)).toBeInTheDocument();
    expect(screen.queryByTestId('custom-loader')).not.toBeInTheDocument();
  });

  it('should render error message when errorType is ERROR_LOGIN_PASSWORD', () => {
    (useAppSelector as jest.Mock).mockReturnValue(TYPE_OF_ERROR.ERROR_LOGIN_PASSWORD);

    render(<Message />);

    expect(screen.getByText(SYSTEM_MESSAGE.ERROR_LOGIN_PASSWORD)).toBeInTheDocument();
    expect(screen.queryByTestId('custom-loader')).not.toBeInTheDocument();
  });

  it('should render empty error message (no text) for unknown errorType', () => {
    (useAppSelector as jest.Mock).mockReturnValue('UNKNOWN_ERROR');

    render(<Message />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('message message--error');
    expect(heading).toHaveTextContent('');
    expect(screen.queryByTestId('custom-loader')).not.toBeInTheDocument();
  });

  it('should render CustomLoader when errorType is falsy (null, undefined, 0, etc.)', () => {
    (useAppSelector as jest.Mock).mockReturnValue(null); // или undefined, 0, false

    render(<Message />);

    expect(screen.getByTestId('custom-loader')).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('');
  });
});
