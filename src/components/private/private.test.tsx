import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Private } from './private';
import { AuthorizationStatus } from '../../const';

// Мокаем хук
vi.mock('../../hooks/hooks', () => ({
  useAppSelector: vi.fn(),
}));

import { useAppSelector } from '../../hooks/hooks';

// Типизируем мок
const mockedUseAppSelector = vi.mocked(useAppSelector);

describe('Private', () => {
  it('redirects to login when not authorized', () => {
    mockedUseAppSelector.mockReturnValue(AuthorizationStatus.NoAuth);

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Private>
          <div>Secret content</div>
        </Private>
      </MemoryRouter>
    );

    expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
  });

  it('renders children when authorized', () => {
    mockedUseAppSelector.mockReturnValue(AuthorizationStatus.Auth);

    render(
      <MemoryRouter>
        <Private>
          <div>Secret content</div>
        </Private>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });
});
