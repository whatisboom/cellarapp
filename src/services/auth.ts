import { ILoginResponse } from 'types';
import {
  JWT_KEY,
  REFRESH_TOKEN_KEY,
  getJWT,
  decodeJWT,
  isJWTValid,
  refreshToken
} from './jwt';
import { navigate } from '@reach/router';

export const AuthService = {
  async getJWT() {
    try {
      const token = await getJWT();
      this.saveTokens({ token });
      return token;
    } catch (e) {
      navigate('/auth');
    }
  },
  async logout(): Promise<void> {
    this.deleteTokens();
  },
  async saveTokens({ token, refreshToken }: ILoginResponse): Promise<void> {
    if (token) {
      localStorage.setItem(JWT_KEY, token);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },
  deleteTokens(): void {
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  isAuthenticated() {
    return isJWTValid();
  },
  decodeJWT,
  refreshToken
};
