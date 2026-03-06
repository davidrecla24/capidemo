// Gmail OAuth adapter — isolated from core app
// TODO: Implement Google OAuth2 token exchange when credentials are ready

export interface GmailTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export async function exchangeCodeForTokens(
  _code: string,
  _clientId: string,
  _clientSecret: string,
  _redirectUri: string,
): Promise<GmailTokens> {
  throw new Error('Gmail OAuth not implemented yet');
}

export async function refreshAccessToken(
  _refreshToken: string,
  _clientId: string,
  _clientSecret: string,
): Promise<GmailTokens> {
  throw new Error('Gmail OAuth not implemented yet');
}
