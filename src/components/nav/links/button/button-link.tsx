import * as React from 'react';
import { Link } from '@reach/router';

export interface ButtonLinkProps {
  to: string;
}

export class ButtonLink extends React.Component<ButtonLinkProps> {
  public render() {
    const { children, to } = this.props;
    return <Link to={to}>{children}</Link>;
  }
}
