import { NameSpace } from '../../const';
import { State } from '../../types/state';
import { OffersElementType } from '../../types/offers';

export const getOffers = (state: State): OffersElementType[] => state[NameSpace.Offers].offers;
export const getOffersLoadingStatus = (state: State): boolean | null => state[NameSpace.Offers].offersLoadingStatus;
export const getNearOffers = (state: State): OffersElementType[] => state[NameSpace.Offers].nearOffers;
export const getNearOffersLoadingStatus = (state: State): boolean | null => state[NameSpace.Offers].nearOffersLoadingStatus;
export const getFavoriteOffers = (state: State): OffersElementType[] => state[NameSpace.Offers].favoriteOffers;
export const getFavoriteOffersLoadingStatus = (state: State): boolean | null => state[NameSpace.Offers].favoriteOffersLoadingStatus;
