import { Auth0Client, createAuth0Client, User } from '@auth0/auth0-spa-js';
import {
  type Component,
  createContext,
  createMemo,
  createResource,
  mergeProps,
  useContext,
} from 'solid-js';
import { createStore } from 'solid-js/store';

import { initialContext, initialStore } from './data';
import { AppState, AuthContextProps, AuthProviderProps, AuthStoreProps } from './types';
import {
  defaultOnRedirectCallback,
  hasAuthParams,
  loginError,
  setUser,
  toAuthClientOptions,
} from './utils';
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
    {
      onRedirectCallback: defaultOnRedirectCallback,
      skipRedirectCallback: false,
    },
    _props,
  );

  const [store, setStore] = createStore<AuthStoreProps>(initialStore);

  // const currentUser = (): User => store.state.user;
  const currentUser = createMemo<User>(() => {
    return store.state.user;
  });

  const handleError = (error: Error): never => {
    setStore('state', { error: error, isLoading: false });
    throw error;
  };

  const handleAuth = async (): Promise<Auth0Client | undefined> => {
    const client = await createAuth0Client(toAuthClientOptions(props.clientOptions));

    try {
      if (hasAuthParams() && !props.skipRedirectCallback) {
        const { appState } = await client.handleRedirectCallback<AppState>();
        props.onRedirectCallback(appState);
      } else {
        await client.checkSession();
      }
    } catch (error) {
      handleError(loginError(error));
      return undefined;
    }

    const isAuthenticated = await client.isAuthenticated();
    const user = setUser(await client.getUser());

    setStore('state', {
      isAuthenticated,
      user,
      isLoading: false,
      error: undefined,
    });

    setStore('fn', {
      signOut: signOutWrapper(client, setStore),
      loginWithRedirect: loginWithRedirectWrapper(client),
      loginWithPopup: loginWithPopupWrapper(client, setStore, handleError),
      getAccessTokenSilently: getAccessTokenSilentlyWrapper(client, setStore, currentUser),
      getIdTokenClaims: getIdTokenClaimsWrapper(client),
      handleRedirectCallback: handleRedirectCallbackWrapper(client, setStore, currentUser),
      getAccessTokenWithPopup: getAccessTokenWithPopupWrapper(client, setStore, currentUser),
    });

    return client;
  };

  // eslint-disable-next-line solid/reactivity
  const [authClient, { refetch }] = createResource(() => props.clientOptions, handleAuth);

  const value = createMemo<AuthContextProps>(() => {
    if (authClient.state === 'errored') {
      refetch();
    }

    return {
      authManager: store,
      authClient: () => authClient,
    };
  });

  // eslint-disable-next-line solid/reactivity
  return <AuthContext.Provider value={value()}>{props.children}</AuthContext.Provider>;
};
