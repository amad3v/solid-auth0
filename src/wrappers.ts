import {
  Auth0Client,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdToken,
  PopupConfigOptions,
  PopupLoginOptions,
  RedirectLoginResult,
  User,
} from '@auth0/auth0-spa-js';
import { SetStoreFunction } from 'solid-js/store';

import { AppState, AuthStoreProps, LogoutOptions, RedirectLoginOptions } from './types';
import { loginError, noUser, setUser, tokenError } from './utils';

/**
 * Creates a wrapper function for signing out a user using Auth0.
 *
 * @param client - The Auth0 client instance used to handle authentication operations.
 * @param storeSetter - The store's setter.
 * @returns A function that logs the user out and updates the store. The function accepts an optional
 *          `LogoutOptions` object to configure the logout behaviour.
 *
 * @remarks
 * - If `options.openUrl` is specified (true or false), the store will be updated to reflect the user
 *   as unauthenticated.
 * - The returned function is asynchronous and ensures the logout process is complete before updating the store.
 *
 * @ignore
 */
export const signOutWrapper = (
  client: Auth0Client,
  storeSetter: SetStoreFunction<AuthStoreProps>,
) => {
  return async (options: LogoutOptions = {}): Promise<void> => {
    await client.logout(options);
    if (options.openUrl || options.openUrl === false) {
      storeSetter('state', {
        isAuthenticated: false,
        user: noUser(),
      });
    }
  };
};

/**
 * Creates a wrapper function for logging in a user using a popup with Auth0.
 *
 * @param client - The Auth0 client instance used to handle authentication operations.
 * @param storeSetter - The store's setter.
 * @param errHandler - A function to handle errors during the login process.
 * @returns A function that performs a popup login and updates the store with the user's authentication state.
 *
 * @remarks
 * - The store's `isLoading` state is set to `true` during the login process and updated upon completion.
 * - Errors encountered during the login process are passed to the `errHandler`.
 * - Upon successful login, the store's state is updated.
 *
 * @ignore
 */
export const loginWithPopupWrapper = (
  client: Auth0Client,
  storeSetter: SetStoreFunction<AuthStoreProps>,
  errHandler: (error: Error) => Error,
) => {
  return async (options?: PopupLoginOptions, config?: PopupConfigOptions): Promise<void> => {
    storeSetter('state', 'isLoading', true);
    try {
      await client.loginWithPopup(options, config);
    } catch (error) {
      errHandler(loginError(error));
      return;
    }

    storeSetter('state', {
      isAuthenticated: await client.isAuthenticated(),
      user: setUser(await client.getUser()),
      isLoading: false,
      error: undefined,
    });
  };
};

/**
 * Creates a wrapper function for retrieving an access token silently using Auth0.
 *
 * @param client - The Auth0 client instance used to manage authentication operations.
 * @param storeSetter - The store's setter.
 * @param currentUser - The current user object to compare against after token retrieval.
 * @returns A function that retrieves an access token and updates the store if the user has changed.
 *
 * @remarks
 * - If the `getTokenSilently` call fails, an error is thrown using the `tokenError` handler.
 * - After retrieving the token, the user information is refreshed and compared to the current user.
 * - If the user has changed, the store is updated with the new authentication state and user data.
 * - The retrieved access token is returned as a string upon successful execution.
 *
 * @ignore
 */
export const getAccessTokenSilentlyWrapper = (
  client: Auth0Client,
  storeSetter: SetStoreFunction<AuthStoreProps>,
  currentUser: () => User,
) => {
  return async (options?: GetTokenSilentlyOptions): Promise<string> => {
    let token;
    try {
      token = await client.getTokenSilently(options);
    } catch (error) {
      throw tokenError(error);
    } finally {
      const user = setUser(await client.getUser());
      if (currentUser() !== user) {
        storeSetter('state', {
          isAuthenticated: await client.isAuthenticated(),
          user,
        });
      }
    }
    return token;
  };
};

