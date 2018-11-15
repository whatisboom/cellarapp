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

export class App extends React.Component {
  public render() {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="signin">Signin</Link>
          <Link to="signup">Signup</Link>
          <Link to="users">Users</Link>
        </nav>
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
