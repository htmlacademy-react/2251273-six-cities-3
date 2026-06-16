import { checkAuthAction, loginAction, logoutAction } from '../api-actions';
import { AuthorizationStatus } from '../../const';
import { userSlice } from './user-slice';

describe('user slice', () => {
  it('should return initial state', () => {
    const state = userSlice.getInitialState();

    expect(state).toEqual({
      authorizationStatus: AuthorizationStatus.Unknown,
      userEmail: null,
      userAvatar: null,
    });
  });

  it('should update authorization status / Auth', () => {
    const result = userSlice.reducer(
      {
        authorizationStatus: AuthorizationStatus.Unknown,
        userEmail: null,
        userAvatar: null,

      }, {
        type: checkAuthAction.fulfilled.type,
        payload: {
          email: 'oBtXg@example.com',
          avatarUrl: 'https://via.placeholder.com/150',
        },
      });

    expect(result).toEqual({
      authorizationStatus: AuthorizationStatus.Auth,
      userEmail: 'oBtXg@example.com',
      userAvatar: 'https://via.placeholder.com/150',
    });
  });

  it('should update authorization status / NoAuth', () => {
    const result = userSlice.reducer(
      {
        authorizationStatus: AuthorizationStatus.Unknown,
        userEmail: null,
        userAvatar: null,

      }, {
        type: checkAuthAction.rejected.type,
      });

    expect(result).toEqual({
      authorizationStatus: AuthorizationStatus.NoAuth,
      userEmail: null,
      userAvatar: null,
    });
  });

  it('should update authorization status / Auth', () => {
    const result = userSlice.reducer(
      {
        authorizationStatus: AuthorizationStatus.Unknown,
        userEmail: 'oBtXg@example.com',
        userAvatar: 'https://via.placeholder.com/150',

      }, {
        type: loginAction.fulfilled.type,
      });

    expect(result).toEqual({
      authorizationStatus: AuthorizationStatus.Auth,
      userEmail: 'oBtXg@example.com',
      userAvatar: 'https://via.placeholder.com/150',
    });
  });

  it('should update authorization status / NoAuth', () => {
    const result = userSlice.reducer(
      {
        authorizationStatus: AuthorizationStatus.Unknown,
        userEmail: null,
        userAvatar: null,

      }, {
        type: loginAction.rejected.type,
      });

    expect(result).toEqual({
      authorizationStatus: AuthorizationStatus.NoAuth,
      userEmail: null,
      userAvatar: null,
    });
  });

  it('should update authorization status / NoAuth', () => {
    const result = userSlice.reducer(
      {
        authorizationStatus: AuthorizationStatus.Auth,
        userEmail: null,
        userAvatar: null,

      }, {
        type: logoutAction.fulfilled.type,
      });

    expect(result).toEqual({
      authorizationStatus: AuthorizationStatus.NoAuth,
      userEmail: null,
      userAvatar: null,
    });
  });

  it('should update authorization status / NoAuth', () => {
    const result = userSlice.reducer(
      undefined,
      {
        type: logoutAction.fulfilled.type,
      });

    expect(result).toEqual({
      authorizationStatus: AuthorizationStatus.NoAuth,
      userEmail: null,
      userAvatar: null,
    });
  });

  it('should return initial state / unknown action', () => {
    const result = userSlice.reducer(
      undefined,
      {
        type: 'unknown action',
      });

    expect(result).toEqual({
      authorizationStatus: AuthorizationStatus.Unknown,
      userEmail: null,
      userAvatar: null,
    });
  });
});
