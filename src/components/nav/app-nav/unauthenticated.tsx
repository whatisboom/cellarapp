import * as React from 'react';
import { Link } from '@reach/router';
const styles = require('./app-nav.css');

export class UnauthenticatedNav extends React.Component {
  public render() {
    return (
      <nav className={styles.nav}>
        <span className={styles.section}>
          <Link to="/" className={styles.link}>
            <span className={styles.logo}>bc</span>
          </Link>
        </span>
        <span className={[styles.section, styles.justifyEnd].join(' ')}>
          <Link to="/signin" className={styles.link}>
            Signin
          </Link>
          <Link to="/signup" className={styles.link}>
            Signup
          </Link>
        </span>
      </nav>
    );
  }
}
