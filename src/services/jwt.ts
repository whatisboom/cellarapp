export const JWT_KEY: string = 'beercellarjwt';
export const REFRESH_TOKEN_KEY: string = 'beercellarrefresh';
export function getJWT(): string {
  // if jwt is expired, get a new one?
  return localStorage.getItem(JWT_KEY);
}

export function decodeJWT(): any {
  const jwt: string = getJWT();
  if (!jwt) {
    return false;
  }
  const payload: string = jwt.split('.')[1];
  return JSON.parse(atob(payload));
}

export function refreshToken(): void {}

export function isJWTValid(): boolean {
  const claims = decodeJWT();
  if (!claims) {
    return false;
  }
  const expires = new Date(claims.exp * 1000);
  const now = new Date();
  return expires.getTime() > now.getTime();
}
