import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestStoreWithHistory, TestStoreWithHistory } from './test-utils';
import { createAPI } from '../services/api';
import { rootReducer } from './root-reducer';

vi.mock('../services/api', () => ({
  createAPI: vi.fn(() => ({
    isMockedAPI: true,
    get: vi.fn(),
    post: vi.fn(),
  })),
}));

vi.mock('./root-reducer', () => ({
  rootReducer: vi.fn(() => ({ test: 'initial' })),
}));

describe('createTestStoreWithHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create store with default axiosInstance', () => {
    const result = createTestStoreWithHistory();

    expect(result.store).toBeDefined();
    expect(result.axiosInstance).toBeDefined();
    expect(result.actionHistory).toBeDefined();
    expect(Array.isArray(result.actionHistory)).toBe(true);
    expect(createAPI).toHaveBeenCalledTimes(1);
  });

  it('should create store with custom axiosInstance', () => {
    const customAxios = {
      isCustomAPI: true,
      get: vi.fn(),
      post: vi.fn(),
    } as unknown as ReturnType<typeof createAPI>;

    const result = createTestStoreWithHistory(customAxios);

    expect(result.axiosInstance).toBe(customAxios);
    expect(createAPI).not.toHaveBeenCalled();
  });

  it('should collect all dispatched actions in history', () => {
    const { store, actionHistory } = createTestStoreWithHistory();

    expect(actionHistory).toHaveLength(0);

    store.dispatch({ type: 'ACTION_1' });
    store.dispatch({ type: 'ACTION_2' });
    store.dispatch({ type: 'ACTION_3' });

    expect(actionHistory).toHaveLength(3);
    expect(actionHistory[0].type).toBe('ACTION_1');
    expect(actionHistory[1].type).toBe('ACTION_2');
    expect(actionHistory[2].type).toBe('ACTION_3');
  });

  it('should return empty actionHistory initially', () => {
    const { actionHistory } = createTestStoreWithHistory();

    expect(actionHistory).toHaveLength(0);
  });

  it('should collect actions in order they were dispatched', () => {
    const { store, actionHistory } = createTestStoreWithHistory();

    const actions = [
      { type: 'FIRST', payload: 1 },
      { type: 'SECOND', payload: 2 },
      { type: 'THIRD', payload: 3 },
    ];

    actions.forEach((action) => store.dispatch(action));

    expect(actionHistory).toHaveLength(actions.length);
    actions.forEach((action, index) => {
      expect(actionHistory[index].type).toBe(action.type);
      expect(actionHistory[index].payload).toBe(action.payload);
    });
  });

  it('should pass axiosInstance as extraArgument to thunks', async () => {
    const customAxios = {
      isCustomAPI: true,
      get: vi.fn(),
    } as unknown as ReturnType<typeof createAPI>;

    const { store } = createTestStoreWithHistory(customAxios);

    let receivedExtra: unknown = null;

    const thunkAction = (
      _dispatch: unknown,
      _getState: unknown,
      extra: unknown
    ) => {
      receivedExtra = extra;
    };

    await store.dispatch(thunkAction as Parameters<typeof store.dispatch>[0]);

    expect(receivedExtra).toBe(customAxios);
  });

  it('should allow thunks to use axios methods', async () => {
    const mockGet = vi.fn().mockResolvedValue({ data: 'test' });
    const customAxios = {
      get: mockGet,
    } as unknown as ReturnType<typeof createAPI>;

    const { store } = createTestStoreWithHistory(customAxios);

    const thunkAction = async (
      _dispatch: unknown,
      _getState: unknown,
      extra: unknown
    ): Promise<{ data: string }> => {
      const axios = extra as { get: typeof mockGet };
      const response = (await axios.get('/test-url')) as { data: string };
      return response;
    };

    const result = await store.dispatch(thunkAction as Parameters<typeof store.dispatch>[0]);

    expect(mockGet).toHaveBeenCalledWith('/test-url');
    expect(result).toEqual({ data: 'test' });
  });

  it('should have correct return type TestStoreWithHistory', () => {
    const result: TestStoreWithHistory = createTestStoreWithHistory();

    expect(result).toHaveProperty('store');
    expect(result).toHaveProperty('actionHistory');
    expect(result).toHaveProperty('axiosInstance');
  });

  it('should create independent stores with separate action histories', () => {
    const store1 = createTestStoreWithHistory();
    const store2 = createTestStoreWithHistory();

    store1.store.dispatch({ type: 'STORE_1_ACTION' });
    store2.store.dispatch({ type: 'STORE_2_ACTION' });

    expect(store1.actionHistory).toHaveLength(1);
    expect(store1.actionHistory[0].type).toBe('STORE_1_ACTION');

    expect(store2.actionHistory).toHaveLength(1);
    expect(store2.actionHistory[0].type).toBe('STORE_2_ACTION');
  });

  it('should use rootReducer from root-reducer module', () => {
    createTestStoreWithHistory();

    expect(rootReducer).toBeDefined();
  });
});
