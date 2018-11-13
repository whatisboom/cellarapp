import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';

export class UsersList extends React.Component<RouteComponentProps> {
  public users = [
    {
      id: '1234567890',
      username: 'whatisboom'
    }
  ];
  public render() {
    const result = this.users.map(user => {
      return (
        <Link to={user.id} key={user.id}>
          {user.username}
        </Link>
      );
    });
    return <nav>{result}</nav>;
  }
}
