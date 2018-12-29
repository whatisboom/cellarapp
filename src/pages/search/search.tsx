import * as React from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import BeerSearch from './beers';

export default class Search extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <Router>
        <BeerSearch path="beers" />
      </Router>
    );
  }
}
