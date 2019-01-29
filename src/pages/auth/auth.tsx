import * as React from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import SignupSignin from './signup';
import OAuthUntappd from './untappd';

export default class Auth extends React.Component<RouteComponentProps> {
  render() {
    return (
      <Router>
        <SignupSignin default path="/" />
        <OAuthUntappd path="oauth/untappd" />
      </Router>
    );
  }
}
