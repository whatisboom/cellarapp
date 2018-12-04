import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { CellarApiResource } from '../../services/api';
import { IBeersResponse, IBeer } from '../../types';
import { List } from '../../components/lists/list';
import { ListItem } from '../../components/lists/list-item';
import { Loader } from '../../components/loaders/loader';

interface IComponentState {
  beers?: IBeer[];
  loading: boolean;
}

export class BeersListContainer extends React.Component<RouteComponentProps> {
  public state: IComponentState = {
    loading: true
  };

  public resource = new CellarApiResource<null, IBeersResponse>({
    path: '/beers'
  });

  public render() {
    return (
      <div>
        <h1>Beers</h1>
        {this.state.loading ? (
          <Loader />
        ) : (
          <List
            listItemComponent={ListItem}
            items={this.state.beers}
            format="%name% (%abv%%)"
            toKey="slug"
          />
        )}
      </div>
    );
  }
  public async componentDidMount() {
    try {
      const { beers } = await this.resource.list();
      this.setState({
        beers,
        loading: false
      });
    } catch (e) {}
  }
}
