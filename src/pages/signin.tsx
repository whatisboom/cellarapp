import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { SigninForm } from '../components/signin/signin-form';

export class Signin extends React.Component<RouteComponentProps> {
  public render() {
    return <SigninForm />;
  }
}
