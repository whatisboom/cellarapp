import { CellarApiResource, IResourcePayload } from './api';
import { ISigninForm, ISignupForm } from '../types';
const JWT_KEY: string = 'beercellarjwt';
const REFRESH_TOKEN_KEY: string = 'beercellarrefresh';

const endpoints = {
  signup: new CellarApiResource({
    path: '/auth/signup'
  }),
  signin: new CellarApiResource({
    path: '/auth/signin'
  })
};

export interface ILoginResponse {
  token: string;
  refreshToken: string;
}

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
  getJWT(): string {
    // if jwt is expired, get a new one?
    return localStorage.getItem(JWT_KEY);
  },
  decodeJWT(): any {
    const jwt: string = this.getJWT();
    const payload: string = jwt.split('.')[1];
    return atob(payload);
  },
  refreshToken(): void {}
};
