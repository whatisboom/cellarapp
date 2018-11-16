import * as React from 'react';
import { Link } from '@reach/router';
const styles = require('./app-nav.css');

interface IComponentProps {
  user: any;
}

export class AuthenticatedNav extends React.Component<IComponentProps> {
  public render() {
    return (
      <nav className={styles.nav}>
        <span className={styles.section}>
          <Link to="dashboard" className={styles.link}>
            Dashboard
          </Link>
          <Link to="users" className={styles.link}>
            Users
          </Link>
          <Link to="breweries" className={styles.link}>
            Breweries
          </Link>
          <Link to="beers" className={styles.link}>
            Beers
          </Link>
        </span>
        <span className={[styles.section, styles.justifyEnd].join(' ')}>
          <a className={styles.link}>{this.props.user.username}</a>
        </span>
      </nav>
    );
  }
}
