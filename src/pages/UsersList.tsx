import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { Loader } from '../components/loaders/loader';
import { IUserResponse, IUser } from '../types';
import { List } from '../components/lists/list';
import { ListItem } from '../components/lists/list-item';

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
    return (
      <div>
        <h1>Users</h1>
        <div>
          toolbar: <Link to="add">Add</Link>
        </div>
        {this.state.loading ? (
          <Loader />
        ) : (
          <List
            listItemComponent={ListItem}
            items={this.state.users}
            format="%username%"
          />
        )}
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
