import { describe, it, expect } from 'vitest';
import { offersSlice } from './offers-slice';
import { fetchOffersAction, fetchNearOffersAction, fetchFavoriteOffersAction } from '../api-actions';
import { updateFavoriteOffers, updateOffers } from '../action';
import { OffersElementType } from '../../types/offers';
import { FavoriteType } from '../../types/favorite';

const reducer = offersSlice.reducer;

const mockOffer: OffersElementType = {
  id: 'offer-1',
  title: 'Test Offer',
  type: 'apartment',
  price: 100,
  city: { name: 'Paris', location: { latitude: 48.85, longitude: 2.35, zoom: 10 } },
  location: { latitude: 48.85, longitude: 2.35, zoom: 10 },
  isFavorite: false,
  isPremium: false,
  rating: 4,
  previewImage: 'preview.jpg',
};

const mockOffer2: OffersElementType = {
  ...mockOffer,
  id: 'offer-2',
  title: 'Test Offer 2',
  isFavorite: true,
};

const mockNearOffer: OffersElementType = {
  ...mockOffer,
  id: 'near-1',
  title: 'Near Offer',
};

const mockFavoriteOffer: OffersElementType = {
  ...mockOffer,
  id: 'fav-1',
  title: 'Favorite Offer',
  isFavorite: true,
};

