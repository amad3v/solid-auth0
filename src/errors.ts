/**
 * An OAuth2 error will come from the authorization server and will have at least an `error` property which will
 * be the error code. And possibly an `error_description` property
 *
 * @see: {@link https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.2.6 | OpenID}
 */
export class OAuthError extends Error {
  constructor(
    public error: string,
    public error_description?: string,
  ) {
    super(error_description || error);

    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, OAuthError.prototype);
  }
}
