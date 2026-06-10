import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { OfferGallery } from '../components/offer/offer-gallery';
import { Offer } from '../components/offer/offer';
import { NearPlaces } from '../components/offer/offer-places';
import { Map } from '../components/map/map';
import { Message } from '../components/message/message';
import { getLocation } from '../utils';
import { useAppSelector } from '../hooks/hooks';
import { useAppDispatch } from '../hooks/hooks';
import { fetchOfferAction, fetchNearOffersAction } from '../store/api-actions';
import { SYSTEM_MESSAGE } from '../const';
import { getSelectedOfferLoadingStatus } from '../store/selectors/offer-slice';
import { getSelectedOffer } from '../store/selectors/offer-slice';
import { getNearOffers } from '../store/selectors/offers-slice';
import { getRandomNearsOffers } from '../utils';
import { OffersElementType } from '../types/offers';

function OfferPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const { offerId } = useParams<{ offerId: string }>();
  const selectedOffer = useAppSelector(getSelectedOffer);
  const nearOffers = useAppSelector(getNearOffers);
  const selectedOfferLoadingStatus = useAppSelector(getSelectedOfferLoadingStatus);
  const [currentOffer, setCurrentOffer] = useState<string>('');
  const [randomNearsOffers, setRandomNearsOffers] = useState<OffersElementType[]>([]);

  useEffect(() => {
    dispatch(fetchOfferAction(offerId));
    dispatch(fetchNearOffersAction(offerId));
  }, [dispatch, offerId]);

  useEffect(() => {
    setRandomNearsOffers(getRandomNearsOffers(nearOffers));
  }, [nearOffers]);

  const handleOfferHover = (idOffer: string) => {
    setCurrentOffer(idOffer);
  };

  return (
    <main className='page__main page__main--offer'>
      <section className='offer'>
        {!selectedOfferLoadingStatus &&
          <Message
            message={
              selectedOfferLoadingStatus === false ?
                SYSTEM_MESSAGE.ERROR_LOADING_OFFER : SYSTEM_MESSAGE.UPLOADING_OFFER
            }
          />}
        {selectedOffer && <OfferGallery offer={selectedOffer}/>}
        {selectedOffer && <Offer offer={selectedOffer}/>}
        {selectedOffer &&
        <Map
          className="offer__map"
          offers={randomNearsOffers}
          location={getLocation(selectedOffer)}
          currentOffer={currentOffer}
        />}
      </section>
      <div className='container'>
        {selectedOffer &&
        <NearPlaces
          offers={randomNearsOffers}
          onOfferHover={handleOfferHover}
        />}
      </div>
    </main>
  );

}

export { OfferPage };
