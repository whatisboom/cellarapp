import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { AuthenticatedNav, UnauthenticatedNav } from './index';
import { IUser } from '../../../types';
interface IComponentProps {
  signedInUser: IUser;
}

export class AppNav extends React.Component<
  RouteComponentProps<IComponentProps>
> {
  render() {
    const { signedInUser } = this.props;
    return signedInUser ? (
      <AuthenticatedNav user={signedInUser} />
    ) : (
      <UnauthenticatedNav />
    );
  }
}
