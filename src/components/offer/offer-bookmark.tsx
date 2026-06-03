import { useState } from 'react';
import { clsx } from 'clsx';
import { OfferType } from '../../types/offer';
import { postFavoriteOfferAction } from '../../store/api-actions';
import { useAppDispatch } from '../../hooks/hooks';

type OfferBookmarkProps = {
  offer: OfferType;
}

function OfferBookmark({ offer }: OfferBookmarkProps): JSX.Element {
  const [isFavoriteState, setIsFavoriteState] = useState(offer.isFavorite);
  const dispatch = useAppDispatch();

  function handleClick(): void {
    setIsFavoriteState(!isFavoriteState);
    dispatch(postFavoriteOfferAction({ id: offer.id, status: !isFavoriteState }));
  }

  return (
    <button className={
      clsx(
        'offer__bookmark-button button',
        { 'offer__bookmark-button--active': isFavoriteState })
    }
    type='button' onClick={handleClick}
    >
      <svg className='offer__bookmark-icon' width='31' height='33'>
        <use xlinkHref='#icon-bookmark'></use>
      </svg>
      <span className='visually-hidden'>To bookmarks</span>
    </button>
  );
}

export { OfferBookmark };
