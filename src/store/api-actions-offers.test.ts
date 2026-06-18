import { fetchOffersAction, fetchNearOffersAction, fetchFavoriteOffersAction } from '../store/api-actions';
import { APIRoute } from '../const';
import { State } from '../types/state';
import { createAPI } from '../services/api';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { OFFERS } from './slices/offers-slice-mock';

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

  // Fetch offers success
  it('should fetch offers', async () => {
    // Создаем моковый экземпляр axios
    mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, OFFERS);
    // Выполняем экшен
    await store.dispatch(fetchOffersAction());
    // Получаем экшены
    const actions = store.getActions();
    // Вытаскиваем экшены
    const fetchOffersActionFulfilled = actions.at(1) as ReturnType<typeof fetchOffersAction.fulfilled>;
    // Проверяем экшены по типу
    expect(fetchOffersActionFulfilled.type).toBe(fetchOffersAction.fulfilled.type);
    // Проверяем экшены по payload
    expect(fetchOffersActionFulfilled.payload).toEqual(OFFERS);
    // Проверяем экшены по порядку
    expect(extractActionsTypes(actions)).toEqual([
      fetchOffersAction.pending.type,
      fetchOffersAction.fulfilled.type
    ]);
  });

  // Fetch offers fail
  it('should fetch offers fail', async () => {
    // Создаем моковый экземпляр axios
    mockAxiosAdapter.onGet(APIRoute.Offers).reply(400);
    // Выполняем экшен
    await store.dispatch(fetchOffersAction());
    // Получаем экшены
    const actions = store.getActions();
    // Вытаскиваем экшены
    const fetchOffersActionRejected = actions.at(1) as ReturnType<typeof fetchOffersAction.rejected>;
    // Проверяем экшены по типу
    expect(fetchOffersActionRejected.type).toBe(fetchOffersAction.rejected.type);
    // Проверяем экшены по порядку
    expect(extractActionsTypes(actions)).toEqual([
      fetchOffersAction.pending.type,
      fetchOffersAction.rejected.type
    ]);
  });

  // Fetch near offers success
  it('should fetch near offers', async () => {
    // Создаем моковый экземпляр axios
    mockAxiosAdapter.onGet(`${APIRoute.Offer}/id/nearby`).reply(200, OFFERS);
    // Выполняем экшен
    await store.dispatch(fetchNearOffersAction('id'));
    // Получаем экшены
    const actions = store.getActions();
    // Вытаскиваем экшены
    const fetchNearOffersActionFulfilled = actions.at(1) as ReturnType<typeof fetchNearOffersAction.fulfilled>;
    // Проверяем экшены по типу
    expect(fetchNearOffersActionFulfilled.type).toBe(fetchNearOffersAction.fulfilled.type);
    // Проверяем экшены по payload
    expect(fetchNearOffersActionFulfilled.payload).toEqual(OFFERS);
    // Проверяем экшены по порядку
    expect(extractActionsTypes(actions)).toEqual([
      fetchNearOffersAction.pending.type,
      fetchNearOffersAction.fulfilled.type
    ]);


  });

  // Fetch near offers fail
  it('should fetch near offers fail', async () => {
    // Создаем моковый экземпляр axios
    mockAxiosAdapter.onGet(`${APIRoute.Offer}/id/nearby`).reply(400);
    // Выполняем экшен
    await store.dispatch(fetchNearOffersAction('id'));
    // Получаем экшены
    const actions = store.getActions();
    // Вытаскиваем экшены
    const fetchNearOffersActionRejected = actions.at(1) as ReturnType<typeof fetchNearOffersAction.rejected>;
    // Проверяем экшены по типу
    expect(fetchNearOffersActionRejected.type).toBe(fetchNearOffersAction.rejected.type);
    // Проверяем экшены по порядку
    expect(extractActionsTypes(actions)).toEqual([
      fetchNearOffersAction.pending.type,
      fetchNearOffersAction.rejected.type
    ]);
  });

  // Fetch favorite offers success
  it('should fetch favorite offers', async () => {
    // Создаем моковый экземпляр axios
    mockAxiosAdapter.onGet(APIRoute.Favorite).reply(200, OFFERS);
    // Выполняем экшен
    await store.dispatch(fetchFavoriteOffersAction());
    // Получаем экшены
    const actions = store.getActions();
    // Вытаскиваем экшены
    const fetchFavoriteOffersActionFulfilled = actions.at(1) as ReturnType<typeof fetchFavoriteOffersAction.fulfilled>;
    // Проверяем экшены по типу
    expect(fetchFavoriteOffersActionFulfilled.type).toBe(fetchFavoriteOffersAction.fulfilled.type);
    // Проверяем экшены по payload
    expect(fetchFavoriteOffersActionFulfilled.payload).toEqual(OFFERS);
    // Проверяем экшены по порядку
    expect(extractActionsTypes(actions)).toEqual([
      fetchFavoriteOffersAction.pending.type,
      fetchFavoriteOffersAction.fulfilled.type
    ]);
  });

  // Fetch favorite offers fail
  it('should fetch favorite offers fail', async () => {
    // Создаем моковый экземпляр axios
    mockAxiosAdapter.onGet(APIRoute.Favorite).reply(400);
    // Выполняем экшен
    await store.dispatch(fetchFavoriteOffersAction());
    // Получаем экшены
    const actions = store.getActions();
    // Вытаскиваем экшены
    const fetchFavoriteOffersActionRejected = actions.at(1) as ReturnType<typeof fetchFavoriteOffersAction.rejected>;
    // Проверяем экшены по типу
    expect(fetchFavoriteOffersActionRejected.type).toBe(fetchFavoriteOffersAction.rejected.type);
    // Проверяем экшены по порядку
    expect(extractActionsTypes(actions)).toEqual([
      fetchFavoriteOffersAction.pending.type,
      fetchFavoriteOffersAction.rejected.type
    ]);
  });
});
