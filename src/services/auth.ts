import { CellarApiResource } from './api';
import {
  ILoginResponse,
  ISigninForm,
  ISignupForm,
  IUserResponse
} from '../types';
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
    return endpoints.signin.create(payload);
  },
  async signup(payload: ISignupForm): Promise<ILoginResponse> {
    return endpoints.signup.create(payload).then(
      async (): Promise<ILoginResponse> => {
        return await this.signin(payload);
      }
    );
  },
  saveTokens({ token, refreshToken }: ILoginResponse): void {
    localStorage.setItem(JWT_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  isAuthenticated() {
    return isJWTValid();
  },
  getJWT,
  decodeJWT,
  refreshToken
};
