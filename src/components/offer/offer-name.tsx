// Import Components
import { OfferBookmark } from './offer-bookmark';
// Import Types
import { OfferType } from '../../types/offer';

// Create Types
type OfferNameProps = {
  offer: OfferType;
}

// Create OfferName
function OfferName({offer}: OfferNameProps): JSX.Element {
  return (
    <div className='offer__name-wrapper'>
      <h1 className='offer__name'>
        {offer.title}
      </h1>
      <OfferBookmark offer={offer} />
    </div>
  );
}

// Export OfferName
export {OfferName};
