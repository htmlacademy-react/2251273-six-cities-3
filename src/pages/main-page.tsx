import { Locations } from '../components/locations/locations';
import { Cities } from '../components/cities/cities';
import { filterOffersByCity, getSortedOffersByType } from '../utils';
import { useAppSelector } from '../hooks/hooks';
import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/hooks';
import { fetchOffersAction } from '../store/api-actions';
import { clsx } from 'clsx';
import { getCheckedEmptyOffers } from '../store/selectors/offers-slice';

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOffersAction());
  }, [dispatch]);

  const city = useAppSelector((state) => state.CITY.SelectedCity);
  const offers = useAppSelector((state) => state.OFFERS.offers);
  const sortingOffers = useAppSelector((state) => state.SORTING.SelectedSorting);
  const filteredOffers = filterOffersByCity(offers, city);
  const checkedEmptyOffers = useAppSelector(getCheckedEmptyOffers);

  return (
    <main
      className={clsx('page__main', 'page__main--index', {'page__main--index-empty': checkedEmptyOffers})}
    >
      <h1 className="visually-hidden">Cities</h1>
      <div className="tabs">
        <Locations/>
      </div>
      <Cities
        offers={getSortedOffersByType(filteredOffers, sortingOffers)}
        city={city}
      />
    </main>
  );
}

export { MainPage };
