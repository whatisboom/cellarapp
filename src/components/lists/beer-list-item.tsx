import * as React from 'react';
import { IBeer } from '../../types';
import { Link } from '@reach/router';

interface IBeerListItemProps {
  beer: IBeer;
}

export class BeerListItem extends React.Component<IBeerListItemProps> {
  render() {
    const { beer } = this.props;
    let text = beer.name;
    if (beer.brewery && beer.brewery.name) {
      text = `${beer.brewery.name} - ${text}`;
    }
    return (
      <li key={beer._id}>
        <Link to={beer._id}>{text}</Link>
      </li>
    );
  }
}
