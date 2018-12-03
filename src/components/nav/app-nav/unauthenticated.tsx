import * as React from 'react';
import { Link } from '@reach/router';

export class UnauthenticatedNav extends React.Component {
  public render() {
    return (
      <nav>
        <span>
          <Link to="/">
            <span>bc</span>
          </Link>
        </span>
        <span>
          <Link to="/signin">Signin</Link>
          <Link to="/signup">Signup</Link>
        </span>
      </nav>
    );
  }
}
