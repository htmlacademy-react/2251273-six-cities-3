import { checkAuthAction, loginAction, logoutAction } from './api-actions';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { saveToken, dropToken, getToken } from '../services/token';
import { APIRoute, NameSpace, AuthorizationStatus } from '../const';
import { createTestStoreWithHistory } from './test-utils';
import { createAPI } from '../services/api';

describe('checkAuthAction', () => {
  const axiosInstance = createAPI();
  const mockAxiosAdapter = new MockAdapter(axiosInstance);
  let testStore: ReturnType<typeof createTestStoreWithHistory>;
  beforeEach(() => {
    testStore = createTestStoreWithHistory(axiosInstance);
  });

  afterEach(() => {
    mockAxiosAdapter.reset();
    dropToken();
  });

  // checkAuthAction success
  it('should dispatch checkAuthAction success', async () => {
    const { store, actionHistory } = testStore;
    // Сохраняем токен
    saveToken('test-token');
    // Мокаем запрос
    mockAxiosAdapter.onGet(APIRoute.Login).reply(200, {
      email: 'test-email',
      avatarUrl: 'test-avatar-url',
    });
    // Выполняем действие
    await store.dispatch(checkAuthAction());
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === checkAuthAction.fulfilled.type
    );
    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual({
      email: 'test-email',
      avatarUrl: 'test-avatar-url',
    });
    expect(store.getState()[NameSpace.User].authorizationStatus).toBe(AuthorizationStatus.Auth);
    expect(store.getState()[NameSpace.User].userEmail).toBe('test-email');
    expect(store.getState()[NameSpace.User].userAvatar).toBe('test-avatar-url');
  });

  // checkAuthAction failure
  it('should dispatch checkAuthAction failure', async () => {
    const { store, actionHistory } = testStore;
    // Сохраняем токен
    saveToken('test-token');
    // Мокаем запрос
    mockAxiosAdapter.onGet(APIRoute.Login).reply(401);
    // Выполняем действие
    await store.dispatch(checkAuthAction());
    // Проверяем результат
    const rejectedAction = actionHistory.find(
      (action) => action.type === checkAuthAction.rejected.type
    );
    expect(rejectedAction).toBeDefined();
    expect(store.getState()[NameSpace.User].authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(store.getState()[NameSpace.User].userEmail).toBe(null);
    expect(store.getState()[NameSpace.User].userAvatar).toBe(null);
  });

  // loginAction success
  it('should dispatch loginAction success', async () => {
    const { store, actionHistory } = testStore;
    saveToken('test-token');
    // Мокаем запросЫ
    mockAxiosAdapter.onPost(APIRoute.Login).reply(200, {
      token: 'test-token',
    });
    mockAxiosAdapter.onGet(APIRoute.Login).reply(200, {
      email: 'test-email',
      avatarUrl: 'test-avatar-url',
    });
    // Выполняем действие
    await store.dispatch(loginAction({ login: 'test-email', password: 'test-password' }));
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === checkAuthAction.fulfilled.type
    );
    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual({
      email: 'test-email',
      avatarUrl: 'test-avatar-url',
    });
    expect(getToken()).toBe('test-token');
    expect(store.getState()[NameSpace.User].authorizationStatus).toBe(AuthorizationStatus.Auth);
    expect(store.getState()[NameSpace.User].userEmail).toBe('test-email');
    expect(store.getState()[NameSpace.User].userAvatar).toBe('test-avatar-url');
  });

  // loginAction failure
  it('should dispatch loginAction failure', async () => {
    const { store } = testStore;
    saveToken('test-token');
    // Мокаем запрос
    mockAxiosAdapter.onPost(APIRoute.Login).reply(401);
    // Выполняем действие
    await store.dispatch(loginAction({ login: 'test-email', password: 'test-password' }));
    // Проверяем результат
    expect(store.getState()[NameSpace.User].authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(store.getState()[NameSpace.User].userEmail).toBe(null);
    expect(store.getState()[NameSpace.User].userAvatar).toBe(null);
  });

  // logoutAction success
  it('should dispatch logoutAction success', async () => {
    const { store, actionHistory } = testStore;
    saveToken('test-token');
    // Мокаем запросЫ
    mockAxiosAdapter.onPost(APIRoute.Login).reply(200, {
      token: 'test-token',
    });
    mockAxiosAdapter.onGet(APIRoute.Login).reply(200, {
      email: 'test-email',
      avatarUrl: 'test-avatar-url',
    });
    await store.dispatch(loginAction({ login: 'test-email', password: 'test-password' }));
    // Mокаем запрос
    mockAxiosAdapter.onDelete(APIRoute.Logout).reply(200);
    // Выполняем действие
    await store.dispatch(logoutAction());
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === logoutAction.fulfilled.type
    );
    expect(fulfilledAction).toBeDefined();
    expect(store.getState()[NameSpace.User].authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(store.getState()[NameSpace.User].userEmail).toBe(null);
    expect(store.getState()[NameSpace.User].userAvatar).toBe(null);
  });

  // logoutAction failure
  it('should dispatch logoutAction failure', async () => {
    const { store, actionHistory } = testStore;
    saveToken('test-token');
    // Мокаем запросЫ
    mockAxiosAdapter.onPost(APIRoute.Login).reply(200, {
      token: 'test-token',
    });
    mockAxiosAdapter.onGet(APIRoute.Login).reply(200, {
      email: 'test-email',
      avatarUrl: 'test-avatar-url',
    });
    await store.dispatch(loginAction({ login: 'test-email', password: 'test-password' }));
    // Mокаем запрос
    mockAxiosAdapter.onDelete(APIRoute.Logout).reply(401);
    // Выполняем действие
    await store.dispatch(logoutAction());
    // Проверяем результат
    const rejectedAction = actionHistory.find(
      (action) => action.type === logoutAction.rejected.type
    );
    expect(rejectedAction).toBeDefined();
    expect(store.getState()[NameSpace.User].authorizationStatus).toBe(AuthorizationStatus.Auth);
  });
});
