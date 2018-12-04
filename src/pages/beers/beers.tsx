import * as React from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { BeersListContainer, BeerDetails } from './index';

export class Beers extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Router>
        <BeersListContainer default path="/" />
        <BeerDetails path=":slug" />
      </Router>
    );
  }
}
