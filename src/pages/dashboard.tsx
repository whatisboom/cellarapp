import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { IUserResponse, IUser, IQuantity } from 'types';
import UserCard from '../components/cards/user-card';
import Inventory from '../components/lists/inventory/inventory';
import { Loader } from '../components/loaders';
import { connect } from 'react-redux';
import { BEER_UPDATE_INVENTORY_QUANTITY } from '../actions';

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

    if (this.state.loading) {
      return <Loader />;
    }

    return (
      <React.Fragment>
        <UserCard user={user} />
        <Inventory
          beers={user.owned}
          update={this.updateOwnedQuantity.bind(this)}
        />
      </React.Fragment>
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

function mapDispatchToProps(dispatch: any, ownProps: DashboardProps) {
  return {
    updateQuantityNotification: (updated: IQuantity): void => {
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
