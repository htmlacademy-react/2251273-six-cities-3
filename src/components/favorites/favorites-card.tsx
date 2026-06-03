import { Link } from 'react-router-dom';
import { CardPrice } from '../card/card-price';
import { CardMark } from '../card/card-mark';
import { CardRating } from '../card/card-rating';
import { CardName } from '../card/card-name';
import { CardType } from '../card/card-type';
import { AppRoute } from '../../const';
import { FavoriteType } from '../../types/favorite';

type FavoriteCardProps = {
  offer: FavoriteType;
};

function FavoriteCard({ offer }: FavoriteCardProps): JSX.Element {
  return (
    <article className="favorites__card place-card">
      {offer.isPremium && <CardMark />}
      <div className="favorites__image-wrapper place-card__image-wrapper">
        <Link to={`${AppRoute.Offer}/${offer.id}`}>
          <img className="place-card__image" src={offer.previewImage} width="150" height="110" alt="Place image" />
        </Link>
      </div>
      <div className="favorites__card-info place-card__info">
        <CardPrice offer={offer} />
        <CardRating cardRating={offer.rating} />
        <CardName cardName={offer.title} offerId={offer.id} />
        <CardType cardType={offer.type} />
      </div>
    </article>
  );

}

export {FavoriteCard};
