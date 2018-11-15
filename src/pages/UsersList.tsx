import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { IUserResponse, IUsersResponse } from '../types';
export class UsersList extends React.Component<RouteComponentProps> {
  public state: IUsersResponse = {
    users: []
  };

  public resource = new CellarApiResource<null, IUserResponse>({
    path: '/users'
  });

  public render() {
    const list = this.state.users.map(user => {
      return (
        <li key={user._id}>
          <Link to={user._id}>{user.username}</Link>
        </li>
      );
    });
    return <nav>{list}</nav>;
  }
  public async componentDidMount() {
    try {
      const { users } = await this.resource.list();
      this.setState({
        users
      });
    } catch (e) {}
  }
}
