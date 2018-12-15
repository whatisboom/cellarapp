import * as React from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { BeersListContainer, BeerDetails, BeerSearch } from './index';

export class Beers extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Router>
        <BeersListContainer default path="/" />
        <BeerSearch path="search" />
        <BeerDetails path=":slug" />
      </Router>
    );
  }
}
