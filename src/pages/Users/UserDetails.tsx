import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { IUser, IUserResponse } from 'types';
import { CellarApiResource } from '../../services/api';
import { Loader } from '../../components/loaders/loader';

interface IComponentState {
  user?: IUser;
  loading: boolean;
}

export class UserDetails extends React.Component<
  RouteComponentProps<{
    username: string;
  }>
> {
  public state: IComponentState = {
    loading: true
  };

  public resource = new CellarApiResource<
    {
      username: string;
    },
    IUserResponse
  >({
    path: '/users/:username'
  });

  public render() {
    const { loading, user } = this.state;
    if (loading) {
      return <Loader />;
    }
    return `${user.username} (${user.role})`;
  }

  public async componentDidMount() {
    try {
      const { user } = await this.resource.read({
        username: this.props.username
      });
      this.setState({
        user,
        loading: false
      });
    } catch (e) {}
  }
}
