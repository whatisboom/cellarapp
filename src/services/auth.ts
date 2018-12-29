import { CellarApiResource } from './api';
import { ILoginResponse, ISigninForm, ISignupForm, IUserResponse } from 'types';
import {
  JWT_KEY,
  REFRESH_TOKEN_KEY,
  getJWT,
  decodeJWT,
  isJWTValid,
  refreshToken
} from './jwt';

const endpoints = {
  signup: new CellarApiResource<ISignupForm, IUserResponse>({
    path: '/auth/signup'
  }),
  signin: new CellarApiResource<ISigninForm, ILoginResponse>({
    path: '/auth/signin'
  })
};

export const AuthService = {
  async signin(payload: ISigninForm): Promise<ILoginResponse> {
    try {
      return endpoints.signin.create(payload);
    } catch (e) {
      return e;
    }
  },
  async signup(payload: ISignupForm): Promise<ILoginResponse> {
    return endpoints.signup.create(payload).then(
      async (): Promise<ILoginResponse> => {
        return await this.signin(payload);
      }
    );
  },
  logout() {},
  async saveTokens({ token, refreshToken }: ILoginResponse): Promise<void> {
    localStorage.setItem(JWT_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  async deleteTokens(): Promise<void> {
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  isAuthenticated() {
    return isJWTValid();
  },
  getJWT,
  decodeJWT,
  refreshToken
};
