import { navigate } from '@reach/router';

export const JWT_KEY: string = 'beercellarjwt';
export const REFRESH_TOKEN_KEY: string = 'beercellarrefresh';
export async function getJWT(): Promise<string> {
  if (isJWTValid()) {
    return localStorage.getItem(JWT_KEY);
  } else {
    try {
      const { token } = await refreshToken();
      return token;
    } catch (e) {
      navigate('/auth');
    }
  }
}

export function decodeJWT(): any {
  const jwt: string = localStorage.getItem(JWT_KEY);
  if (!jwt) {
    return false;
  }
  const payload: string = jwt.split('.')[1];
  return JSON.parse(atob(payload));
}

export async function refreshToken(): Promise<{ token: string }> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const body: string = JSON.stringify({
    refreshToken
  });
  return fetch(`${process.env.API_HOST}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  }).then((response) => response.json());
}

export function isJWTValid(): boolean {
  const claims = decodeJWT();
  if (!claims) {
    return false;
  }
  const expires = new Date(claims.exp * 1000);
  const now = new Date();
  return expires.getTime() > now.getTime();
}
