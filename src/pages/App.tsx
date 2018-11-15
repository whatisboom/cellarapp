import * as React from 'react';
import { Router, Link } from '@reach/router';
import { Home } from './Home';
import { Users } from './Users';
import { UsersList } from './UsersList';
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
          <Users path="users">
            <UsersList default path="/" />
            <UserDetails path=":userId" />
          </Users>
        </Router>
      </div>
    );
  }
}
