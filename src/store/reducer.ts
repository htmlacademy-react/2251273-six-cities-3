import { createReducer } from '@reduxjs/toolkit';
import {
  changeCity, resetCity,
  loadOffers,
  setOffersLoadingStatus,
  loadNearOffers,
  loadFavoriteOffers,
  setFavoriteOffersLoadingStatus,
  changeSorting, resetSorting,
  requireAuthorization,
  loadSelectedOffer, setSelectedOfferLoadingStatus,
  loadCommentsOffer
} from './action';
import { DEFAULT_CITY, DEFAULT_SORTING, AuthorizationStatus } from '../const';
import { OffersElementType } from '../types/offers';
import { OfferType } from '../types/offer';
import { CommentElementType } from '../types/comments';

type InitialStateType = {
  city: string;
  offers: OffersElementType[];
  offersLoadingStatus: boolean | null;
  selectedOffer: OfferType | null;
  selectedOfferLoadingStatus: boolean | null;
  typeSorting: string;
  AuthorizationStatus: AuthorizationStatus;
  nearOffers: OffersElementType[];
  comments: CommentElementType[];
  favoriteOffers: OffersElementType[];
  favoriteOffersLoadingStatus: boolean | null;
};

const initialState: InitialStateType = {
  city: DEFAULT_CITY,
  offers: [],
  offersLoadingStatus: null,
  selectedOffer: null,
  selectedOfferLoadingStatus: null,
  typeSorting: DEFAULT_SORTING,
  AuthorizationStatus: AuthorizationStatus.Unknown,
  nearOffers: [],
  comments: [],
  favoriteOffers: [],
  favoriteOffersLoadingStatus: null
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(resetCity, (state) => {
      state.city = initialState.city;
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(setOffersLoadingStatus, (state, action) => {
      state.offersLoadingStatus = action.payload;
    })
    .addCase(loadNearOffers, (state, action) => {
      state.nearOffers = action.payload;
    })
    .addCase(changeSorting, (state, action) => {
      state.typeSorting = action.payload;
    })
    .addCase(resetSorting, (state) => {
      state.typeSorting = initialState.typeSorting;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.AuthorizationStatus = action.payload;
    })
    .addCase(loadSelectedOffer, (state, action) => {
      state.selectedOffer = action.payload;
    })
    .addCase(setSelectedOfferLoadingStatus, (state, action) => {
      state.selectedOfferLoadingStatus = action.payload;
    })
    .addCase(loadCommentsOffer, (state, action) => {
      state.comments = action.payload;
    })
    .addCase(loadFavoriteOffers, (state, action) => {
      state.favoriteOffers = action.payload;
    })
    .addCase(setFavoriteOffersLoadingStatus, (state, action) => {
      state.favoriteOffersLoadingStatus = action.payload;
    });
});

