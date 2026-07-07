import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { OffersSlice } from '../../types/slice/offers-slice';
import { fetchOffersAction, fetchNearOffersAction, fetchFavoriteOffersAction } from '../api-actions';
import { updateFavoriteOffers, updateOffers } from '../action';

const initialState: OffersSlice = {
  offers: [],
  offersLoadingStatus: null,
  nearOffers: [],
  nearOffersLoadingStatus: null,
  favoriteOffers: [],
  favoriteOffersLoadingStatus: null,
};

export const offersSlice = createSlice({
  name: NameSpace.Offers,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOffersAction.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.offersLoadingStatus = true;
      })
      .addCase(fetchNearOffersAction.fulfilled, (state, action) => {
        state.nearOffers = action.payload;
        state.nearOffersLoadingStatus = true;
      })
      .addCase(fetchFavoriteOffersAction.fulfilled, (state, action) => {
        state.favoriteOffers = action.payload;
        state.favoriteOffersLoadingStatus = true;
      })
      .addCase(fetchOffersAction.pending, (state) => {
        state.offersLoadingStatus = null;
      })
      .addCase(fetchNearOffersAction.pending, (state) => {
        state.nearOffersLoadingStatus = null;
      })
      .addCase(fetchFavoriteOffersAction.pending, (state) => {
        state.favoriteOffersLoadingStatus = null;
      })
      .addCase(fetchOffersAction.rejected, (state) => {
        state.offersLoadingStatus = false;
      })
      .addCase(fetchNearOffersAction.rejected, (state) => {
        state.nearOffersLoadingStatus = false;
      })
      .addCase(fetchFavoriteOffersAction.rejected, (state) => {
        state.favoriteOffersLoadingStatus = false;
      })
      .addCase(updateFavoriteOffers, (state, action) => {
        if (action.payload) {
          const offer = state.offers.find((item) => item.id === action.payload.id);
          if (offer) {
            offer.isFavorite = action.payload.isFavorite;
          }
        }
      })
      .addCase(updateOffers, (state, action) => {
        const updatedOffer = action.payload;

        const offerIndex = state.offers.findIndex((item) => item.id === updatedOffer.id);
        if (offerIndex !== -1) {
          state.offers[offerIndex] = updatedOffer;
        }

        const nearOfferIndex = state.nearOffers.findIndex((item) => item.id === updatedOffer.id);
        if (nearOfferIndex !== -1) {
          state.nearOffers[nearOfferIndex] = updatedOffer;
        }

        const favoriteOfferIndex = state.favoriteOffers.findIndex((item) => item.id === updatedOffer.id);
        if (favoriteOfferIndex !== -1) {
          state.favoriteOffers[favoriteOfferIndex] = updatedOffer;
        }
      });
  }
});
