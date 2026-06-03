import { FavoriteItem } from './favorite-item';
import { getFavoriteOffersCities } from '../../utils';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { fetchFavoriteOffersAction } from '../../store/api-actions';

function Favorites(): JSX.Element {
  const dispatch = useAppDispatch();
  const favoritesOffers = useAppSelector((state) => state.favoriteOffers);
  const favoriteOffersCities = getFavoriteOffersCities(favoritesOffers);
  const favoriteCities = Object.keys(favoriteOffersCities);

  useEffect(() => {
    dispatch(fetchFavoriteOffersAction());
  }, [dispatch]);

  return (
    <section className="favorites">
      <h1 className="favorites__title">Saved listing</h1>
      <ul className="favorites__list">
        {favoriteCities.map((city) => (
          <FavoriteItem
            key={city}
            city={city}
            favoriteOffers={favoriteOffersCities[city]}
          />
        ))}
      </ul>
    </section>
  );
}

export {Favorites};
