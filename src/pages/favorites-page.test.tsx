import { render, screen } from '@testing-library/react';
import { FavoritesPage } from './favorites-page';

// Мокаем компонент Favorites, чтобы не зависеть от его внутренней реализации
vi.mock('../components/favorites/favorites', () => ({
  Favorites: () => <div data-testid="mock-favorites">Mock Favorites</div>,
}));

describe('FavoritesPage', () => {
  it('рендерит обёртки page__main и page__favorites-container', () => {
    render(<FavoritesPage />);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('page__main');
    expect(mainElement).toHaveClass('page__main--favorites');
  });

  it('отображает компонент Favorites', () => {
    render(<FavoritesPage />);
    expect(screen.getByTestId('mock-favorites')).toBeInTheDocument();
  });
});
