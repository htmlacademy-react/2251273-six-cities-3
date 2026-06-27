import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Navigation } from './navigation';
import { AuthorizationStatus, AppRoute } from '../../const';
import * as hooks from '../../hooks/hooks';
import * as apiActions from '../../store/api-actions';
import * as userSelectors from '../../store/selectors/user-selector';
import * as offersSlice from '../../store/selectors/offers-slice';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../store/selectors/user-selector');
vi.mock('../../store/selectors/offers-slice');
vi.mock('../../store/api-actions');

describe('Navigation component', () => {
  const mockNavigate = vi.fn();
  const mockDispatch = vi.fn();
  const mockUseAppSelector = vi.spyOn(hooks, 'useAppSelector');
  const mockUseAppDispatch = vi.spyOn(hooks, 'useAppDispatch');

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockDispatch.mockReset();
  });

  const renderWithProviders = (authStatus: AuthorizationStatus) => {
    mockUseAppSelector.mockImplementation((selector) => {
      if (selector === userSelectors.getAuthorizationStatus) {
        return authStatus;
      }
      if (selector === userSelectors.getUserEmail) {
        return 'test@test.com';
      }
      if (selector === userSelectors.getUserAvatar) {
        return 'avatar.jpg';
      }
      if (selector === offersSlice.getFavoriteOffers) {
        return [{ id: 1 }, { id: 2 }];
      }
      return undefined;
    });

    const store = configureStore({ reducer: {} });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders correctly when user is authenticated', () => {
    renderWithProviders(AuthorizationStatus.Auth);
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
    expect(screen.getByAltText('User avatar')).toBeInTheDocument();
  });

  it('renders correctly when user is not authenticated', () => {
    renderWithProviders(AuthorizationStatus.NoAuth);
    expect(screen.queryByText('test@test.com')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.queryByAltText('User avatar')).toBeInTheDocument();
  });

  it('dispatches fetchFavoriteOffersAction when status is Auth on mount', () => {
    renderWithProviders(AuthorizationStatus.Auth);
    expect(mockDispatch).toHaveBeenCalledWith(apiActions.fetchFavoriteOffersAction());
  });

  it('does not dispatch fetchFavoriteOffersAction when status is NoAuth', () => {
    renderWithProviders(AuthorizationStatus.NoAuth);
    expect(mockDispatch).not.toHaveBeenCalledWith(apiActions.fetchFavoriteOffersAction());
  });

  it('navigates to main page after successful logout', async () => {
    const user = userEvent.setup();

    const successThunk = vi.fn(() => ({
      unwrap: vi.fn().mockResolvedValue(undefined),
    }));
    const mockedLogoutAction = vi.mocked(apiActions.logoutAction);
    mockedLogoutAction.mockReturnValue(successThunk as unknown as ReturnType<typeof apiActions.logoutAction>);

    mockDispatch.mockImplementation((action) => {
      if (typeof action === 'function') {
        return successThunk();
      }
      return {};
    });

    renderWithProviders(AuthorizationStatus.Auth);

    const signOutLink = screen.getByText('Sign out');
    await user.click(signOutLink);

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Main);
    });
  });

  it('navigates to login on sign in click when not authenticated', async () => {
    const user = userEvent.setup();
    renderWithProviders(AuthorizationStatus.NoAuth);
    const signInLink = screen.getByText('Sign in');
    await user.click(signInLink);
    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Login);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
