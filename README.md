# solid-auth0

---

## ⚠️ Warning ⚠️

**This library is not thoroughly tested.** Use it at your own risk, especially in production environments. Contributions and feedback are welcome to improve the library's reliability and functionality.

---

`solid-auth0` is a modified port of [`auth0-react`](https://github.com/auth0/auth0-react) tailored specifically for the SolidJS framework. It exposes the core interfaces from `@auth0/auth0-spa-js` while providing additional library-specific interfaces to facilitate seamless authentication integration in SolidJS applications.

This library is designed to integrate Auth0 authentication capabilities while leveraging SolidJS's reactivity and rendering model.

## Features

- **AuthContext**: Provides the ability to manage authentication state using SolidJS's reactive system.
- **AuthProvider**: A wrapper component to provide authentication context to your SolidJS components.
- **Interfaces**: Exposes interfaces from `@auth0/auth0-spa-js` alongside library-specific types for a more intuitive API.
- **TypeScript Support**: Full TypeScript support to ensure type safety in your SolidJS applications.

## Exclusions

This library does **not** port the following features from `auth0-react`:

1. [**`deprecateRedirectUri`**](https://github.com/auth0/auth0-react/blob/1644bb53f7ef1bc5b62a904a0908587b3f12dd54/src/utils.tsx#L45): A helper function used to map the v1 `redirectUri` option to the v2 `authorizationParams.redirect_uri`. It also logs a warning. This function is not ported since it is used only in `auth0-react`'s [`toAuth0ClientOptions`](https://github.com/auth0/auth0-react/blob/1644bb53f7ef1bc5b62a904a0908587b3f12dd54/src/auth0-provider.tsx#L98) and [`loginWithRedirect`](https://github.com/auth0/auth0-react/blob/1644bb53f7ef1bc5b62a904a0908587b3f12dd54/src/auth0-provider.tsx#L177) functions.
2. [**`withAuth0`**](https://github.com/auth0/auth0-react/blob/1644bb53f7ef1bc5b62a904a0908587b3f12dd54/src/with-auth0.tsx#L29C7-L29C16): A Higher Order Component (HOC) used to wrap class components in `auth0-react` to provide access to `Auth0Context`. This is excluded as it’s specific to class-based components, and SolidJS favors functional components.
3. [**`withAuthenticationRequired`**](https://github.com/auth0/auth0-react/blob/1644bb53f7ef1bc5b62a904a0908587b3f12dd54/src/with-authentication-required.tsx#L97C7-L97C33): A Higher Order Component (HOC) used in [`auth0-react`](https://github.com/auth0/auth0-react) to redirect users to the login page if they are not authenticated. After login, users are returned to the page they were redirected from. This functionality is not ported in `solid-auth0`, as SolidJS handles routes and redirects in a more granular way.

## Installation

To install `solid-auth0` in your SolidJS project, you can use pnpm:

```bash
pnpm add solid-auth0
```

## Usage Example

The following example demonstrates how to use the `AuthProvider` to provide authentication context to your SolidJS application:

```tsx
/* @refresh reload */
import { AuthProvider, AuthOptions } from 'solid-auth0';
import { render } from 'solid-js/web';

import App from './App';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

const options: AuthOptions = {
  domain: import.meta.env.VITE_SOLID_APP_DOMAIN,
  clientId: import.meta.env.VITE_SOLID_APP_CLIENT_ID,
  authorizationParams: {
    audience: import.meta.env.VITE_SOLID_APP_AUDIENCE,
    redirect_uri: window.location.origin,
    max_age: 12 * 3600,
    ui_locales: 'en',
  },
};

render(
  () => (
    <AuthProvider clientOptions={options}>
      <App />
    </AuthProvider>
  ),
  root!,
);
```

### `AuthProvider` Component

The `AuthProvider` component wraps your SolidJS application and provides access to the authentication context for its child components. It requires the `clientOptions` prop, which should contain your Auth0 domain, client ID, and any other Auth0-specific parameters you need.

```tsx
<AuthProvider clientOptions={options}>
  <App />
</AuthProvider>
```

### `AuthOptions` Interface

You can configure the authentication options by passing an object of type `AuthOptions` (an alias of [`Auth0ClientOptions`](https://auth0.github.io/auth0-spa-js/interfaces/Auth0ClientOptions.html)) to the `AuthProvider`. This object includes settings like `domain`, `clientId`, and `authorizationParams`.

## API Reference

The library exposes the follwing interfaces and components:

- `AuthProvider`
- `AuthContext`
- `useAuthContext`
- `OAuthError`

And from [`auth0-spa-js`](https://auth0.github.io/auth0-spa-js/index.html):

- `User`
- `InMemoryCache`
- `LocalStorageCache`
- `TimeoutError`
- `MfaRequiredError`
- `PopupCancelledError`
- `PopupTimeoutError`
- `AuthenticationError`
- `MissingRefreshTokenError`
- `GenericError`
- `AuthorizationParams`
- `PopupLoginOptions`
- `PopupConfigOptions`
- `GetTokenWithPopupOptions`
- `LogoutUrlOptions`
- `CacheLocation`
- `GetTokenSilentlyOptions`
- `IdToken`
- `ICache`
- `Cacheable`

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements, bug fixes, or new features. Be sure to follow best practices and ensure all tests pass before submitting.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgements

This library is a modified port of [`auth0-react`](https://github.com/auth0/auth0-react) and is built to support SolidJS applications. All credit for the original [`auth0-react`](https://github.com/auth0/auth0-react) library goes to the Auth0 team.

## Disclaimer

Please note: This library is by no means a professional or production-ready solution. It was developed out of necessity for personal projects, and it may not meet the quality or stability standards required for a fully-fledged production environment. It is intended for personal use and experimentation, and contributions are highly encouraged to improve its functionality and stability.
