import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { SignupForm } from '../components/signup/signup-form';

export class Signup extends React.Component<RouteComponentProps> {
  public render() {
    return <SignupForm />;
  }
}
