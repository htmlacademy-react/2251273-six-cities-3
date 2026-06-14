import { NameSpace } from '../../const';
import { getErrorType } from './error-slice';

describe('get error type', () => {
  it('should return error type', () => {
    const state = {
      [NameSpace.Error]: {
        errorType: null,
      },
    };

    const result = getErrorType(state);

    expect(result).toBe(null);
  });
});
