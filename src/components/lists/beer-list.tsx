import * as React from 'react';
import { IBeer } from '../../types';
import { BeerListItem } from './beer-list-item';

interface IBeerListProps {
  beers: IBeer[];
}

export class BeerList extends React.Component<IBeerListProps> {
  public render() {
    const list = this.props.beers.map(beer => (
      <BeerListItem key={beer._id} beer={beer} />
    ));
    return (
      <nav>
        <ul>{list}</ul>
      </nav>
    );
  }
}
