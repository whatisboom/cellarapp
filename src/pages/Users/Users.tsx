import * as React from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { UserDetails } from './index';
import UsersList from './users-list';
export class Users extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Router>
        <UsersList default path="/" />
        <UserDetails path=":username" />
      </Router>
    );
  }
}
