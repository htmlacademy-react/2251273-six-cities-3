import { fetchOffersAction, fetchNearOffersAction, fetchFavoriteOffersAction } from '../store/api-actions';
import { APIRoute } from '../const';
import { State } from '../types/state';
import { createAPI } from '../services/api';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { OFFERS } from '../mocks/mock-offers';

type AppThunkDispatch = ThunkDispatch<State, ReturnType<typeof createAPI>, Action>;

const extractActionsTypes = (actions: Action<string>[]) => actions.map(({ type }) => type);

describe('Async actions: offers', () => {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator> = mockStoreCreator({
    OFFERS: {
      offers: [],
      offersLoadingStatus: null,
      nearOffers: [],
      nearOffersLoadingStatus: null,
      favoriteOffers: [],
      favoriteOffersLoadingStatus: null,
    },
  });

  beforeEach(() => {
    store = mockStoreCreator({
      OFFERS: {
        offers: [],
        offersLoadingStatus: null,
        nearOffers: [],
        nearOffersLoadingStatus: null,
        favoriteOffers: [],
        favoriteOffersLoadingStatus: null,
      },
    });
  });

  afterEach(() => {
    mockAxiosAdapter.reset();
    store.clearActions();
  });

  it('should fetch offers', async () => {
    mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, OFFERS);

    await store.dispatch(fetchOffersAction());

    const actions = store.getActions();

    const fetchOffersActionFulfilled = actions.at(1) as ReturnType<typeof fetchOffersAction.fulfilled>;

    expect(fetchOffersActionFulfilled.type).toBe(fetchOffersAction.fulfilled.type);

    expect(fetchOffersActionFulfilled.payload).toEqual(OFFERS);

    expect(extractActionsTypes(actions)).toEqual([
      fetchOffersAction.pending.type,
      fetchOffersAction.fulfilled.type
    ]);
  });


  it('should fetch offers fail', async () => {

    mockAxiosAdapter.onGet(APIRoute.Offers).reply(400);

    await store.dispatch(fetchOffersAction());

    const actions = store.getActions();

    const setErrorAction = actions[1];

    expect(actions[1].type).toBe('error/setErrorType');

    expect(extractActionsTypes(actions)).toEqual([
      fetchOffersAction.pending.type,
      setErrorAction.type,
      fetchOffersAction.rejected.type
    ]);

    expect(extractActionsTypes(actions)).not.toContain(fetchOffersAction.fulfilled.type);

    expect(setErrorAction.type).toBe('error/setErrorType');
  });

  it('should fetch near offers', async () => {

    mockAxiosAdapter.onGet(`${APIRoute.Offer}/id/nearby`).reply(200, OFFERS);

    await store.dispatch(fetchNearOffersAction('id'));

    const actions = store.getActions();

    const fetchNearOffersActionFulfilled = actions.at(1) as ReturnType<typeof fetchNearOffersAction.fulfilled>;

    expect(fetchNearOffersActionFulfilled.type).toBe(fetchNearOffersAction.fulfilled.type);

    expect(fetchNearOffersActionFulfilled.payload).toEqual(OFFERS);

    expect(extractActionsTypes(actions)).toEqual([
      fetchNearOffersAction.pending.type,
      fetchNearOffersAction.fulfilled.type
    ]);
  });

  it('should fetch near offers fail', async () => {

    mockAxiosAdapter.onGet(`${APIRoute.Offer}/id/nearby`).reply(400);

    await store.dispatch(fetchNearOffersAction('id'));

    const actions = store.getActions();

    const fetchNearOffersActionRejected = actions.at(1) as ReturnType<typeof fetchNearOffersAction.rejected>;

    expect(fetchNearOffersActionRejected.type).toBe(fetchNearOffersAction.rejected.type);

    expect(extractActionsTypes(actions)).toEqual([
      fetchNearOffersAction.pending.type,
      fetchNearOffersAction.rejected.type
    ]);
  });

  it('should fetch favorite offers', async () => {

    mockAxiosAdapter.onGet(APIRoute.Favorite).reply(200, OFFERS);

    await store.dispatch(fetchFavoriteOffersAction());

    const actions = store.getActions();

    const fetchFavoriteOffersActionFulfilled = actions.at(1) as ReturnType<typeof fetchFavoriteOffersAction.fulfilled>;

    expect(fetchFavoriteOffersActionFulfilled.type).toBe(fetchFavoriteOffersAction.fulfilled.type);

    expect(fetchFavoriteOffersActionFulfilled.payload).toEqual(OFFERS);

    expect(extractActionsTypes(actions)).toEqual([
      fetchFavoriteOffersAction.pending.type,
      fetchFavoriteOffersAction.fulfilled.type
    ]);
  });

  it('should fetch favorite offers fail', async () => {

    mockAxiosAdapter.onGet(APIRoute.Favorite).reply(400);

    await store.dispatch(fetchFavoriteOffersAction());

    const actions = store.getActions();

    const fetchFavoriteOffersActionRejected = actions.at(1) as ReturnType<typeof fetchFavoriteOffersAction.rejected>;

    expect(fetchFavoriteOffersActionRejected.type).toBe(fetchFavoriteOffersAction.rejected.type);

    expect(extractActionsTypes(actions)).toEqual([
      fetchFavoriteOffersAction.pending.type,
      fetchFavoriteOffersAction.rejected.type
    ]);
  });
});
