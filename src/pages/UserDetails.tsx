import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { IUser, IUserResponse } from 'types';
import { CellarApiResource } from '../services/api';

interface IComponentState {
  user?: IUser;
  loading: boolean;
}

export class UserDetails extends React.Component<
  RouteComponentProps<{
    userId: string;
  }>
> {
  public state: IComponentState = {
    loading: true
  };

  public resource = new CellarApiResource<
    {
      _id: string;
    },
    IUserResponse
  >({
    path: '/users/:_id'
  });

  public render() {
    const { loading, user } = this.state;
    if (loading) {
      return 'loading';
    }
    return `${user.username} (${user.role})`;
  }

  public async componentDidMount() {
    try {
      const { user } = await this.resource.read({
        _id: this.props.userId
      });
      this.setState({
        user,
        loading: false
      });
    } catch (e) {}
  }
}
