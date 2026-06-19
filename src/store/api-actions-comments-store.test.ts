import { fetchCommentsOfferAction, postCommentsOfferAction } from './api-actions';
import { configureStore, Dispatch, AnyAction, Middleware } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createAPI } from '../services/api';
import { rootReducer } from './rootReducer';
import { APIRoute, NameSpace } from '../const';
import { OFFER } from '../mocks/mock-offer';
import { COMMENTS } from '../mocks/mock-comments';
import { CommentElementType } from '../types/comments';

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

  // fetchCommentsOfferAction success
  it('should dispatch fetchCommentsOfferAction success', async () => {
    const mockComments: CommentElementType[] = COMMENTS;
    mockAxiosAdapter.onGet(`${APIRoute.Comments}/${OFFER.id}`).reply(200, mockComments);
    // Выполняем действие
    await store.dispatch(fetchCommentsOfferAction(OFFER.id));
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchCommentsOfferAction.fulfilled.type
    );
    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockComments);

    expect(store.getState()[NameSpace.Offer].selectedOfferComments).toEqual(mockComments);
    expect(store.getState()[NameSpace.Offer].selectedOfferCommentsLoadingStatus).toBe(true);
  });

  // fetchCommentsOfferAction success empty array
  it('should dispatch fetchCommentsOfferAction success empty array', async () => {
    const mockComments: CommentElementType[] = [];
    mockAxiosAdapter.onGet(`${APIRoute.Comments}/${OFFER.id}`).reply(200, mockComments);
    // Выполняем действие
    await store.dispatch(fetchCommentsOfferAction(OFFER.id));
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchCommentsOfferAction.fulfilled.type
    );
    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockComments);

    expect(store.getState()[NameSpace.Offer].selectedOfferComments).toEqual(mockComments);
    expect(store.getState()[NameSpace.Offer].selectedOfferCommentsLoadingStatus).toBe(true);
  });

  // fetchCommentsOfferAction error
  it('should dispatch fetchCommentsOfferAction error', async () => {
    mockAxiosAdapter.onGet(`${APIRoute.Comments}/${OFFER.id}`).reply(400);
    // Выполняем действие
    await store.dispatch(fetchCommentsOfferAction(OFFER.id));
    // Проверяем результат
    const rejectedAction = actionHistory.find(
      (action) => action.type === fetchCommentsOfferAction.rejected.type
    );
    expect(rejectedAction).toBeDefined();

    expect(store.getState()[NameSpace.Offer].selectedOfferComments).toEqual([]);
    expect(store.getState()[NameSpace.Offer].selectedOfferCommentsLoadingStatus).toBe(false);
  });

  // postCommentsOfferAction success
  it('should dispatch postCommentsOfferAction success', async () => {
    const mockComments: CommentElementType[] = COMMENTS;
    mockAxiosAdapter
      .onPost(`${APIRoute.Comments}/${OFFER.id}`)
      .reply(200);
    mockAxiosAdapter
      .onGet(`${APIRoute.Comments}/${OFFER.id}`)
      .reply(200, mockComments);
    // Выполняем действие
    await store.dispatch(postCommentsOfferAction({ offerId: OFFER.id, comment: 'test comment', rating: 4 }));
    // Проверяем результат
    const fulfilledAction = actionHistory.find(
      (action) => action.type === postCommentsOfferAction.fulfilled.type
    );

    expect(fulfilledAction).toBeDefined();

    const getRequests = mockAxiosAdapter.history.get;

    expect(getRequests).toHaveLength(1);
    expect(getRequests[0].url).toBe(`${APIRoute.Comments}/${OFFER.id}`);
  });

  // postCommentsOfferAction error
  it('should dispatch postCommentsOfferAction error', async () => {
    mockAxiosAdapter
      .onPost(`${APIRoute.Comments}/${OFFER.id}`)
      .reply(400);
    // Выполняем действие
    await store.dispatch(postCommentsOfferAction({ offerId: OFFER.id, comment: 'test comment', rating: 4 }));
    // Проверяем результат
    const rejectedAction = actionHistory.find(
      (action) => action.type === postCommentsOfferAction.rejected.type
    );
    expect(rejectedAction).toBeDefined();
  });
});
