import * as React from 'react';
import { Link } from '@reach/router';
import { NavUserDropdown } from './nav-user-dropdown';

interface IComponentProps {
  user: any;
}

export class AuthenticatedNav extends React.Component<IComponentProps> {
  public render() {
    return (
      <nav>
        <span>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/users">Users</Link>
          <Link to="/breweries">Breweries</Link>
          <Link to="/beers">Beers</Link>
        </span>
        <NavUserDropdown user={this.props.user} />
      </nav>
    );
  }
}
