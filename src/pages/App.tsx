import * as React from 'react';
import { connect } from 'react-redux';
import { Router, Link } from '@reach/router';
import { Home } from './Home';
import { Beers, BeersListContainer, BeerDetails } from './Beers';
import { Users, UsersListContainer, UserDetails } from './Users';
import { Breweries, BreweriesListContainer, BreweryDetails } from './Breweries';
import { Signup } from './Signup';
import { Signin } from './Signin';
import { Logout } from './Logout';
import { Dashboard } from './Dashboard';
import { AppNav } from '../components/nav/app-nav';
import { AuthService } from '../services/auth';
import { CellarApiResource } from '../services/api';
import { IUserResponse, IUser } from '../types';

interface IComponentProps {
  signedInUser?: any;
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
      <div>
        <AppNav signedInUser={signedInUser} />
        <Router>
          <Home path="/" />
          <Signup path="signup" />
          <Signin path="signin" />
          <Logout path="logout" logout={this.props.logout} />
          <Dashboard path="dashboard" signin={this.props.signin} />
          <Users path="users">
            <UsersListContainer default path="/" />
            <UserDetails path=":username" />
          </Users>
          <Beers path="beers">
            <BeersListContainer default path="/" />
            <BeerDetails path=":slug" />
          </Beers>
          <Breweries path="breweries">
            <BreweriesListContainer default path="/" />
            <BreweryDetails path=":slug" />
          </Breweries>
        </Router>
      </div>
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
