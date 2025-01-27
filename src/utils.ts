import { Auth0ClientOptions, User } from '@auth0/auth0-spa-js';

import { OAuthError } from './errors';
import { AppState } from './types';

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

/**
 * @ignore
 */
export const hasAuthParams = (searchParams = window.location.search): boolean =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) && STATE_RE.test(searchParams);

/**
 * @ignore
 */
export const defaultOnRedirectCallback = (appState?: AppState): void => {
  window.history.replaceState({}, document.title, appState?.returnTo || window.location.pathname);
};

/**
 * @ignore
 */
const normaliseError =
  (fallbackMessage: string) =>
  (error: unknown): Error => {
    if (error instanceof Error) {
      return error;
    }
    // try to check errors of the following form: {error: string; error_description?: string}
    if (
      error !== null &&
      typeof error === 'object' &&
      'error' in error &&
      typeof error.error === 'string'
    ) {
      if ('error_description' in error && typeof error.error_description === 'string') {
        return new OAuthError(error.error, error.error_description);
      }
      return new OAuthError(error.error);
    }
    return new Error(fallbackMessage);
  };

/**
 * @ignore
 */
export const loginError = normaliseError('Login failed');

/**
 * @ignore
 */
export const tokenError = normaliseError('Get access token failed');

/**
 * @ignore
 */
export const setUser = (user: User | undefined) => (user === undefined ? noUser() : user);

/**
 * @ignore
 */
export const noUser = () => new User();

/**
 * @ignore
 */
export const toAuthClientOptions = (opts: Auth0ClientOptions): Auth0ClientOptions => ({
  ...opts,
  auth0Client: {
    name: import.meta.env.VITE_SOLID_AUTH0_NAME,
    version: import.meta.env.VITE_SOLID_AUTH0_VER,
  },
});

/**
 * @ignore
 */
export const stub = (): never => {
  throw new Error('You forgot to wrap your component in <AuthProvider>.');
};
