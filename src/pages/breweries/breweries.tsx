import * as React from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { BreweriesListContainer, BreweryDetails } from './index';

export class Breweries extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Router>
        <BreweriesListContainer default path="/" />
        <BreweryDetails path=":slug" />
      </Router>
    );
  }
}