/**
 * Creates a wrapper function for retrieving an access token using a popup with Auth0 .
 *
 * @param client - The Auth0 client instance used to handle authentication operations.
 * @param storeSetter - The store's setter.
 * @param currentUser - The current user object to compare against after token retrieval.
 * @returns A function that retrieves an access token using a popup and updates the store if the user has changed.
 *
 * @remarks
 * - If the `getTokenWithPopup` call fails, an error is thrown using the `tokenError` handler.
 * - After retrieving the token, the user information is refreshed and compared to the current user.
 * - If the user has changed, the store is updated with the new authentication state and user data.
 * - The retrieved access token is returned as a string or `undefined` if the token is unavailable.
 *
 * @ignore
 */
export const getAccessTokenWithPopupWrapper = (
  client: Auth0Client,
  storeSetter: SetStoreFunction<AuthStoreProps>,
  currentUser: () => User,
) => {
  return async (
    options?: GetTokenWithPopupOptions,
    config?: PopupConfigOptions,
  ): Promise<string | undefined> => {
    let token;
    try {
      token = await client.getTokenWithPopup(options, config);
    } catch (error) {
      throw tokenError(error);
    } finally {
      const user = setUser(await client.getUser());
      if (currentUser() !== user) {
        storeSetter('state', {
          isAuthenticated: await client.isAuthenticated(),
          user,
        });
      }
    }
    return token;
  };
};

/**
 * Creates a wrapper function for handling the redirect callback with Auth0 and updating the application store.
 *
 * @param client - The Auth0 client instance used to manage authentication operations.
 * @param storeSetter - The store's setter.
 * @param currentUser - The current user object to compare against after handling the redirect callback.
 * @returns A function that processes the redirect callback and updates the store if the user has changed.
 *
 * @remarks
 * - The `handleRedirectCallback` function processes the redirect URL and retrieves the authentication result.
 * - If the `handleRedirectCallback` call fails, an error is thrown using the `tokenError` handler.
 * - After processing the redirect, the user information is refreshed and compared to the current user.
 * - If the user has changed, the store is updated with the new authentication state and user data.
 * - The authentication result is returned as a `RedirectLoginResult` containing any app state information.
 *
 * @ignore
 */

export const handleRedirectCallbackWrapper = (
  client: Auth0Client,
  storeSetter: SetStoreFunction<AuthStoreProps>,
  currentUser: () => User,
) => {
  return async (url?: string): Promise<RedirectLoginResult<AppState>> => {
    try {
      return await client.handleRedirectCallback(url);
    } catch (error) {
      throw tokenError(error);
    } finally {
      const user = setUser(await client.getUser());
      if (currentUser() !== user) {
        storeSetter('state', {
          isAuthenticated: await client.isAuthenticated(),
          user,
        });
      }
    }
  };
};

/**
 * Creates a wrapper function for performing a login with redirect using Auth0.
 *
 * @param client - The Auth0 client instance used to handle authentication operations.
 * @returns A function that initiates a redirect login flow.
 *
 * @remarks
 * - The `loginWithRedirect` function triggers a redirect to the login page with optional parameters.
 * - This wrapper ensures reactivity by abstracting the call to `loginWithRedirect`.
 *
 * @ignore
 */
export const loginWithRedirectWrapper = (client: Auth0Client) => {
  return async (options?: RedirectLoginOptions<AppState> | undefined): Promise<void> =>
    await client.loginWithRedirect(options);
};

/**
 * Creates a wrapper function for retrieving ID token claims using Auth0.
 *
 * @param client - The Auth0 client instance used to handle authentication operations.
 * @returns A function that retrieves ID token claims.
 *
 * @remarks
 * - The `getIdTokenClaims` function retrieves claims contained within the user's ID token.
 * - This wrapper ensures reactivity by abstracting the call to `getIdTokenClaims`.
 *
 * @ignore
 */
export const getIdTokenClaimsWrapper = (client: Auth0Client) => {
  return async (): Promise<undefined | IdToken> => await client.getIdTokenClaims();
};
