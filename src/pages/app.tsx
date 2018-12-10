import * as React from 'react';
import { connect } from 'react-redux';
import { Router } from '@reach/router';

import { Home } from './home';
import { Auth } from './auth';
import { Beers } from './beers';
import { Users } from './users';
import { Breweries } from './breweries';
import { Signup } from './signup';
import { Signin } from './signin';
import { Logout } from './logout';
import Dashboard from './dashboard';
import { AppNav } from '../components/nav';
import { AuthService } from '../services/auth';
import { CellarApiResource } from '../services/api';
import CssBaseline from '@material-ui/core/CssBaseline';

import { IUserResponse, IUser } from '../types';

interface IComponentProps {
  signedInUser?: IUser;
  signin: (user: IUser) => void;
  logout: () => void;
}

export class App extends React.Component<IComponentProps> {
  public async componentDidMount() {
    const isAuthedticated = AuthService.isAuthenticated();
    if (isAuthedticated) {
      const me = new CellarApiResource<null, IUserResponse>({
        path: '/users/me'
      });
      const { user } = await me.read();
      this.props.signin(user);
    }
  }
  public render() {
    const { signedInUser } = this.props;
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
          <Router>
            <Auth path="auth/*" />
            <Signup path="signup" />
            <Signin path="signin" />
            <Logout path="logout" logout={this.props.logout} />
            <Dashboard path="dashboard" signin={this.props.signin} />
            <Users path="users/*" />
            <Beers path="beers/*" />
            <Breweries path="breweries/*" />
          </Router>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state: any, ownProps: any) {
  return {
    signedInUser: state.user
  };
}

function mapDispatchToProps(dispatch: any, ownProps: any) {
  return {
    signin: (user: IUser) => {
      dispatch({
        type: 'SIGNIN',
        user
      });
    },
    logout: () => {
      dispatch({
        type: 'LOGOUT'
      });
    }
  };
}

export const AppConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
