import * as React from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { UserDetails, UsersListContainer } from './index';
export class Users extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Router>
        <UsersListContainer default path="/" />
        <UserDetails path=":username" />
      </Router>
    );
  }
}
