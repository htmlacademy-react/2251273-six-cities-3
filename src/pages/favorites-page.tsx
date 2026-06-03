import { Favorites } from '../components/favorites/favorites';

function FavoritesPage(): JSX.Element {
  return (
    <main className="page__main page__main--favorites">
      <div className="page__favorites-container container">
        <Favorites />
      </div>
    </main>
  );
}

export { FavoritesPage };
