import * as React from 'react';
import { Link } from '@reach/router';
const styles = require('./app-nav.css');

export class AppNav extends React.Component {
  render() {
    return (
      <nav className={styles.nav}>
        <span className={styles.section}>
          <Link to="/" className={styles.link}>
            Home
          </Link>
          <Link to="users" className={styles.link}>
            Users
          </Link>
          <Link to="beers" className={styles.link}>
            Beers
          </Link>
        </span>
        <span className={[styles.section, styles.justifyEnd].join(' ')}>
          <Link to="signin" className={styles.link}>
            Signin
          </Link>
          <Link to="signup" className={styles.link}>
            Signup
          </Link>
        </span>
      </nav>
    );
  }
}
