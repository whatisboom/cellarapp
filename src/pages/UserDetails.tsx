import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { IUserResponse } from 'types';
import { CellarApiResource } from '../services/api';

export class UserDetails extends React.Component<
  RouteComponentProps<{
    userId: string;
  }>
> {
  public state: any = {
    user: {},
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
    return this.state.loading ? 'loading' : this.state.user.username;
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
