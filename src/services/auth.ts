import { CellarApiResource } from './api';

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
  async login(payload) {
    return endpoints.signin.create(payload);
  },
  async signup(payload): Promise<ILoginResponse> {
    return endpoints.signup.create(payload).then(
      async (): Promise<ILoginResponse> => {
        return await this.login(payload);
      }
    );
  },
  saveTokens({ token, refreshToken }): void {
    localStorage.setItem(JWT_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  getJWT(): string {
    // if jwt is expired, get a new one?
    return localStorage.getItem(JWT_KEY);
  },
  refreshToken(): void {}
};
