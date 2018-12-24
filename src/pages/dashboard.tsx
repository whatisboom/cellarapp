import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { IUserResponse, IUser } from 'types';
import UserCard from '../components/cards/user-card';
import Inventory from '../components/lists/inventory/inventory';

interface DashboardProps {
  signin: (user: IUser) => void;
  user: IUser;
}

export default class Dashboard extends React.Component<
  RouteComponentProps<DashboardProps>
> {
  public render() {
    const { user } = this.props;

    return (
      <React.Fragment>
        <UserCard user={user} />
        <Inventory beers={user.owned} />
      </React.Fragment>
    );
  }
}
