import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { offersSlice } from './slices/offers-slice';
import { citySlice } from './slices/city-slice';
import { sortingSlice } from './slices/sorting-slice';
import { userSlice } from './slices/user-slice';
import { offerSlice } from './slices/offer-slice';
import { errorSlice } from './slices/error-slice';

export const rootReducer = combineReducers({
  [NameSpace.Offers]: offersSlice.reducer,
  [NameSpace.City]: citySlice.reducer,
  [NameSpace.Sorting]: sortingSlice.reducer,
  [NameSpace.User]: userSlice.reducer,
  [NameSpace.Offer]: offerSlice.reducer,
  [NameSpace.Error]: errorSlice.reducer,
});
