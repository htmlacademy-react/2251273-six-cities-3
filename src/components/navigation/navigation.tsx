import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';
import { countFavoritesOffers } from '../../utils';
import { OffersElementType } from '../../types/offers';
import { useAppSelector } from '../../hooks/hooks';
import { AuthorizationStatus } from '../../const';

// Create Types
type NavigationProps = {
  offers: OffersElementType[];
}

// Create Navigation
function Navigation({offers}: NavigationProps): JSX.Element {

  const statusAuthorization = useAppSelector((state) => state.AuthorizationStatus);
  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        <li className="header__nav-item user">
          <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Favorites}>
            <div className="header__avatar-wrapper user__avatar-wrapper">
            </div>
            { statusAuthorization === AuthorizationStatus.Auth &&
              <span className="header__user-name user__name">Oliver.conner@gmail.com</span>}
            {statusAuthorization === AuthorizationStatus.Auth &&
              <span className="header__favorite-count">{countFavoritesOffers(offers)}</span>}
          </Link>
        </li>
        <li className="header__nav-item">
          <Link className="header__nav-link" to={AppRoute.Favorites}>
            <span className="header__signout">{statusAuthorization === AuthorizationStatus.Auth ? 'Sign out' : 'Sign in'}</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

// Export Navigation
export {Navigation};
