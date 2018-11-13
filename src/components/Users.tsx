import * as React from 'react';
import { RouteComponentProps } from '@reach/router';

export class Users extends React.Component<RouteComponentProps> {
  public render() {
    return this.props.children;
  }
}
