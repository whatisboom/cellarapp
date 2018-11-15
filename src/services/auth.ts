import { CellarApiResource, IResourcePayload } from './api';
import { ILoginResponse, ISigninForm, ISignupForm } from '../types';
import {
  JWT_KEY,
  REFRESH_TOKEN_KEY,
  getJWT,
  decodeJWT,
  refreshToken
} from './jwt';

const endpoints = {
  signup: new CellarApiResource({
    path: '/auth/signup'
  }),
  signin: new CellarApiResource({
    path: '/auth/signin'
  })
};

export const AuthService = {
  async signin(payload: ISigninForm): Promise<ILoginResponse> {
    return endpoints.signin.create(<IResourcePayload>(<unknown>payload));
  },
  async signup(payload: ISignupForm): Promise<ILoginResponse> {
    return endpoints.signup.create(<IResourcePayload>(<unknown>payload)).then(
      async (): Promise<ILoginResponse> => {
        return await this.signin(payload);
      }
    );
  },
  saveTokens({ token, refreshToken }: ILoginResponse): void {
    localStorage.setItem(JWT_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  getJWT,
  decodeJWT,
  refreshToken
};
