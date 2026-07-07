import { createAction } from '@reduxjs/toolkit';
import { FavoriteType } from '../types/favorite';
import { ErrorType } from '../types/error';
import { OffersElementType } from '../types/offers';

export const changeCity = createAction<string>('city/changeCity');

export const changeSorting = createAction<string>('sorting/changeSorting');

export const setErrorType = createAction<ErrorType | null>('error/setErrorType');

export const updateFavoriteSelectedOffer = createAction<FavoriteType>('offers/updateOffer');

export const updateOffers = createAction<OffersElementType>('offers/updateOffers');

export const updateFavoriteOffers = createAction<FavoriteType>('offers/updateFavoriteOffers');

