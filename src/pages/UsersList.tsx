import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { Loader } from '../components/loaders/loader';
import { IUserResponse, IUser } from '../types';

interface IComponentState {
  users?: IUser[];
  loading: boolean;
}

export class UsersListContainer extends React.Component<RouteComponentProps> {
  public state: IComponentState = {
    loading: true
  };

  public resource = new CellarApiResource<null, IUserResponse>({
    path: '/users'
  });

  public render() {
    const { loading, users } = this.state;
    if (loading) {
      return <Loader />;
    }
    const list = users.map(user => {
      return (
        <li key={user._id}>
          <Link to={user._id}>{user.username}</Link>
        </li>
      );
    });
    return (
      <div>
        <h1>Users</h1>
        <nav>{list}</nav>
      </div>
    );
  }
  public async componentDidMount() {
    try {
      const { users } = await this.resource.list();
      this.setState({
        users,
        loading: false
      });
    } catch (e) {}
  }
}
