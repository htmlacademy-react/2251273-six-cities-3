import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './login-page';
import { configureStore } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../const';

// Мокаем хук useAppDispatch
vi.mock('../hooks/hooks', () => ({
  useAppDispatch: vi.fn().mockReturnValue(vi.fn()),
  useAppSelector: vi.fn(),
}));

describe('test', () => {
  const testReducer = configureStore({
    reducer: () => ({
      user: {
        authorizationStatus: AuthorizationStatus.Unknown,
        userEmail: null,
        userAvatar: null,
      },
    })
  });

  const store = testReducer;

  it('should be 3', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('page__main', 'page__main--login');

    const locationsElement = document.querySelector('.locations.locations--login.locations--current');
    expect(locationsElement).toBeInTheDocument();
    expect(locationsElement).toHaveClass('locations', 'locations--login', 'locations--current');
  });
});
