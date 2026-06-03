import { Link } from 'react-router-dom';
import { FavoriteCard } from './favorites-card';
import { AppRoute } from '../../const';
import { FavoriteType } from '../../types/favorite';

type FavoriteItemProps = {
  city: string;
  favoriteOffers: FavoriteType[];
};

function FavoriteItem({ city, favoriteOffers }: FavoriteItemProps): JSX.Element {
  return (
    <li className="favorites__locations-items">
      <div className="favorites__locations locations locations--current">
        <div className="locations__item">
          <Link className="locations__item-link" to={`${AppRoute.Main}?city=${city}`}>
            <span>{city}</span>
          </Link>
        </div>
      </div>
      <div className="favorites__places">
        {favoriteOffers.map((offer) => (
          <FavoriteCard key={offer.id} offer={offer} />
        ))}
      </div>
    </li>
  );
}

export { FavoriteItem };
