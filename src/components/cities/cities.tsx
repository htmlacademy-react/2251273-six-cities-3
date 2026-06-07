import { useState } from 'react';
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

type CitiesProps = {
  offers: OffersElementType[];
  city: string;
}

function Cities({ offers, city }: CitiesProps): JSX.Element {
  const [currentOffer, setCurrentOffer] = useState<string>('');
  const offersLoadingStatus = useAppSelector((state) => state.OFFERS.offersLoadingStatus);
  const checkedEmptyOffers = offers.length === 0;
  const handleOfferHover = useCallback((offerId: string) => {
    setCurrentOffer(offerId);
  }, []);

  return (
    <div className="cities">
      <div
        className={clsx('cities__places-container container', {'cities__places-container--empty': checkedEmptyOffers})}
      >
        {!offersLoadingStatus &&
          <Message
            message={
              offersLoadingStatus === false ? SYSTEM_MESSAGE.ERROR_LOADING_OFFERS : SYSTEM_MESSAGE.UPLOADING_OFFERS
            }
          />}
        {checkedEmptyOffers && <MainEmpty />}
        {offersLoadingStatus && !checkedEmptyOffers &&
          <CitiesPlaces
            offers={offers}
            city={city}
            onOfferHover={handleOfferHover}
          />}
        <div className="cities__right-section">
          {offersLoadingStatus && !checkedEmptyOffers &&
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
