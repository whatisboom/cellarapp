import * as React from 'react';
import { Link } from '@reach/router';
const styles = require('./button-link.css');

export interface ButtonLinkProps {
  to: string;
}

export class ButtonLink extends React.Component<ButtonLinkProps> {
  public render() {
    const { children, to } = this.props;
    return (
      <Link className={styles.button} to={to}>
        {children}
      </Link>
    );
  }
}
