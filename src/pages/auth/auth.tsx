import * as React from 'react';
import { RouteComponentProps, navigate, Router } from '@reach/router';
import { AuthService, CellarApiResource } from '../../services';
import { ILoginResponse } from '../../types';

export interface AuthState {
  loading: boolean;
}

export class Auth extends React.Component<RouteComponentProps> {
  render() {
    return (
      <Router>
        <SignupSignin default path="/" />
        <OAuthUntappd path="oauth/untappd" />
      </Router>
    );
  }
}

export class SignupSignin extends React.Component<RouteComponentProps> {
  render() {
    return (
      <div>
        <a
          href={`https://untappd.com/oauth/authenticate/?client_id=${
            process.env.UNTAPPD_CLIENT_ID
          }&response_type=code&redirect_url=${
            process.env.UNTAPPD_REDIRECT_URL
          }`}
        >
          Authenticate via Untappd
        </a>
      </div>
    );
  }
}

export class OAuthUntappd extends React.Component<RouteComponentProps> {
  public state: AuthState = {
    loading: true
  };

  private resource = new CellarApiResource<{ code: string }, ILoginResponse>({
    path: '/auth/oauth/untappd'
  });

  public async componentWillMount() {
    const response = await this.getCode();
    AuthService.saveTokens(response);
    this.setState({
      loading: false
    });
    navigate('/dashboard');
  }

  public async getCode(): Promise<ILoginResponse> {
    const code = this.parseQS(this.props.location.search).get('code');
    try {
      return await this.resource.create({
        code
      });
    } catch (e) {}
  }

  public render() {
    return this.state.loading ? (
      <div>Authenticating...</div>
    ) : (
      <div>Successfully signed in! Redirecting to your dashboard!</div>
    );
  }

  private parseQS(str: string): Map<string, string> {
    const pieces: string[] = str.substr(1).split('&');
    const result: Map<string, string> = new Map();
    pieces.forEach((piece: string) => {
      const [key, value] = piece.split('=');
      result.set(key, value);
    });
    return result;
  }
}
