import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { IUserResponse, IUser } from 'types';
import Loader from '../components/loaders/loader';
import { WithStyles, withStyles } from '@material-ui/core/styles';

interface DashboardProps extends WithStyles {
  signin: (user: IUser) => void;
}

interface IComponentState {
  user?: IUser;
  loading: boolean;
}

export class Dashboard extends React.Component<
  RouteComponentProps<DashboardProps>
> {
  public state: IComponentState = {
    loading: true
  };

  public me = new CellarApiResource<null, IUserResponse>({
    path: '/users/me'
  });

  public render() {
    const { user, loading } = this.state;
    if (loading) {
      return <Loader />;
    }
    return <h1>{user.username}</h1>;
  }

  public async componentDidMount() {
    try {
      const { user } = await this.me.read();
      this.setState({
        user,
        loading: false
      });
      this.props.signin(user);
    } catch (e) {}
  }
}

export default withStyles({})(Dashboard);
