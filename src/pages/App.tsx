import * as React from 'react';
import { Router, Link } from '@reach/router';
import { Home } from './Home';
import { Beers, BeersListContainer, BeerDetails } from './Beers';
import { Users, UsersListContainer, UserDetails } from './Users';
import { Breweries, BreweriesListContainer, BreweryDetails } from './Breweries';
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
          <Users path="users">
            <UsersListContainer default path="/" />
            <UserDetails path=":userId" />
          </Users>
          <Beers path="beers">
            <BeersListContainer default path="/" />
            <BeerDetails path=":beerId" />
          </Beers>
          <Breweries path="breweries">
            <BreweriesListContainer default path="/" />
            <BreweryDetails path=":breweryId" />
          </Breweries>
        </Router>
      </div>
    );
  }
}
