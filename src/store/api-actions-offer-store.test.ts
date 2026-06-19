import { fetchOfferAction } from './api-actions';
import { configureStore, Dispatch, AnyAction, Middleware } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createAPI } from '../services/api';
import { rootReducer } from './rootReducer';
import { APIRoute, NameSpace } from '../const';
import { OFFER } from '../mocks/mock-offer';

describe('fetchOffersAction', () => {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  let store: ReturnType<typeof createTestStore>;
  const actionHistory: AnyAction[] = [];

  const actionCollector: Middleware = () => (next: Dispatch) => (action: AnyAction) => {
    actionHistory.push(action);
    return next(action);
  };

  const createTestStore = () =>
    configureStore({
      reducer: rootReducer,

      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: { extraArgument: axios },
        }).concat(actionCollector),
    });

  beforeEach(() => {
    actionHistory.length = 0;
    store = createTestStore();
  });

  afterEach(() => {
    mockAxiosAdapter.reset();
  });

  // fetchOfferAction success
  it('should dispatch fetchOfferAction success', async () => {
    const mockOffer = OFFER;
    mockAxiosAdapter.onGet(`${APIRoute.Offer}/${mockOffer.id}`).reply(200, mockOffer);
    // Выполняем действие
    await store.dispatch(fetchOfferAction(mockOffer.id));
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchOfferAction.fulfilled.type
    );
    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockOffer);

    expect(store.getState()[NameSpace.Offer].selectedOffer).toEqual(mockOffer);
    expect(store.getState()[NameSpace.Offer].selectedOfferLoadingStatus).toBe(true);
  });

  // fetchOfferAction error
  it('should dispatch fetchOfferAction error', async () => {
    mockAxiosAdapter.onGet(`${APIRoute.Offer}/${OFFER.id}`).reply(400);
    // Выполняем действие
    await store.dispatch(fetchOfferAction(OFFER.id));
    // Проверяем результат
    const rejectedAction = actionHistory.find(
      (action) => action.type === fetchOfferAction.rejected.type
    );
    expect(rejectedAction).toBeDefined();

    expect(store.getState()[NameSpace.Offer].selectedOffer).toEqual(null);
    expect(store.getState()[NameSpace.Offer].selectedOfferLoadingStatus).toBe(false);
  });
});
