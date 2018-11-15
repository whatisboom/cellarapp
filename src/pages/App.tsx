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
import { AuthService } from '../services/auth';

export class App extends React.Component {
  public render() {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="users">Users</Link>
            </li>
            <li>
              <Link to="beers">Beers</Link>
            </li>
            <li>
              <Link to="signin">Signin</Link>
            </li>
            <li>
              <Link to="signup">Signup</Link>
            </li>
          </ul>
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
