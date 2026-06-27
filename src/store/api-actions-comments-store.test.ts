import { fetchCommentsOfferAction, postCommentsOfferAction } from './api-actions';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { APIRoute, NameSpace } from '../const';
import { OFFER } from '../mocks/mock-offer';
import { COMMENTS } from '../mocks/mock-comments';
import { CommentElementType } from '../types/comments';
import { createTestStoreWithHistory } from './test-utils';
import { createAPI } from '../services/api';

describe('fetchOffersAction', () => {
  const axiosInstance = createAPI();
  const mockAxiosAdapter = new MockAdapter(axiosInstance);
  let testStore: ReturnType<typeof createTestStoreWithHistory>;
  beforeEach(() => {
    testStore = createTestStoreWithHistory(axiosInstance);
  });

  afterEach(() => {
    mockAxiosAdapter.reset();
  });

  it('should dispatch fetchCommentsOfferAction success', async () => {
    const { store, actionHistory } = testStore;
    const mockComments: CommentElementType[] = COMMENTS;
    mockAxiosAdapter.onGet(`${APIRoute.Comments}/${OFFER.id}`).reply(200, mockComments);

    await store.dispatch(fetchCommentsOfferAction(OFFER.id));

    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchCommentsOfferAction.fulfilled.type
    );
    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockComments);

    expect(store.getState()[NameSpace.Offer].selectedOfferComments).toEqual(mockComments);
    expect(store.getState()[NameSpace.Offer].selectedOfferCommentsLoadingStatus).toBe(true);
  });


  it('should dispatch fetchCommentsOfferAction success empty array', async () => {
    const { store, actionHistory } = testStore;
    const mockComments: CommentElementType[] = [];
    mockAxiosAdapter.onGet(`${APIRoute.Comments}/${OFFER.id}`).reply(200, mockComments);

    await store.dispatch(fetchCommentsOfferAction(OFFER.id));

    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchCommentsOfferAction.fulfilled.type
    );
    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockComments);

    expect(store.getState()[NameSpace.Offer].selectedOfferComments).toEqual(mockComments);
    expect(store.getState()[NameSpace.Offer].selectedOfferCommentsLoadingStatus).toBe(true);
  });

  it('should dispatch fetchCommentsOfferAction error', async () => {
    const { store, actionHistory } = testStore;
    mockAxiosAdapter.onGet(`${APIRoute.Comments}/${OFFER.id}`).reply(400);

    await store.dispatch(fetchCommentsOfferAction(OFFER.id));

    const rejectedAction = actionHistory.find(
      (action) => action.type === fetchCommentsOfferAction.rejected.type
    );
    expect(rejectedAction).toBeDefined();

    expect(store.getState()[NameSpace.Offer].selectedOfferComments).toEqual([]);
    expect(store.getState()[NameSpace.Offer].selectedOfferCommentsLoadingStatus).toBe(false);
  });

  it('should dispatch postCommentsOfferAction success', async () => {
    const { store, actionHistory } = testStore;
    const mockComments: CommentElementType[] = COMMENTS;
    mockAxiosAdapter
      .onPost(`${APIRoute.Comments}/${OFFER.id}`)
      .reply(200);
    mockAxiosAdapter
      .onGet(`${APIRoute.Comments}/${OFFER.id}`)
      .reply(200, mockComments);

    await store.dispatch(postCommentsOfferAction({ offerId: OFFER.id, comment: 'test comment', rating: 4 }));

    const fulfilledAction = actionHistory.find(
      (action) => action.type === postCommentsOfferAction.fulfilled.type
    );

    expect(fulfilledAction).toBeDefined();

    const getRequests = mockAxiosAdapter.history.get;

    expect(getRequests).toHaveLength(1);
    expect(getRequests[0].url).toBe(`${APIRoute.Comments}/${OFFER.id}`);
  });

  it('should dispatch postCommentsOfferAction error', async () => {
    const { store, actionHistory } = testStore;
    mockAxiosAdapter
      .onPost(`${APIRoute.Comments}/${OFFER.id}`)
      .reply(400);

    await store.dispatch(postCommentsOfferAction({ offerId: OFFER.id, comment: 'test comment', rating: 4 }));

    const rejectedAction = actionHistory.find(
      (action) => action.type === postCommentsOfferAction.rejected.type
    );
    expect(rejectedAction).toBeDefined();
  });
});
