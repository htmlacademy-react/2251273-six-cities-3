import { AuthorizationStatus } from '../../const';

export type UserSlice = {
  authorizationStatus: AuthorizationStatus;
  userEmail: string | null;
};
