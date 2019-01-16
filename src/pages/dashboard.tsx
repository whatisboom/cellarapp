import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { CellarApiResource } from 'services/api';
import { IUserResponse, IUser, IOwned } from 'types';
import UserCard from 'components/cards/user-card';
import Inventory from 'components/lists/inventory/inventory';
import { Loader } from 'components/loaders';
import { Grid } from '@material-ui/core';

interface DashboardProps {
  signin: (user: IUser) => void;
  user: IUser;
  updateQuantityNotification?: (updated: IOwned) => void;
}

interface DashboardState {
  loading: boolean;
}

export class Dashboard extends React.Component<
  RouteComponentProps<DashboardProps>
> {
  public state: DashboardState = {
    loading: true
  };
  public render() {
    const { user } = this.props;
    if (this.state.loading || user === null) {
      return <Loader />;
    }

    return (
      <Grid container>
        <Grid item xs={12} sm={6} md={4}>
          <UserCard user={user} />
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <Inventory beers={user.owned} />
        </Grid>
      </Grid>
    );
  }

  public async componentDidMount() {
    const me = new CellarApiResource<null, IUserResponse>({
      path: '/users/me'
    });
    const { user } = await me.read();
    this.props.signin(user);
    this.setState({
      loading: false
    });
  }
}

export default Dashboard;
