import * as React from 'react';
import { connect } from 'react-redux';
import { Router } from '@reach/router';

import Home from './home';
const Auth = React.lazy(() =>
  import(/* webpackChunkName: "auth" */ './auth/auth')
);
const Beers = React.lazy(() =>
  import(/* webpackChunkName: "beers" */ './beers/beers')
);
const Search = React.lazy(() =>
  import(/* webpackChunkName: "search" */ './search/search')
);
const Users = React.lazy(() =>
  import(/* webpackChunkName: "users" */ './users/users')
);
const Breweries = React.lazy(() =>
  import(/* webpackChunkName: "breweries" */ './breweries/breweries')
);
import Logout from './logout';
const Dashboard = React.lazy(() =>
  import(/* webpackChunkName: "dashboard" */ './dashboard')
);
import { AppNav } from 'components/nav';
import { Notification } from 'components/notification';
import { AuthService } from 'services/auth';
import { CellarApiResource } from 'services/api';
import CssBaseline from '@material-ui/core/CssBaseline';
import { LOGOUT, UPDATE_LOGGED_IN_USER } from 'actions';
import { IUserResponse, IUser } from 'types';
import { Loader } from 'components/loaders';

interface AppProps {
  signedInUser?: IUser;
  signin: (user: IUser) => void;
  logout: () => void;
  notifications: Array<{
    id: string;
    text: string;
  }>;
}

interface AppState {
  loading: boolean;
}

export class App extends React.Component<AppProps> {
  public state: AppState = {
    loading: true
  };
  public async componentDidMount() {
    const isAuthedticated = AuthService.isAuthenticated();
    if (isAuthedticated) {
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
  public render() {
    const { signedInUser } = this.props;
    const { loading } = this.state;

    if (loading) {
      return <Loader />;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Router primary={false}>
          <AppNav path=":page/*" signedInUser={signedInUser} />
        </Router>
        <Router>
          <Home path="/" />
        </Router>
        <div style={{ paddingTop: '60px' }}>
          <React.Suspense fallback={<Loader />}>
            <Router>
              <Auth path="auth/*" />
              <Logout path="logout" logout={this.props.logout} />
              <Dashboard
                path="dashboard"
                user={signedInUser}
                signin={this.props.signin}
              />
              <Users path="users/*" />
              <Beers path="beers/*" />
              <Breweries path="breweries/*" />
              <Search path="search/*" />
            </Router>
            {this.props.notifications &&
              this.props.notifications.map((note) => (
                <Notification key={note.id} note={note} />
              ))}
          </React.Suspense>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state: any, ownProps: any) {
  const { notifications, user } = state;
  return {
    signedInUser: user,
    notifications
  };
}

function mapDispatchToProps(dispatch: any, ownProps: any) {
  return {
    signin: (user: IUser) => {
      dispatch({
        type: UPDATE_LOGGED_IN_USER,
        user
      });
    },
    logout: () => {
      dispatch({
        type: LOGOUT
      });
    }
  };
}

export const AppConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
