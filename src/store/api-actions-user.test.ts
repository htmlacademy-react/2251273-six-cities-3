import { checkAuthAction, loginAction, logoutAction } from './api-actions';
import { APIRoute } from '../const';
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

describe('Async actions: user', () => {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator();
  });

  afterEach(() => {
    mockAxiosAdapter.reset();
    dropToken();
  });

  describe('checkAuthAction', () => {

    it('should check auth if token', async () => {

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

      expect(getToken()).toBe('token');
    });

    it('should check auth if no token', async () => {

      dropToken();

      mockAxiosAdapter.onGet(APIRoute.Login).reply(401);

      await store.dispatch(checkAuthAction());

      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.rejected.type,
      ]);

      expect(getToken()).toBe('');
    });


    it('should login user', async () => {

      mockAxiosAdapter.onPost(APIRoute.Login).reply(200, { token: 'token' });
      mockAxiosAdapter.onGet(APIRoute.Login).reply(200, {
        email: 'oBtXg@example.com',
        avatarUrl: 'https://via.placeholder.com/150',
      });

      await store.dispatch(loginAction({
        login: 'oBtXg@example.com',
        password: '123456',
      }));

      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        loginAction.pending.type,
        checkAuthAction.pending.type,
        checkAuthAction.fulfilled.type,
        loginAction.fulfilled.type,
      ]);
    });

    it('should login fail', async () => {

      mockAxiosAdapter.onPost(APIRoute.Login).reply(401);

      await store.dispatch(loginAction({
        login: 'oBtXg@example.com',
        password: '123456',
      }));

      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        loginAction.pending.type,
        loginAction.rejected.type,
      ]);
    });

    it('should logout user', async () => {

      saveToken('token');

      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);

      await store.dispatch(logoutAction());

      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        logoutAction.pending.type,
        logoutAction.fulfilled.type,
      ]);

      dropToken();

      expect(getToken()).toBe('');
    });

    it('should logout fail', async () => {

      saveToken('token');

      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(401);

      await store.dispatch(logoutAction());

      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        logoutAction.pending.type,
        logoutAction.rejected.type,
      ]);
    });

  });
});

