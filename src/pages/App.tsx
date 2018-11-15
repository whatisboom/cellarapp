import * as React from 'react';
import { Router, Link } from '@reach/router';
import { Home } from './Home';
import { Beers } from './Beers';
import { BeersListContainer } from './BeersList';
import { BeerDetails } from './BeerDetails';
import { Users } from './Users';
import { UsersListContainer } from './UsersList';
import { UserDetails } from './UserDetails';
import { Signup } from './Signup';
import { Signin } from './Signin';
import { Dashboard } from './Dashboard';
import { AppNav } from '../components/nav/app-nav';

export class App extends React.Component {
  public render() {
    return (
      <div>
        <AppNav />
        <Router>
          <Home path="/" />
          <Signup path="signup" />
          <Signin path="signin" />
          <Dashboard path="dashboard" />
          <Beers path="beers">
            <BeersListContainer default path="/" />
            <BeerDetails path=":beerId" />
          </Beers>
          <Users path="users">
            <UsersListContainer default path="/" />
            <UserDetails path=":userId" />
          </Users>
        </Router>
      </div>
    );
  }
}
