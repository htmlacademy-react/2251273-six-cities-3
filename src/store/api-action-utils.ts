import { configureStore, Middleware, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { createAPI } from '../services/api';
import { rootReducer } from './rootReducer';

export const createTestStore = (extraMiddlewares: Middleware[] = []) => {
  const axios = createAPI();
  const actionHistory: AnyAction[] = [];

  const actionCollector: Middleware = () => (next: Dispatch) => (action: AnyAction) => {
    actionHistory.push(action);
    return next(action);
  };

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: axios },
      }).concat([actionCollector, ...extraMiddlewares]),
  });

  return { store, actionHistory, axios };
};

export type TestStore = ReturnType<typeof createTestStore>;
