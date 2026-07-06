import { configureStore, Dispatch, AnyAction, Middleware } from '@reduxjs/toolkit';
import { createAPI } from '../services/api';
import { rootReducer } from './root-reducer';

export const createTestStoreWithHistory = (axiosInstance = createAPI()) => {
  const actionHistory: AnyAction[] = [];

  const actionCollector: Middleware =
    () => (next: Dispatch) => (action: AnyAction) => {
      actionHistory.push(action);
      return next(action);
    };

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: axiosInstance },
      }).concat(actionCollector),
  });

  return {
    store,
    actionHistory,
    axiosInstance,
  };
};

export type TestStoreWithHistory = ReturnType<typeof createTestStoreWithHistory>;
