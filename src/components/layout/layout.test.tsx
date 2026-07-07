import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from './layout';

import { getErrorType } from '../../store/selectors/error-slice';
import { AppRoute, TYPE_OF_ERROR } from '../../const';

const { mockUseAppSelector } = vi.hoisted(() => ({
  mockUseAppSelector: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

vi.mock('../../hooks/hooks', () => ({
  useAppSelector: mockUseAppSelector,
}));

vi.mock('../../store/selectors/error-slice', () => ({
  getErrorType: vi.fn(),
}));

vi.mock('../logo/logo', () => ({
  Logo: ({ logoState }: { logoState: boolean }) => (
    <div data-testid="logo">{logoState ? 'Logo Visible' : 'Logo Hidden'}</div>
  ),
}));

vi.mock('../navigation/navigation', () => ({
  Navigation: () => <div data-testid="navigation">Navigation</div>,
}));

vi.mock('../footer/footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <div data-testid="helmet">{children}</div>,
}));

import { useLocation } from 'react-router-dom';

const renderLayout = (pathname: string) => {
  vi.mocked(useLocation).mockReturnValue({
    pathname,
    search: '',
    hash: '',
    state: null,
    key: 'default',
  });

  return render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>
  );
};

const setupSelector = (errorType: string | null = null) => {
  mockUseAppSelector.mockImplementation((selector) => {
    if (selector === getErrorType) {
      return errorType;
    }
    return undefined;
  });
};

const getContainer = () => document.querySelector('.page') as HTMLElement;

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupSelector();
  });

  it('should render main page correctly', () => {
    renderLayout(AppRoute.Main);

    const container = getContainer();
    expect(container).toHaveClass('page--gray');
    expect(container).toHaveClass('page--main');
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toHaveTextContent('Logo Visible');
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('should render offer page correctly', () => {
    renderLayout(AppRoute.Offer);

    const container = getContainer();
    expect(container).toHaveClass('page');
    expect(container).not.toHaveClass('page--gray');
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toHaveTextContent('Logo Hidden');
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('should render login page correctly', () => {
    renderLayout(AppRoute.Login);

    const container = getContainer();
    expect(container).toHaveClass('page--gray');
    expect(container).toHaveClass('page--login');
    expect(screen.queryByTestId('navigation')).not.toBeInTheDocument();
    expect(screen.getByTestId('logo')).toHaveTextContent('Logo Hidden');
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('should render favorites page correctly', () => {
    renderLayout(AppRoute.Favorites);

    const container = getContainer();
    expect(container).toHaveClass('page');
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toHaveTextContent('Logo Hidden');
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render default page for unknown route', () => {
    renderLayout('/unknown');

    const container = getContainer();
    expect(container).toHaveClass('page');
    expect(screen.queryByTestId('navigation')).not.toBeInTheDocument();
    expect(screen.getByTestId('logo')).toHaveTextContent('Logo Hidden');
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('should add favorites-empty class when error is ERROR_EMPTY_OFFERS', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_EMPTY_OFFERS);
    renderLayout(AppRoute.Favorites);

    const container = getContainer();
    expect(container).toHaveClass('page--favorites-empty');
  });

  it('should not add favorites-empty class when error is not ERROR_EMPTY_OFFERS', () => {
    setupSelector(TYPE_OF_ERROR.ERROR_LOADING_OFFER);
    renderLayout(AppRoute.Favorites);

    const container = getContainer();
    expect(container).not.toHaveClass('page--favorites-empty');
  });

  it('should set correct title for main page', () => {
    renderLayout(AppRoute.Main);

    expect(screen.getByTestId('helmet')).toHaveTextContent('6 cities - Main');
  });

  it('should set correct title for offer page', () => {
    renderLayout(AppRoute.Offer);

    expect(screen.getByTestId('helmet')).toHaveTextContent('6 cities - Offer');
  });

  it('should set correct title for login page', () => {
    renderLayout(AppRoute.Login);

    expect(screen.getByTestId('helmet')).toHaveTextContent('6 cities - Sign in');
  });

  it('should set correct title for favorites page', () => {
    renderLayout(AppRoute.Favorites);

    expect(screen.getByTestId('helmet')).toHaveTextContent('6 cities - Favorites');
  });
});
