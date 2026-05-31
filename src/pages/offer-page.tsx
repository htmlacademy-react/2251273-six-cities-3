import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { OfferGallery } from '../components/offer/offer-gallery';
import { Offer } from '../components/offer/offer';
import { NearPlaces } from '../components/offer/offer-places';
import { Map } from '../components/map/map';
import { getLocation } from '../utils';
import { useAppSelector } from '../hooks/hooks';
import { useAppDispatch } from '../hooks/hooks';
import { fetchOfferAction, fetchNearOffersAction } from '../store/api-actions';

// Create Types
type OfferPageProps = {
  children: JSX.Element;
}

function OfferPage({
  children,
}: OfferPageProps): JSX.Element {

  const dispatch = useAppDispatch();
  // TODO: Как оптимизировать offerId
  const { offerId } = useParams() as { offerId: string };
  const selectedOffer = useAppSelector((state) => state.selectedOffer);
  const nearOffers = useAppSelector((state) => state.nearOffers);
  const [currentOffer, setCurrentOffer] = useState<string>('');

  useEffect(() => {
    dispatch(fetchOfferAction(offerId));
    dispatch(fetchNearOffersAction(offerId));
  }, [dispatch, offerId]);

  const handleOfferHover = (idOffer: string) => {
    setCurrentOffer(idOffer);
  };

  if (!selectedOffer) {
    return children;
  }

  return (
    <main className='page__main page__main--offer'>
      <section className='offer'>
        <OfferGallery offer={selectedOffer} />
        <Offer offer={selectedOffer}/>
        <Map
          className="offer__map"
          offers={nearOffers}
          location={getLocation(selectedOffer)}
          currentOffer={currentOffer}
        />
      </section>
      <div className='container'>
        <NearPlaces
          offers={nearOffers}
          onOfferHover={handleOfferHover}
        />
      </div>
    </main>
  );

}

// Export OffersPage
export { OfferPage };
