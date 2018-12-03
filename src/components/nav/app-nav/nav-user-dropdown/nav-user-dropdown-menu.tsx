import * as React from 'react';
import { Link } from '@reach/router';

export class NavUserDropdownMenu extends React.Component {
  public render() {
    return (
      <ul>
        <li>
          <Link to="/logout">logout</Link>
        </li>
      </ul>
    );
  }
}
