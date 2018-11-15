export const JWT_KEY: string = 'beercellarjwt';
export const REFRESH_TOKEN_KEY: string = 'beercellarrefresh';
export function getJWT(): string {
  // if jwt is expired, get a new one?
  return localStorage.getItem(JWT_KEY);
}
export function decodeJWT(): any {
  const jwt: string = this.getJWT();
  const payload: string = jwt.split('.')[1];
  return atob(payload);
}
export function refreshToken(): void {}
