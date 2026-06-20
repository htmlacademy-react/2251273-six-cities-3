import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { fetchOfferAction } from './api-actions';
import { APIRoute, NameSpace } from '../const';
import { OFFER } from '../mocks/mock-offer';
import { createTestStoreWithHistory } from './test-utils';
import { createAPI } from '../services/api';


describe('fetchOfferAction', () => {
  const axiosInstance = createAPI();

  const mockAxiosAdapter = new MockAdapter(axiosInstance);

  let testStore: ReturnType<typeof createTestStoreWithHistory>;

  beforeEach(() => {
    testStore = createTestStoreWithHistory(axiosInstance);
  });

  afterEach(() => {
    mockAxiosAdapter.reset();
  });

  it('should dispatch fetchOfferAction fulfilled', async () => {

    const mockOffer = OFFER;

    mockAxiosAdapter.onGet(`${APIRoute.Offer}/${mockOffer.id}`).reply(200, mockOffer);

    const { store, actionHistory } = testStore;

    await store.dispatch(fetchOfferAction(mockOffer.id));

    const fulfilledAction = actionHistory.find(
      (action) => action.type === fetchOfferAction.fulfilled.type
    );

    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.payload).toEqual(mockOffer);

    const offerState = store.getState()[NameSpace.Offer];
    expect(offerState.selectedOffer).toEqual(mockOffer);
    expect(offerState.selectedOfferLoadingStatus).toBe(true);
  });

  it('should dispatch fetchOfferAction rejected', async () => {
    mockAxiosAdapter.onGet(`${APIRoute.Offer}/${OFFER.id}`).reply(400);

    const { store, actionHistory } = testStore;
    await store.dispatch(fetchOfferAction(OFFER.id));

    const rejectedAction = actionHistory.find(
      (action) => action.type === fetchOfferAction.rejected.type
    );
    expect(rejectedAction).toBeDefined();

    const offerState = store.getState()[NameSpace.Offer];
    expect(offerState.selectedOffer).toBeNull();
    expect(offerState.selectedOfferLoadingStatus).toBe(false);
  });
});
