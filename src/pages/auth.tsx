import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { IUserResponse } from 'types';

export interface AuthState {
  loading: boolean;
}

export class Auth extends React.Component<RouteComponentProps> {
  public state: AuthState = {
    loading: true
  };

  private resource = new CellarApiResource<{ code: string }, IUserResponse>({
    path: '/auth/oauth/untappd'
  });

  public async componentWillMount() {
    this.getCode();
  }

  public async getCode() {
    const code = this.parseQS(this.props.location.search).get('code');
    try {
      const response: IUserResponse = await this.resource.create({
        code
      });
      this.setState({
        loading: false
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
