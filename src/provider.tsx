import { createAuth0Client } from '@auth0/auth0-spa-js';
import { type Component, createContext, createResource, mergeProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';

import { initialContext, initialStore } from './data';
import { AppState, AuthContextProps, AuthProviderProps, AuthStoreProps } from './types';
import { defaultOnRedirectCallback, hasAuthParams, loginError, setUser, toAuthClientOptions } from './utils';
import {
  getAccessTokenSilentlyWrapper,
  getAccessTokenWithPopupWrapper,
  getIdTokenClaimsWrapper,
  handleRedirectCallbackWrapper,
  loginWithPopupWrapper,
  loginWithRedirectWrapper,
  signOutWrapper,
} from './wrappers';

/**
 * The Auth0 Context
 */
export const AuthContext = createContext<AuthContextProps>(initialContext);

/**
 * ```js
 * const {
 *   // Auth state:
 *   authManager,
 *   // Auth client:
 *   authClient,
 * } = useAuthContext();
 * ```
 *
 * Use the `useAuthContext` hook in your components to access the auth state, methods and client.
 *
 */
export const useAuthContext = () => useContext(AuthContext);

/**
 * ```jsx
 * <AuthProvider
 *   clientOptions={{
 *     domain: import.meta.env.VITE_SOLID_APP_DOMAIN,
 *     clientId: import.meta.env.VITE_SOLID_APP_CLIENT_ID,
 *     authorizationParams: {
 *       audience: import.meta.env.VITE_SOLID_APP_AUDIENCE,
 *       redirect_uri: window.location.origin,
 *       max_age: 12 * 3600,
 *       ui_locales: 'en',
 *     },
 *   }}
 * >
 *   <App />
 * </AuthProvider>
 * ```
 *
 * Provides the AuthContext to its child components.
 */
export const AuthProvider: Component<AuthProviderProps> = (_props) => {
  const props: Required<AuthProviderProps> = mergeProps(
    { onRedirectCallback: defaultOnRedirectCallback, skipRedirectCallback: false },
    _props,
  );
  // Use store for the context
  const [store, setStore] = createStore<AuthStoreProps>(initialStore);

  const handleError = (error: Error) => {
    setStore('state', { error: error, isLoading: false });
    return error;
  };

  const handleAuth = async () => {
    const client = await createAuth0Client(toAuthClientOptions(props.clientOptions));

    try {
      if (hasAuthParams() && !props.skipRedirectCallback) {
        const { appState } = await client.handleRedirectCallback<AppState>();
        props.onRedirectCallback(appState);
      } else {
        await client.checkSession();
      }
    } catch (err) {
      handleError(loginError(err));
    }

    setStore('state', {
      isAuthenticated: await client.isAuthenticated(),
      user: setUser(await client.getUser()),
      isLoading: false,
      error: undefined,
    });

    setStore('fn', {
      signOut: signOutWrapper(client, setStore),
      loginWithRedirect: loginWithRedirectWrapper(client),
      loginWithPopup: loginWithPopupWrapper(client, setStore, handleError),
      getAccessTokenSilently: getAccessTokenSilentlyWrapper(client, setStore, store.state.user),
      getIdTokenClaims: getIdTokenClaimsWrapper(client),
      handleRedirectCallback: handleRedirectCallbackWrapper(client, setStore, store.state.user),
      getAccessTokenWithPopup: getAccessTokenWithPopupWrapper(client, setStore, store.state.user),
    });

    return client;
  };

  const [authClient] = createResource(handleAuth);

  return (
    <AuthContext.Provider
      value={{
        authManager: store,
        authClient: () => authClient,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
