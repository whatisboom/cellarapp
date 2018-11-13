import * as React from 'react';
import { Router, Link } from '@reach/router';
import { Home } from './Home';
import { Users } from './Users';
import { UsersList } from './UsersList';
import { UserDetails } from './UserDetails';

export class App extends React.Component {
  public render() {
    return (
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="users">Users</Link>
        </nav>
        <Router>
          <Home path="/" />
          <Users path="users">
            <UsersList default path="/" />
            <UserDetails path=":userId" />
          </Users>
        </Router>
      </div>
    );
  }
}
