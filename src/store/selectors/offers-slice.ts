import { NameSpace } from '../../const';
import { State } from '../../types/state';

export const getCheckedEmptyOffers = (state: State): boolean => Boolean(!state[NameSpace.Offers].offers.length);
export const getOffersLoadingStatus = (state: State): boolean | null => state[NameSpace.Offers].offersLoadingStatus;
