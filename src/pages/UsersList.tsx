import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { IUsersResponse } from '../types';
export class UsersList extends React.Component<RouteComponentProps> {
  public state: IUsersResponse = {
    users: []
  };

  public users = new CellarApiResource({
    path: '/users'
  });

  public render() {
    const list = this.state.users.map(user => {
      return (
        <Link to={user._id} key={user._id}>
          {user.username}
        </Link>
      );
    });
    return <nav>{list}</nav>;
  }
  public async componentDidMount() {
    try {
      const { users } = await this.users.list();
      this.setState({
        users
      });
    } catch (e) {}
  }
}
