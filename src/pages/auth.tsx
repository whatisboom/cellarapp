import * as React from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { ILoginResponse } from 'types';
import { AuthService } from '../services/auth';

export interface AuthState {
  loading: boolean;
}

export class Auth extends React.Component<RouteComponentProps> {
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
      <div>Creating account...</div>
    ) : (
      <div>Account created! Redirecting...</div>
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
