import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { IBrewery, IBreweryResponse } from 'types';
import { CellarApiResource } from '../../services/api';
import { Loader } from '../../components/loaders/loader';
import { List } from '../../components/lists/list';
import { ListItem } from '../../components/lists/list-item';

interface IComponentState {
  brewery?: IBrewery;
  loading: boolean;
}

export class BreweryDetails extends React.Component<
  RouteComponentProps<{
    slug: string;
  }>
> {
  public state: IComponentState = {
    loading: true
  };

  public resource = new CellarApiResource<
    {
      slug: string;
    },
    IBreweryResponse
  >({
    path: '/breweries/:slug/beers'
  });

  public render() {
    const { loading, brewery } = this.state;
    if (loading) {
      return <Loader />;
    }
    return (
      <div>
        <h1>{brewery.name}</h1>
        <span>
          {brewery.city}, {brewery.state}
        </span>
        {brewery.beers && brewery.beers.length ? (
          <List
            listItemComponent={ListItem}
            items={brewery.beers}
            format="%name%"
            toKey="slug"
          />
        ) : (
          <div>no beers found</div>
        )}
      </div>
    );
  }

  public async componentDidMount() {
    try {
      const { brewery } = await this.resource.read({
        slug: this.props.slug
      });
      this.setState({
        brewery,
        loading: false
      });
    } catch (e) {}
  }
}
