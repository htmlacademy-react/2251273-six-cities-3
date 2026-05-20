// Import Create Reducer
import { createReducer } from '@reduxjs/toolkit';
// Import Actions
import { changeCity, resetCity, clearOffers } from './action';
// Import Constants
import { DEFAULT_CITY } from '../const';
// Import Mocks
import { OFFERS } from '../mocks/offers-mocks';

const initialState = {
  city: DEFAULT_CITY,
  offers: OFFERS,
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(resetCity, (state) => {
      state.city = initialState.city;
    })
    .addCase(clearOffers, (state) => {
      state.offers = [];
    });
});

