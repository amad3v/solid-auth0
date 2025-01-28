import type { Auth0ClientOptions as AuthOptions, RedirectLoginResult } from '@auth0/auth0-spa-js';
import {
  Auth0Client,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdToken,
  LogoutOptions as SPALogoutOptions,
  PopupConfigOptions,
  PopupLoginOptions,
  RedirectLoginOptions as SPARedirectLoginOptions,
  User,
} from '@auth0/auth0-spa-js';
import type { JSXElement, Resource } from 'solid-js';

export type { Auth0ClientOptions as AuthOptions } from '@auth0/auth0-spa-js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LogoutOptions extends Omit<SPALogoutOptions, 'onRedirect'> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RedirectLoginOptions<TAppState = AppState>
  extends Omit<SPARedirectLoginOptions<TAppState>, 'onRedirect'> {}

/**
 * The state of the application before the user was redirected to the login page.
 */
export interface AppState {
  returnTo?: string;

  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * The auth state which, when combined with the auth methods,
 * make up the Manager object of the `useAuthContext` hook.
 */
export interface AuthState {
  error?: Error;
  isAuthenticated: boolean;
  user: User;
  isLoading: boolean;
}

/**
 * The auth methods which, when combined with the auth state,
 * make up the Manager object of the `useAuthContext` hook.
 */
export interface AuthUtils {
  /**
   * ```js
   * auth0.signOut({ logoutParams: { returnTo: window.location.origin } });
   * ```
   *
   * Clears the application session and performs a redirect to `/v2/logout`, using
   * the parameters provided as arguments, to clear the Auth0 session.
   * If the `logoutParams.federated` option is specified, it also clears the Identity Provider session.
   * [Read more about how signOut works at Auth0](https://auth0.com/docs/logout).
   */
  signOut: (options?: LogoutOptions) => Promise<void>;

  /**
   * ```js
   * await loginWithRedirect(options);
   * ```
   *
   * Performs a redirect to `/authorize` using the parameters
   * provided as arguments. Random and secure `state` and `nonce`
   * parameters will be auto-generated.
   */
  loginWithRedirect: (options?: RedirectLoginOptions<AppState> | undefined) => Promise<void>;

  /**
   * ```js
   * await loginWithPopup(options, config);
   * ```
   *
   * Opens a popup with the `/authorize` URL using the parameters
   * provided as arguments. Random and secure `state` and `nonce`
   * parameters will be auto-generated. If the response is successful,
   * results will be valid according to their expiration times.
   *
   * IMPORTANT: This method has to be called from an event handler
   * that was started by the user like a button click, for example,
   * otherwise the popup will be blocked in most browsers.
   */
  loginWithPopup: (options?: PopupLoginOptions, config?: PopupConfigOptions) => Promise<void>;

  /**
   * ```js
   * const token = await getAccessTokenSilently(options);
   * ```
   *
   * If there's a valid token stored, return it. Otherwise, opens an
   * iframe with the `/authorize` URL using the parameters provided
   * as arguments. Random and secure `state` and `nonce` parameters
   * will be auto-generated. If the response is successful, results
   * will be valid according to their expiration times.
   *
   * If refresh tokens are used, the token endpoint is called directly with the
   * 'refresh_token' grant. If no refresh token is available to make this call,
   * the SDK will only fall back to using an iframe to the '/authorize' URL if
   * the `useRefreshTokensFallback` setting has been set to `true`. By default this
   * setting is `false`.
   *
   * This method may use a web worker to perform the token call if the in-memory
   * cache is used.
   *
   * If an `audience` value is given to this function, the SDK always falls
   * back to using an iframe to make the token exchange.
   *
   * Note that in all cases, falling back to an iframe requires access to
   * the `auth0` cookie.
   */
  getAccessTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>;

  /**
   * ```js
   * const claims = await getIdTokenClaims();
   * ```
   *
   * Returns all claims from the id_token if available.
   */
  getIdTokenClaims: () => Promise<undefined | IdToken>;

  /**
   * After the browser redirects back to the callback page,
   * call `handleRedirectCallback` to handle success and error
   * responses from Auth0. If the response is successful, results
   * will be valid according to their expiration times.
   *
   * @param url The URL to that should be used to retrieve the `state` and `code` values.
   *            Defaults to `window.location.href` if not given.
   */
  handleRedirectCallback: (url?: string) => Promise<RedirectLoginResult<AppState>>;

  /**
   * ```js
   * const token = await getTokenWithPopup(options, config);
   * ```
   *
   * Get an access token interactively.
   *
   * Opens a popup with the `/authorize` URL using the parameters
   * provided as arguments. Random and secure `state` and `nonce`
   * parameters will be auto-generated. If the response is successful,
   * results will be valid according to their expiration times.
   */
  getAccessTokenWithPopup: (
    options?: GetTokenWithPopupOptions,
    config?: PopupConfigOptions,
  ) => Promise<string | undefined>;
}

/**
 * The Manager object of the `useAuthContext` hook.
 */
export interface AuthStoreProps {
  /**
   * @see {@link AuthState}
   */
  state: AuthState;
  /**
   * @see {@link AuthUtils}
   */
  fn: AuthUtils;
}

/**
 * Contains the authenticated state and authentication methods provided by the `useAuthContext` hook.
 */
export interface AuthContextProps {
  authManager: AuthStoreProps;
  /**
   * The instance of `Auth0Client` as a SolidJS resource
   * Use `authClient()` to access the data.
   */
  authClient: () => Resource<Auth0Client> | undefined;
}

/**
 * The main configuration to instantiate the `AuthProvider`.
 */
export interface AuthProviderProps {
  /**
   * The child nodes your Provider has wrapped
   */
  children: JSXElement;

  /**
   * @see {@link https://auth0.github.io/auth0-spa-js/interfaces/Auth0ClientOptions.html | Auth0ClientOptions} for details.
   */
  clientOptions: AuthOptions;

  /**
   * By default, this removes the code and state parameters from the url
   * when you are redirected from the authorise page.
   * It uses `window.history` but you might want to overwrite this
   * if you are using a custom router, like `Solid-Router`
   */
  onRedirectCallback?: (appState?: AppState, user?: User) => void;

  /**
   * By default, if the page url has code/state params, the SDK will
   * treat them as Auth0's and attempt to exchange the code for a token.
   * In some cases the code might be for something else (another OAuth SDK perhaps).
   * In these    * instances you can instruct the client to ignore them e.g.
   *
   * ```jsx
   * <Auth0Provider
   *   clientId={clientId}
   *   domain={domain}
   *   skipRedirectCallback={window.location.pathname === '/stripe-oauth-callback'}
   * >
   * ```
   */
  skipRedirectCallback?: boolean;
}
