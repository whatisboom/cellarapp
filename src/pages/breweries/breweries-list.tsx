import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { CellarApiResource } from '../../services/api';
import { IBrewery, IBreweriesResponse } from '../../types';
import { List } from '../../components/lists/list';
import { ListItem } from '../../components/lists/list-item';
import Loader from '../../components/loaders/loader';

interface IComponentState {
  breweries?: IBrewery[];
  loading: boolean;
}

export class BreweriesListContainer extends React.Component<
  RouteComponentProps
> {
  public state: IComponentState = {
    loading: true
  };

  public resource = new CellarApiResource<null, IBreweriesResponse>({
    path: '/breweries'
  });

  public render() {
    return (
      <div>
        <h1>Breweries</h1>
        {this.state.loading ? (
          <Loader />
        ) : (
          <List
            listItemComponent={ListItem}
            items={this.state.breweries}
            format="%name% (%city%, %state%)"
            toKey="slug"
          />
        )}
      </div>
    );
  }
  public async componentDidMount() {
    try {
      const { breweries } = await this.resource.list();
      this.setState({
        breweries,
        loading: false
      });
    } catch (e) {}
  }
}
