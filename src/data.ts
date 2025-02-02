import { AuthContextProps, AuthState, AuthStoreProps, AuthUtils } from './types';
import { noUser, stub } from './utils';

/**
 * The initial auth state.
 *
 * @ignore
 */
export const initialState: AuthState = {
  isAuthenticated: false,
  user: noUser(),
  isLoading: true,
};

/**
 * @ignore
 */
export const initialUtils: AuthUtils = {
  signOut: stub,
  loginWithRedirect: stub,
  loginWithPopup: stub,
  getAccessTokenSilently: stub,
  getIdTokenClaims: stub,
  handleRedirectCallback: stub,
  getAccessTokenWithPopup: stub,
};

/**
 * @ignore
 */
export const initialStore: AuthStoreProps = {
  state: initialState,
  fn: initialUtils,
};

/**
 * @ignore
 */
export const initialContext: AuthContextProps = {
  authManager: initialStore,
  authClient: stub,
};
