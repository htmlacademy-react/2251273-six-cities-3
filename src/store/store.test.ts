import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AxiosInstance } from 'axios';
import type { ThunkAction } from '@reduxjs/toolkit';

type UnknownAction = {
  type: string;
  payload?: unknown;
};

interface MockState {
  test: string;
}

const mockApi = {
  isMockedAPI: true,
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
};

vi.mock('../services/api', () => ({
  createAPI: vi.fn(() => mockApi),
}));

vi.mock('./root-reducer', () => {
  const rootReducer = (
    state: MockState = { test: 'initial' },
    action: UnknownAction
  ) => {
    if (action.type === 'TEST_ACTION') {
      return { test: 'updated' };
    }
    return state;
  };

  return { rootReducer };
});

describe('store configuration', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('exports', () => {
    it('should export store instance', async () => {
      const { store } = await import('./store');

      expect(store).toBeDefined();
      expect(typeof store.getState).toBe('function');
      expect(typeof store.dispatch).toBe('function');
      expect(typeof store.subscribe).toBe('function');
    });

    it('should export api instance', async () => {
      const { api } = await import('./store');

      expect(api).toBeDefined();
      expect(api).toHaveProperty('isMockedAPI', true);
    });

    it('should create api via createAPI', async () => {
      const { createAPI } = await import('../services/api');

      await import('./store');

      expect(createAPI).toHaveBeenCalled();
    });

    it('should create api only once (singleton)', async () => {
      const { createAPI } = await import('../services/api');

      await import('./store');
      await import('./store');

      expect(createAPI).toHaveBeenCalledTimes(1);
    });
  });

  describe('initial state', () => {
    it('should have correct initial state from rootReducer', async () => {
      const { store } = await import('./store');

      expect(store.getState()).toEqual({ test: 'initial' });
    });
  });

  describe('reducer integration', () => {
    it('should update state via dispatched actions', async () => {
      const { store } = await import('./store');

      expect(store.getState()).toEqual({ test: 'initial' });

      store.dispatch({ type: 'TEST_ACTION' });

      expect(store.getState()).toEqual({ test: 'updated' });
    });

    it('should ignore unknown actions', async () => {
      const { store } = await import('./store');

      store.dispatch({ type: 'UNKNOWN_ACTION' });

      expect(store.getState()).toEqual({ test: 'initial' });
    });
  });

  describe('thunk middleware', () => {
    type RootState = MockState;
    type AppThunk<ReturnType = void> = ThunkAction<
      ReturnType,
      RootState,
      AxiosInstance,
      UnknownAction
    >;

    it('should execute synchronous thunks', async () => {
      const { store } = await import('./store');

      const thunkAction: AppThunk = (dispatch) => {
        dispatch({ type: 'TEST_ACTION' });
      };

      store.dispatch(thunkAction as unknown as Parameters<typeof store.dispatch>[0]);

      expect(store.getState()).toEqual({ test: 'updated' });
    });

    it('should pass api as extraArgument to thunks', async () => {
      const { store, api } = await import('./store');

      let receivedExtra: AxiosInstance | null = null;

      const thunkAction: AppThunk = (_dispatch, _getState, extra) => {
        receivedExtra = extra;
      };

      store.dispatch(thunkAction as unknown as Parameters<typeof store.dispatch>[0]);

      expect(receivedExtra).toBe(api);
      expect(receivedExtra).toHaveProperty('isMockedAPI', true);
    });

    it('should execute async thunks with api', async () => {
      const { store, api } = await import('./store');
      const mockGet = api.get as ReturnType<typeof vi.fn>;
      mockGet.mockResolvedValue({ data: 'test response' });

      const asyncThunk: AppThunk<Promise<string>> = async (
        _dispatch,
        _getState,
        extra
      ) => {
        const response = (await extra.get<string>('/api/test')) as { data: string };
        return response.data;
      };

      const result = await store.dispatch(asyncThunk as unknown as Parameters<typeof store.dispatch>[0]);

      expect(mockGet).toHaveBeenCalledWith('/api/test');
      expect(result).toBe('test response');
    });

    it('should allow thunks to access state via getState', async () => {
      const { store } = await import('./store');

      let capturedState: RootState | null = null;

      const thunkAction: AppThunk = (_dispatch, getState) => {
        capturedState = getState();
      };

      store.dispatch(thunkAction as unknown as Parameters<typeof store.dispatch>[0]);

      expect(capturedState).toEqual({ test: 'initial' });
    });

    it('should handle api errors in thunks', async () => {
      const { store, api } = await import('./store');
      const mockGet = api.get as ReturnType<typeof vi.fn>;
      mockGet.mockRejectedValue(new Error('Network error'));

      let errorCaught = false;

      const failingThunk: AppThunk<Promise<void>> = async (
        dispatch,
        _getState,
        extra
      ) => {
        try {
          await extra.get('/api/fail');
        } catch {
          errorCaught = true;
          dispatch({ type: 'FETCH_ERROR' });
        }
      };

      await store.dispatch(failingThunk as unknown as Parameters<typeof store.dispatch>[0]);

      expect(errorCaught).toBe(true);
      expect(store.getState()).toEqual({ test: 'initial' });
    });
  });

  describe('real-world scenario', () => {
    type RootState = MockState;
    type AppThunk<ReturnType = void> = ThunkAction<
      ReturnType,
      RootState,
      AxiosInstance,
      UnknownAction
    >;

    it('should handle typical async data fetching flow', async () => {
      const { store, api } = await import('./store');
      const mockGet = api.get as ReturnType<typeof vi.fn>;
      mockGet.mockResolvedValue({ data: { id: 1, name: 'Test' } });

      type FetchedData = { id: number; name: string };
      let fetchedData: FetchedData | null = null;

      const fetchDataThunk: AppThunk<Promise<void>> = async (
        dispatch,
        _getState,
        extra
      ) => {
        dispatch({ type: 'FETCH_START' });
        try {
          const response = (await extra.get<FetchedData>('/api/data')) as { data: FetchedData };
          fetchedData = response.data;
          dispatch({ type: 'FETCH_SUCCESS' });
        } catch {
          dispatch({ type: 'FETCH_ERROR' });
        }
      };

      await store.dispatch(fetchDataThunk as unknown as Parameters<typeof store.dispatch>[0]);

      expect(mockGet).toHaveBeenCalledWith('/api/data');
      expect(fetchedData).toEqual({ id: 1, name: 'Test' });
    });

    it('should share the same api instance across the app', async () => {
      const storeModule1 = await import('./store');
      const storeModule2 = await import('./store');

      expect(storeModule1.api).toBe(storeModule2.api);
    });
  });
});
