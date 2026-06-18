import { checkAuthAction } from './api-actions';
import { AuthorizationStatus, APIRoute } from '../const';
import { State } from '../types/state';
import { createAPI } from '../services/api';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { saveToken, dropToken, getToken } from '../services/token';

type AppThunkDispatch = ThunkDispatch<State, ReturnType<typeof createAPI>, Action>;

const extractActionsTypes = (actions: Action<string>[]) => actions.map(({ type }) => type);

describe('Async actions', () => {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({
      USER: {
        authorizationStatus: AuthorizationStatus.Unknown,
        userEmail: null,
        userAvatar: null,
      },
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
    dropToken();
  });

  describe('checkAuthAction', () => {
    it('should check auth', async () => {
      saveToken('token');

      mockAxiosAdapter.onGet(APIRoute.Login).reply(200, {
        email: 'oBtXg@example.com',
        avatarUrl: 'https://via.placeholder.com/150',
      });

      await store.dispatch(checkAuthAction());

      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.fulfilled.type,
      ]);

      expect(store.getState().USER.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(store.getState().USER.userEmail).toBe('oBtXg@example.com');
      expect(store.getState().USER.userAvatar).toBe('https://via.placeholder.com/150');
    });

    it('should not check auth', async () => {
      dropToken();

      await store.dispatch(checkAuthAction());

      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.rejected.type,
      ]);

      expect(store.getState().USER.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(store.getState().USER.userEmail).toBe(null);
      expect(store.getState().USER.userAvatar).toBe(null);
    });
  });
});
