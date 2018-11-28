import * as React from 'react';
import { Link } from '@reach/router';
const styles = require('./nav-user-dropdown.css');
const appStyles = require('../app-nav.css');

export class NavUserDropdownMenu extends React.Component {
  public render() {
    return (
      <ul className={styles.menu}>
        <li>
          <Link
            to="/logout"
            className={[appStyles.link, styles.menuItem].join(' ')}
          >
            logout
          </Link>
        </li>
      </ul>
    );
  }
}
