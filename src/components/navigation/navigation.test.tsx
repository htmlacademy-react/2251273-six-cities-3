import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Navigation } from './navigation';

import { logoutAction, fetchFavoriteOffersAction, checkAuthAction, fetchOffersAction } from '../../store/api-actions';
import { getUserEmail, getUserAvatar, getAuthorizationStatus } from '../../store/selectors/user-selector';
import { getFavoriteOffers } from '../../store/selectors/offers-slice';
import { AppRoute, AuthorizationStatus } from '../../const';

const { mockDispatch, mockNavigate, mockUseAppSelector } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  mockNavigate: vi.fn(),
  mockUseAppSelector: vi.fn(),
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
  logoutAction: vi.fn(),
  fetchFavoriteOffersAction: vi.fn(),
  checkAuthAction: vi.fn(),
  fetchOffersAction: vi.fn(),
}));

vi.mock('../../store/selectors/user-selector', () => ({
  getUserEmail: vi.fn(),
  getUserAvatar: vi.fn(),
  getAuthorizationStatus: vi.fn(),
}));

vi.mock('../../store/selectors/offers-slice', () => ({
  getFavoriteOffers: vi.fn(),
}));

const setupSelectors = (overrides = {}) => {
  const defaults = {
    authorizationStatus: AuthorizationStatus.Auth,
    userEmail: 'test@example.com',
    userAvatar: 'https://example.com/avatar.jpg',
    favoriteOffers: [{ id: '1' }, { id: '2' }],
  };
  const config = { ...defaults, ...overrides };

  mockUseAppSelector.mockImplementation((selector: unknown) => {
    if (selector === getAuthorizationStatus) {
      return config.authorizationStatus;
    }
    if (selector === getUserEmail) {
      return config.userEmail;
    }
    if (selector === getUserAvatar) {
      return config.userAvatar;
    }
    if (selector === getFavoriteOffers) {
      return config.favoriteOffers;
    }
    return undefined;
  });
};

const renderNavigation = () => render(
  <MemoryRouter>
    <Navigation />
  </MemoryRouter>
);

describe('Navigation', () => {
  let unhandledRejectionHandler: (event: PromiseRejectionEvent) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockImplementation(() => ({ unwrap: () => Promise.resolve() }));

    vi.mocked(logoutAction).mockImplementation(() => ({
      unwrap: () => Promise.resolve(),
    }) as unknown as ReturnType<typeof logoutAction>);

    vi.mocked(fetchFavoriteOffersAction).mockImplementation(() => ({
      type: 'mock',
    }) as unknown as ReturnType<typeof fetchFavoriteOffersAction>);

    vi.mocked(checkAuthAction).mockImplementation(() => ({
      type: 'mock',
    }) as unknown as ReturnType<typeof checkAuthAction>);

    vi.mocked(fetchOffersAction).mockImplementation(() => ({
      type: 'mock',
    }) as unknown as ReturnType<typeof fetchOffersAction>);

    unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      event.preventDefault();
    };
    window.addEventListener('unhandledrejection', unhandledRejectionHandler);
  });

  afterEach(() => {
    window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
  });

  it('should render navigation component', () => {
    setupSelectors();
    renderNavigation();

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render user email when authenticated', () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.Auth });
    renderNavigation();

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should not render user email when not authenticated', () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.NoAuth });
    renderNavigation();

    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });

  it('should render favorite count when authenticated', () => {
    setupSelectors({
      authorizationStatus: AuthorizationStatus.Auth,
      favoriteOffers: [{ id: '1' }, { id: '2' }, { id: '3' }],
    });
    renderNavigation();

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should not render favorite count when not authenticated', () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.NoAuth });
    renderNavigation();

    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('should render user avatar when authenticated', () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.Auth });
    renderNavigation();

    const avatar = screen.getByAltText('User avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should show "Sign out" when authenticated', () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.Auth });
    renderNavigation();

    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('should show "Sign in" when not authenticated', () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.NoAuth });
    renderNavigation();

    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should dispatch fetchFavoriteOffersAction when authenticated', () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.Auth });
    renderNavigation();

    expect(fetchFavoriteOffersAction).toHaveBeenCalled();
  });

  it('should not dispatch fetchFavoriteOffersAction when not authenticated', () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.NoAuth });
    renderNavigation();

    expect(fetchFavoriteOffersAction).not.toHaveBeenCalled();
  });

  it('should dispatch logoutAction when clicking Sign out', async () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.Auth });
    renderNavigation();

    const signOutLink = screen.getByText('Sign out');
    fireEvent.click(signOutLink);

    await waitFor(() => {
      expect(logoutAction).toHaveBeenCalled();
    });
  });

  it('should navigate to Main after successful logout', async () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.Auth });
    renderNavigation();

    const signOutLink = screen.getByText('Sign out');

    await act(async () => {
      fireEvent.click(signOutLink);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Main);
    });
  });

  it('should dispatch fetchOffersAction after successful logout', async () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.Auth });
    renderNavigation();

    const signOutLink = screen.getByText('Sign out');

    await act(async () => {
      fireEvent.click(signOutLink);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(fetchOffersAction).toHaveBeenCalled();
    });
  });

  it('should navigate to Login when clicking Sign in', () => {
    setupSelectors({ authorizationStatus: AuthorizationStatus.NoAuth });
    renderNavigation();

    const signInLink = screen.getByText('Sign in');
    fireEvent.click(signInLink);

    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Login);
  });

  it('should render link to Favorites', () => {
    setupSelectors();
    renderNavigation();

    const favoritesLink = screen.getByRole('link', { name: /test@example.com/i });
    expect(favoritesLink).toHaveAttribute('href', AppRoute.Favorites);
  });

  it('should render link to Login', () => {
    setupSelectors();
    renderNavigation();

    const loginLink = screen.getByRole('link', { name: /Sign/i });
    expect(loginLink).toHaveAttribute('href', AppRoute.Login);
  });

  it('should render correct number of list items', () => {
    setupSelectors();
    renderNavigation();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });

  it('should not render avatar when userAvatar is null', () => {
    setupSelectors({ userAvatar: null });
    renderNavigation();

    expect(screen.queryByAltText('User avatar')).not.toBeInTheDocument();
  });
});