describe('offersSlice', () => {
  describe('initial state', () => {
    it('should return initial state', () => {
      const state = reducer(undefined, { type: 'unknown' });

      expect(state).toEqual({
        offers: [],
        offersLoadingStatus: null,
        nearOffers: [],
        nearOffersLoadingStatus: null,
        favoriteOffers: [],
        favoriteOffersLoadingStatus: null,
      });
    });
  });

  describe('fetchOffersAction', () => {
    it('should set offers and loading status to true on fulfilled', () => {
      const initialState = reducer(undefined, { type: 'unknown' });
      const state = reducer(initialState, fetchOffersAction.fulfilled([mockOffer, mockOffer2], '', undefined));

      expect(state.offers).toEqual([mockOffer, mockOffer2]);
      expect(state.offersLoadingStatus).toBe(true);
    });

    it('should set loading status to null on pending', () => {
      const initialState = reducer(undefined, { type: 'unknown' });
      const state = reducer(initialState, fetchOffersAction.pending('', undefined));

      expect(state.offersLoadingStatus).toBeNull();
    });

    it('should set loading status to false on rejected', () => {
      const initialState = reducer(undefined, { type: 'unknown' });
      const state = reducer(initialState, fetchOffersAction.rejected(null, '', undefined));

      expect(state.offersLoadingStatus).toBe(false);
    });
  });

  describe('fetchNearOffersAction', () => {
    it('should set nearOffers and loading status to true on fulfilled', () => {
      const initialState = reducer(undefined, { type: 'unknown' });
      const state = reducer(initialState, fetchNearOffersAction.fulfilled([mockNearOffer], '', ''));

      expect(state.nearOffers).toEqual([mockNearOffer]);
      expect(state.nearOffersLoadingStatus).toBe(true);
    });

    it('should set loading status to null on pending', () => {
      const initialState = reducer(undefined, { type: 'unknown' });
      const state = reducer(initialState, fetchNearOffersAction.pending('', ''));

      expect(state.nearOffersLoadingStatus).toBeNull();
    });

    it('should set loading status to false on rejected', () => {
      const initialState = reducer(undefined, { type: 'unknown' });
      const state = reducer(initialState, fetchNearOffersAction.rejected(null, '', ''));

      expect(state.nearOffersLoadingStatus).toBe(false);
    });
  });

  describe('fetchFavoriteOffersAction', () => {
    it('should set favoriteOffers and loading status to true on fulfilled', () => {
      const initialState = reducer(undefined, { type: 'unknown' });
      const state = reducer(initialState, fetchFavoriteOffersAction.fulfilled([mockFavoriteOffer], '', undefined));

      expect(state.favoriteOffers).toEqual([mockFavoriteOffer]);
      expect(state.favoriteOffersLoadingStatus).toBe(true);
    });

    it('should set loading status to null on pending', () => {
      const initialState = reducer(undefined, { type: 'unknown' });
      const state = reducer(initialState, fetchFavoriteOffersAction.pending('', undefined));

      expect(state.favoriteOffersLoadingStatus).toBeNull();
    });

    it('should set loading status to false on rejected', () => {
      const initialState = reducer(undefined, { type: 'unknown' });
      const state = reducer(initialState, fetchFavoriteOffersAction.rejected(null, '', undefined));

      expect(state.favoriteOffersLoadingStatus).toBe(false);
    });
  });

  describe('updateFavoriteOffers', () => {
    it('should update isFavorite for offer in offers array', () => {
      const initialState = {
        offers: [mockOffer, mockOffer2],
        offersLoadingStatus: true,
        nearOffers: [],
        nearOffersLoadingStatus: null,
        favoriteOffers: [],
        favoriteOffersLoadingStatus: null,
      };

      const state = reducer(initialState, updateFavoriteOffers({ ...mockOffer, isFavorite: true }));

      expect(state.offers[0].isFavorite).toBe(true);
      expect(state.offers[1].isFavorite).toBe(true);
    });

    it('should not update offers if payload is falsy', () => {
      const initialState = {
        offers: [mockOffer],
        offersLoadingStatus: true,
        nearOffers: [],
        nearOffersLoadingStatus: null,
        favoriteOffers: [],
        favoriteOffersLoadingStatus: null,
      };

      const state = reducer(initialState, updateFavoriteOffers(null as unknown as OffersElementType));

      expect(state.offers).toEqual(initialState.offers);
    });

    it('should not update if offer not found', () => {
      const initialState = {
        offers: [mockOffer],
        offersLoadingStatus: true,
        nearOffers: [],
        nearOffersLoadingStatus: null,
        favoriteOffers: [],
        favoriteOffersLoadingStatus: null,
      };

      const state = reducer(initialState, updateFavoriteOffers({ ...mockOffer, id: 'non-existent', isFavorite: true }));

      expect(state.offers[0].isFavorite).toBe(false);
    });

    it('should not update offers if payload is falsy', () => {
      const initialState = {
        offers: [mockOffer],
        offersLoadingStatus: true,
        nearOffers: [],
        nearOffersLoadingStatus: null,
        favoriteOffers: [],
        favoriteOffersLoadingStatus: null,
      };

      const state = reducer(initialState, updateFavoriteOffers(null as unknown as FavoriteType));

      expect(state.offers).toEqual(initialState.offers);
    });

    it('should not update offers if payload is falsy', () => {
      const initialState = {
        offers: [mockOffer],
        offersLoadingStatus: true,
        nearOffers: [],
        nearOffersLoadingStatus: null,
        favoriteOffers: [],
        favoriteOffersLoadingStatus: null,
      };

      const state = reducer(
        initialState,
        updateFavoriteOffers(null as unknown as Parameters<typeof updateFavoriteOffers>[0])
      );

      expect(state.offers).toEqual(initialState.offers);
    });
  });

  describe('updateOffers', () => {
    it('should update offer in offers array', () => {
      const initialState = {
        offers: [mockOffer, mockOffer2],
        offersLoadingStatus: true,
        nearOffers: [],
        nearOffersLoadingStatus: null,
        favoriteOffers: [],
        favoriteOffersLoadingStatus: null,
      };

      const updatedOffer = { ...mockOffer, title: 'Updated Title' };
      const state = reducer(initialState, updateOffers(updatedOffer));

      expect(state.offers[0].title).toBe('Updated Title');
      expect(state.offers[1].title).toBe('Test Offer 2');
    });

    it('should update offer in nearOffers array', () => {
      const initialState = {
        offers: [],
        offersLoadingStatus: true,
        nearOffers: [mockNearOffer],
        nearOffersLoadingStatus: true,
        favoriteOffers: [],
        favoriteOffersLoadingStatus: null,
      };

      const updatedOffer = { ...mockNearOffer, title: 'Updated Near' };
      const state = reducer(initialState, updateOffers(updatedOffer));

      expect(state.nearOffers[0].title).toBe('Updated Near');
    });

    it('should update offer in favoriteOffers array', () => {
      const initialState = {
        offers: [],
        offersLoadingStatus: true,
        nearOffers: [],
        nearOffersLoadingStatus: null,
        favoriteOffers: [mockFavoriteOffer],
        favoriteOffersLoadingStatus: true,
      };

      const updatedOffer = { ...mockFavoriteOffer, title: 'Updated Favorite' };
      const state = reducer(initialState, updateOffers(updatedOffer));

      expect(state.favoriteOffers[0].title).toBe('Updated Favorite');
    });

    it('should update offer in all arrays if present', () => {
      const initialState = {
        offers: [mockOffer],
        offersLoadingStatus: true,
        nearOffers: [mockOffer],
        nearOffersLoadingStatus: true,
        favoriteOffers: [mockOffer],
        favoriteOffersLoadingStatus: true,
      };

      const updatedOffer = { ...mockOffer, title: 'Updated Everywhere' };
      const state = reducer(initialState, updateOffers(updatedOffer));

      expect(state.offers[0].title).toBe('Updated Everywhere');
      expect(state.nearOffers[0].title).toBe('Updated Everywhere');
      expect(state.favoriteOffers[0].title).toBe('Updated Everywhere');
    });

    it('should not modify arrays if offer not found', () => {
      const initialState = {
        offers: [mockOffer],
        offersLoadingStatus: true,
        nearOffers: [mockNearOffer],
        nearOffersLoadingStatus: true,
        favoriteOffers: [mockFavoriteOffer],
        favoriteOffersLoadingStatus: true,
      };

      const updatedOffer = { ...mockOffer, id: 'non-existent', title: 'Updated' };
      const state = reducer(initialState, updateOffers(updatedOffer));

      expect(state.offers[0].title).toBe('Test Offer');
      expect(state.nearOffers[0].title).toBe('Near Offer');
      expect(state.favoriteOffers[0].title).toBe('Favorite Offer');
    });
  });
});
