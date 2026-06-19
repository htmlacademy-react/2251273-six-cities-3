import { fetchOffersAction, fetchNearOffersAction, fetchFavoriteOffersAction } from './api-actions';
import { configureStore, Dispatch, AnyAction, Middleware } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createAPI } from '../services/api';
import { rootReducer } from './rootReducer';
import { APIRoute, NameSpace } from '../const';
import { OFFERS } from '../mocks/mock-offers';
import { OffersElementType } from '../types/offers';

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

  // fetchOffersAction success
  it('should dispatch fetchOffersAction success', async () => {
    const mockOffers = OFFERS;
    mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);
    // Выполняем действие
    await store.dispatch(fetchOffersAction());
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchOffersAction.fulfilled.type
    );
    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockOffers);

    expect(store.getState()[NameSpace.Offers].offers).toEqual(mockOffers);
    expect(store.getState()[NameSpace.Offers].offersLoadingStatus).toBe(true);
  });

  // fetchOffersAction success empty array
  it('should dispatch fetchOffersAction success empty array', async () => {
    const mockOffers: OffersElementType[] = [];
    mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);
    // Выполняем действие
    await store.dispatch(fetchOffersAction());
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchOffersAction.fulfilled.type
    );

    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockOffers);

    expect(store.getState()[NameSpace.Offers].offers).toEqual(mockOffers);
    expect(store.getState()[NameSpace.Offers].offersLoadingStatus).toBe(true);
  });

  // fetchOffersAction error
  it('should dispatch fetchOffersAction error', async () => {
    mockAxiosAdapter.onGet(APIRoute.Offers).reply(400);
    // Выполняем действие
    await store.dispatch(fetchOffersAction());
    // Проверяем результат
    const rejectedAction = actionHistory.find(
      (action) => action.type === fetchOffersAction.rejected.type
    );

    expect(rejectedAction).toBeDefined();

    expect(store.getState()[NameSpace.Offers].offers).toEqual([]);
    expect(store.getState()[NameSpace.Offers].offersLoadingStatus).toBe(false);
  });

  // fetchNearOffersAction success
  it('should dispatch fetchNearOffersAction success', async () => {
    const mockOffers = OFFERS;
    mockAxiosAdapter.onGet(`${APIRoute.Offer}/id/nearby`).reply(200, mockOffers);
    // Выполняем действие
    await store.dispatch(fetchNearOffersAction('id'));
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchNearOffersAction.fulfilled.type
    );

    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockOffers);

    expect(store.getState()[NameSpace.Offers].nearOffers).toEqual(mockOffers);
    expect(store.getState()[NameSpace.Offers].nearOffersLoadingStatus).toBe(true);
  });

  // fetchNearOffersAction success empty array
  it('should dispatch fetchNearOffersAction success empty array', async () => {
    const mockOffers: OffersElementType[] = [];
    mockAxiosAdapter.onGet(`${APIRoute.Offer}/id/nearby`).reply(200, mockOffers);
    // Выполняем действие
    await store.dispatch(fetchNearOffersAction('id'));
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchNearOffersAction.fulfilled.type
    );

    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockOffers);

    expect(store.getState()[NameSpace.Offers].nearOffers).toEqual(mockOffers);
    expect(store.getState()[NameSpace.Offers].nearOffersLoadingStatus).toBe(true);
  });

  // fetchNearOffersAction error
  it('should dispatch fetchNearOffersAction error', async () => {
    mockAxiosAdapter.onGet(`${APIRoute.Offer}/id/nearby`).reply(400);
    // Выполняем действие
    await store.dispatch(fetchNearOffersAction('id'));
    // Проверяем результат
    const rejectedAction = actionHistory.find(
      (action) => action.type === fetchNearOffersAction.rejected.type
    );

    expect(rejectedAction).toBeDefined();

    expect(store.getState()[NameSpace.Offers].nearOffers).toEqual([]);
    expect(store.getState()[NameSpace.Offers].nearOffersLoadingStatus).toBe(false);
  });

  // fetchFavoriteOffersAction success
  it('should dispatch fetchFavoriteOffersAction success', async () => {
    const mockOffers = OFFERS;
    mockAxiosAdapter.onGet(APIRoute.Favorite).reply(200, mockOffers);
    // Выполняем действие
    await store.dispatch(fetchFavoriteOffersAction());
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchFavoriteOffersAction.fulfilled.type
    );

    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockOffers);

    expect(store.getState()[NameSpace.Offers].favoriteOffers).toEqual(mockOffers);
    expect(store.getState()[NameSpace.Offers].favoriteOffersLoadingStatus).toBe(true);
  });

  // fetchFavoriteOffersAction success empty array
  it('should dispatch fetchFavoriteOffersAction success empty array', async () => {
    const mockOffers: OffersElementType[] = [];
    mockAxiosAdapter.onGet(APIRoute.Favorite).reply(200, mockOffers);
    // Выполняем действие
    await store.dispatch(fetchFavoriteOffersAction());
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchFavoriteOffersAction.fulfilled.type
    );

    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockOffers);

    expect(store.getState()[NameSpace.Offers].favoriteOffers).toEqual(mockOffers);
    expect(store.getState()[NameSpace.Offers].favoriteOffersLoadingStatus).toBe(true);
  });

  // fetchFavoriteOffersAction error
  it('should dispatch fetchFavoriteOffersAction error', async () => {
    mockAxiosAdapter.onGet(APIRoute.Favorite).reply(400);
    // Выполняем действие
    await store.dispatch(fetchFavoriteOffersAction());
    // Проверяем результат
    const rejectedAction = actionHistory.find(
      (action) => action.type === fetchFavoriteOffersAction.rejected.type
    );

    expect(rejectedAction).toBeDefined();

    expect(store.getState()[NameSpace.Offers].favoriteOffers).toEqual([]);
    expect(store.getState()[NameSpace.Offers].favoriteOffersLoadingStatus).toBe(false);
  });
});
