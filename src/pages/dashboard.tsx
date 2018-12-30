import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { CellarApiResource } from 'services/api';
import { IUserResponse, IUser, IQuantity } from 'types';
import UserCard from 'components/cards/user-card';
import Inventory from 'components/lists/inventory/inventory';
import { Loader } from 'components/loaders';
import { connect } from 'react-redux';
import { BEER_UPDATE_INVENTORY_QUANTITY } from 'actions';
import { Grid } from '@material-ui/core';

interface DashboardProps {
  signin: (user: IUser) => void;
  user: IUser;
  updateQuantityNotification?: (updated: IQuantity) => void;
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
          <Inventory
            beers={user.owned}
            update={this.updateOwnedQuantity.bind(this)}
          />
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

  private updateOwnedQuantity(updated: IQuantity) {
    const { user } = this.props;
    const rows = user.owned;
    const owned = rows.find((row) => row.beer._id === updated.beer.toString());
    owned.amount = updated.amount;
    this.props.updateQuantityNotification(owned);
  }
}

function mapDispatchToProps(dispatch: React.Dispatch<any>) {
  return {
    updateQuantityNotification(updated: IQuantity): void {
      dispatch({
        type: BEER_UPDATE_INVENTORY_QUANTITY,
        updated
      });
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Dashboard);
