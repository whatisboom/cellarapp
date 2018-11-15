import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { IBeersResponse, IBeer } from '../types';
import { BeerList } from '../components/lists/beer-list';
import { Loader } from '../components/loaders/loader';

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
        <div>
          toolbar: <Link to="add">Add</Link>
        </div>
        {this.state.loading}
        {this.state.loading ? (
          <Loader />
        ) : (
          <BeerList beers={this.state.beers} />
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
