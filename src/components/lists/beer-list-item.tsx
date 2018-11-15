import * as React from 'react';
import { Link } from '@reach/router';
import { IBeer } from '../../types';
const styles = require('./list.css');

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
      <li key={beer._id} className={styles.listItem}>
        <Link to={beer._id} className={styles.listItemLink}>
          {text}
        </Link>
      </li>
    );
  }
}
