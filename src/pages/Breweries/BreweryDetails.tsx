import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { IBrewery, IBreweryResponse } from 'types';
import { CellarApiResource } from '../../services/api';
import { Loader } from '../../components/loaders/loader';

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
    path: '/breweries/:slug'
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
