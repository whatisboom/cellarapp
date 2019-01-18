import { ILoginResponse } from 'types';
import {
  JWT_KEY,
  REFRESH_TOKEN_KEY,
  getJWT,
  decodeJWT,
  isJWTValid,
  refreshToken
} from './jwt';

export const AuthService = {
  async getJWT() {
    const token = await getJWT();
    this.saveTokens({ token });
    return token;
  },
  logout() {},
  async saveTokens({ token, refreshToken }: ILoginResponse): Promise<void> {
    if (token) {
      localStorage.setItem(JWT_KEY, token);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },
  async deleteTokens(): Promise<void> {
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  isAuthenticated() {
    return isJWTValid();
  },
  decodeJWT,
  refreshToken
};
