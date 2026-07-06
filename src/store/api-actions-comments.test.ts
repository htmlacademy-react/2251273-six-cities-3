import { fetchCommentsOfferAction, postCommentsOfferAction } from '../store/api-actions';
import { APIRoute } from '../const';
import { State } from '../types/state';
import { createAPI } from '../services/api';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { OFFER } from '../mocks/mock-offer';
import { COMMENTS } from '../mocks/mock-comments';

type AppThunkDispatch = ThunkDispatch<State, ReturnType<typeof createAPI>, Action>;

const extractActionsTypes = (actions: Action<string>[]) => actions.map(({ type }) => type);

describe('Async actions: comments', () => {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator> = mockStoreCreator({
    OFFER: {
      selectedOffer: null,
      selectedOfferLoadingStatus: null,
      selectedOfferComments: [],
      selectedOfferCommentsLoadingStatus: null,
    },
  });

  beforeEach(() => {
    store = mockStoreCreator({
      OFFER: {
        selectedOffer: null,
        selectedOfferLoadingStatus: null,
        selectedOfferComments: [],
        selectedOfferCommentsLoadingStatus: null,
      },
    });
  });

  afterEach(() => {
    mockAxiosAdapter.reset();
    store.clearActions();
  });

  describe('fetchCommentsOfferAction', () => {
    it('should dispatch pending and fulfilled on success', async () => {
      mockAxiosAdapter
        .onGet(`${APIRoute.Comments}/${OFFER.id}`)
        .reply(200, COMMENTS);

      await store.dispatch(fetchCommentsOfferAction(OFFER.id));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        fetchCommentsOfferAction.pending.type,
        fetchCommentsOfferAction.fulfilled.type,
      ]);
    });

    it('should return comments in fulfilled payload on success', async () => {
      mockAxiosAdapter
        .onGet(`${APIRoute.Comments}/${OFFER.id}`)
        .reply(200, COMMENTS);

      await store.dispatch(fetchCommentsOfferAction(OFFER.id));

      const actions = store.getActions();
      const fulfilledAction = actions[1] as ReturnType<typeof fetchCommentsOfferAction.fulfilled>;
      expect(fulfilledAction.payload).toEqual(COMMENTS);
    });

    it('should dispatch pending and fulfilled with empty array', async () => {
      mockAxiosAdapter
        .onGet(`${APIRoute.Comments}/${OFFER.id}`)
        .reply(200, []);

      await store.dispatch(fetchCommentsOfferAction(OFFER.id));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        fetchCommentsOfferAction.pending.type,
        fetchCommentsOfferAction.fulfilled.type,
      ]);

      const fulfilledAction = store.getActions()[1] as unknown as { payload: unknown };
      expect(fulfilledAction.payload).toEqual([]);
    });

    it('should dispatch pending and rejected on failure', async () => {
      mockAxiosAdapter
        .onGet(`${APIRoute.Comments}/${OFFER.id}`)
        .reply(400);

      await store.dispatch(fetchCommentsOfferAction(OFFER.id));

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        fetchCommentsOfferAction.pending.type,
        fetchCommentsOfferAction.rejected.type,
      ]);
    });

    it('should make GET request with correct URL', async () => {
      mockAxiosAdapter
        .onGet(`${APIRoute.Comments}/${OFFER.id}`)
        .reply(200, COMMENTS);

      await store.dispatch(fetchCommentsOfferAction(OFFER.id));

      const getRequests = mockAxiosAdapter.history.get;
      expect(getRequests).toHaveLength(1);
      expect(getRequests[0].url).toBe(`${APIRoute.Comments}/${OFFER.id}`);
    });
  });

  describe('postCommentsOfferAction', () => {
    it('should dispatch pending and fulfilled on success', async () => {
      mockAxiosAdapter
        .onPost(`${APIRoute.Comments}/${OFFER.id}`)
        .reply(200);

      await store.dispatch(
        postCommentsOfferAction({ offerId: OFFER.id, comment: 'test comment', rating: 5 })
      );

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        postCommentsOfferAction.pending.type,
        postCommentsOfferAction.fulfilled.type,
      ]);
    });

    it('should make POST request with correct URL and body', async () => {
      mockAxiosAdapter
        .onPost(`${APIRoute.Comments}/${OFFER.id}`)
        .reply(200);

      await store.dispatch(
        postCommentsOfferAction({ offerId: OFFER.id, comment: 'test comment', rating: 5 })
      );

      const postRequests = mockAxiosAdapter.history.post;
      expect(postRequests).toHaveLength(1);
      expect(postRequests[0].url).toBe(`${APIRoute.Comments}/${OFFER.id}`);
      expect(JSON.parse(postRequests[0].data as string)).toEqual({
        comment: 'test comment',
        rating: 5,
      });
    });

    it('should not make GET request after POST', async () => {
      mockAxiosAdapter
        .onPost(`${APIRoute.Comments}/${OFFER.id}`)
        .reply(200);

      await store.dispatch(
        postCommentsOfferAction({ offerId: OFFER.id, comment: 'test comment', rating: 5 })
      );

      const getRequests = mockAxiosAdapter.history.get;
      expect(getRequests).toHaveLength(0);
    });

    it('should dispatch pending and rejected on POST failure', async () => {
      mockAxiosAdapter
        .onPost(`${APIRoute.Comments}/${OFFER.id}`)
        .reply(400);

      await store.dispatch(
        postCommentsOfferAction({ offerId: OFFER.id, comment: 'test comment', rating: 5 })
      );

      const actions = extractActionsTypes(store.getActions());
      expect(actions).toEqual([
        postCommentsOfferAction.pending.type,
        postCommentsOfferAction.rejected.type,
      ]);
    });

    it('should make POST request even when it fails', async () => {
      mockAxiosAdapter
        .onPost(`${APIRoute.Comments}/${OFFER.id}`)
        .reply(400);

      await store.dispatch(
        postCommentsOfferAction({ offerId: OFFER.id, comment: 'test comment', rating: 5 })
      );

      const postRequests = mockAxiosAdapter.history.post;
      expect(postRequests).toHaveLength(1);
      expect(postRequests[0].url).toBe(`${APIRoute.Comments}/${OFFER.id}`);
    });
  });
});
