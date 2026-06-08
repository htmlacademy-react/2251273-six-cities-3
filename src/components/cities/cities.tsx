import { useEffect, useState } from 'react';
import { CitiesPlaces } from './cities-places';
import { Map } from '../map/map';
import { Message } from '../message/message';
import { getLocation } from '../../utils';
import { OffersElementType } from '../../types/offers';
import { useAppSelector } from '../../hooks/hooks';
import { SYSTEM_MESSAGE } from '../../const';
import { useCallback } from 'react';
import { MainEmpty } from '../main-empty/main-empty';
import { clsx } from 'clsx';
import { useAppDispatch } from '../../hooks/hooks';
import { setErrorType } from '../../store/action';
import { TYPE_OF_ERROR } from '../../const';

type CitiesProps = {
  offers: OffersElementType[];
  city: string;
}

function Cities({ offers, city }: CitiesProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [currentOffer, setCurrentOffer] = useState<string>('');
  const offersLoadingStatus = useAppSelector((state) => state.OFFERS.offersLoadingStatus);
  const handleOfferHover = useCallback((offerId: string) => {
    setCurrentOffer(offerId);
  }, []);

  useEffect(() => {
    dispatch(setErrorType(TYPE_OF_ERROR.EMPTY_OFFERS));
  }, [offers, dispatch]);

  return (
    <div className="cities">
      <div
        // TODO: Add empty state!!!
        className={clsx('cities__places-container container', {'cities__places-container--empty': !offers.length})}
      >
        {!offersLoadingStatus &&
          <Message
            message={
              offersLoadingStatus === false ? SYSTEM_MESSAGE.ERROR_LOADING_OFFERS : SYSTEM_MESSAGE.UPLOADING_OFFERS
            }
          />}
        { !offers.length && <MainEmpty />}
        {offersLoadingStatus &&
          <CitiesPlaces
            offers={offers}
            city={city}
            onOfferHover={handleOfferHover}
          />}
        <div className="cities__right-section">
          {offersLoadingStatus &&
          <Map
            className="cities__map"
            offers={offers}
            location={getLocation(offers[0])}
            currentOffer={currentOffer}
          />}
        </div>
      </div>
    </div>
  );
}

export { Cities };
