import * as React from 'react';
import { AuthenticatedNav, UnauthenticatedNav } from './index';
import { IUser } from '../../../types';
interface IComponentProps {
  signedInUser: IUser;
}

export class AppNav extends React.Component<IComponentProps> {
  render() {
    const { signedInUser } = this.props;
    return signedInUser ? (
      <AuthenticatedNav user={signedInUser} />
    ) : (
      <UnauthenticatedNav />
    );
  }
}
