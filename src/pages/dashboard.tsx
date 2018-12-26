import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { IUserResponse, IUser } from 'types';
import UserCard from '../components/cards/user-card';
import Inventory from '../components/lists/inventory/inventory';
import { Loader } from '../components/loaders';

interface DashboardProps {
  signin: (user: IUser) => void;
  user: IUser;
}

interface DashboardState {
  loading: boolean;
}

export default class Dashboard extends React.Component<
  RouteComponentProps<DashboardProps>
> {
  public state: DashboardState = {
    loading: true
  };
  public render() {
    const { user } = this.props;

    if (this.state.loading) {
      return <Loader />;
    }

    return (
      <React.Fragment>
        <UserCard user={user} />
        <Inventory beers={user.owned} />
      </React.Fragment>
    );
  }

  public async componentDidMount() {
    const { user } = this.props;
    if (!user) {
      const me = new CellarApiResource<null, IUserResponse>({
        path: '/users/me'
      });
      const { user } = await me.read();
      this.props.signin(user);
    }
    this.setState({
      loading: false
    });
  }
}
