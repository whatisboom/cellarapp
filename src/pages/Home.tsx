import * as React from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { AuthService } from '../services/auth';

export class Home extends React.Component<RouteComponentProps> {
  public render() {
    if (AuthService.isAuthenticated()) {
      navigate('dashboard');
    }
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }
}
