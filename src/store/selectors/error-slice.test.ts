import { describe, it, expect } from 'vitest';
import { checkErrorEmptyOffers, checkErrorAddComment, getErrorType } from './error-slice';
import { NameSpace, TYPE_OF_ERROR } from '../../const';
import { ErrorType } from '../../types/error';

const createMockState = (errorType: ErrorType | null = null, offersLoadingStatus = false) => ({
  [NameSpace.Error]: {
    errorType,
  },
  [NameSpace.Offers]: {
    offersLoadingStatus,
    offers: [],
    city: 'Paris',
    sorting: 'Popular',
    nearOffers: [],
    nearOffersLoadingStatus: false,
    favoriteOffers: [],
    favoriteOffersLoadingStatus: false,
  },
});

describe('error-slice selectors', () => {
  describe('checkErrorEmptyOffers', () => {
    it('should return true when errorType is ERROR_EMPTY_OFFERS and offersLoadingStatus is true', () => {
      const state = createMockState(TYPE_OF_ERROR.ERROR_EMPTY_OFFERS, true);
      expect(checkErrorEmptyOffers(state)).toBe(true);
    });

    it('should return false when errorType is ERROR_EMPTY_OFFERS but offersLoadingStatus is false', () => {
      const state = createMockState(TYPE_OF_ERROR.ERROR_EMPTY_OFFERS, false);
      expect(checkErrorEmptyOffers(state)).toBe(false);
    });

    it('should return false when offersLoadingStatus is true but errorType is different', () => {
      const state = createMockState(TYPE_OF_ERROR.ERROR_LOADING_OFFERS, true);
      expect(checkErrorEmptyOffers(state)).toBe(false);
    });

    it('should return false when errorType is null', () => {
      const state = createMockState(null, true);
      expect(checkErrorEmptyOffers(state)).toBe(false);
    });

    it('should return false when both conditions are false', () => {
      const state = createMockState(null, false);
      expect(checkErrorEmptyOffers(state)).toBe(false);
    });
  });

  describe('checkErrorAddComment', () => {
    it('should return true when errorType is ERROR_ADD_COMMENT', () => {
      const state = {
        [NameSpace.Error]: {
          errorType: TYPE_OF_ERROR.ERROR_ADD_COMMENT,
        },
      };
      expect(checkErrorAddComment(state)).toBe(true);
    });

    it('should return false when errorType is different', () => {
      const state = {
        [NameSpace.Error]: {
          errorType: TYPE_OF_ERROR.ERROR_LOADING_OFFERS,
        },
      };
      expect(checkErrorAddComment(state)).toBe(false);
    });

    it('should return false when errorType is null', () => {
      const state = {
        [NameSpace.Error]: {
          errorType: null,
        },
      };
      expect(checkErrorAddComment(state)).toBe(false);
    });
  });

  describe('getErrorType', () => {
    it('should return errorType when it exists', () => {
      const state = {
        [NameSpace.Error]: {
          errorType: TYPE_OF_ERROR.ERROR_LOGIN,
        },
      };
      expect(getErrorType(state)).toBe(TYPE_OF_ERROR.ERROR_LOGIN);
    });

    it('should return null when errorType is null', () => {
      const state = {
        [NameSpace.Error]: {
          errorType: null,
        },
      };
      expect(getErrorType(state)).toBeNull();
    });

    it('should return correct errorType for each error type', () => {
      const errorTypes: ErrorType[] = [
        TYPE_OF_ERROR.ERROR_LOADING_OFFERS,
        TYPE_OF_ERROR.ERROR_LOADING_OFFER,
        TYPE_OF_ERROR.ERROR_LOADING_COMMENTS,
        TYPE_OF_ERROR.ERROR_LOADING_NEAR_OFFERS,
        TYPE_OF_ERROR.ERROR_LOGIN,
        TYPE_OF_ERROR.ERROR_LOGIN_EMAIL,
        TYPE_OF_ERROR.ERROR_LOGIN_PASSWORD,
        TYPE_OF_ERROR.ERROR_ADD_COMMENT,
        TYPE_OF_ERROR.ERROR_EMPTY_OFFERS,
      ];

      errorTypes.forEach((errorType) => {
        const state = {
          [NameSpace.Error]: {
            errorType,
          },
        };
        expect(getErrorType(state)).toBe(errorType);
      });
    });
  });
});
