import * as React from 'react';
import { Link } from '@reach/router';
import { IUser } from 'types';

interface NavUserDropdownMenuProps {
  user: IUser;
}

export class NavUserDropdownMenu extends React.Component<
  NavUserDropdownMenuProps
> {
  public render() {
    const { user } = this.props;
    return (
      <ul>
        <li>
          <Link to={`/users/${user.username}`}>My Profile</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    );
  }
}
