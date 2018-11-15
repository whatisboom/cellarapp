import * as React from 'react';
import { RouteComponentProps } from '@reach/router';

export class Breweries extends React.Component<RouteComponentProps> {
  public render() {
    return this.props.children;
  }
}
