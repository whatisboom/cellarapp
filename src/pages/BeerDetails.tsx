import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { IBeer, IBeerResponse } from 'types';
import { CellarApiResource } from '../services/api';
import { Loader } from '../components/loaders/loader';

interface IComponentState {
  beer?: IBeer;
  loading: boolean;
}

export class BeerDetails extends React.Component<
  RouteComponentProps<{
    beerId: string;
  }>
> {
  public state: IComponentState = {
    loading: true
  };

  public resource = new CellarApiResource<
    {
      _id: string;
    },
    IBeerResponse
  >({
    path: '/beers/:_id'
  });

  public render() {
    const { loading, beer } = this.state;
    if (loading) {
      return <Loader />;
    }
    return (
      <div>
        <h1>{beer.name}</h1>
        <span>{beer.abv}</span>
        <h2>{beer.brewery.name}</h2>
        <span>
          {beer.brewery.city}, {beer.brewery.state}
        </span>
      </div>
    );
  }

  public async componentDidMount() {
    try {
      const { beer } = await this.resource.read({
        _id: this.props.beerId
      });
      this.setState({
        beer,
        loading: false
      });
    } catch (e) {}
  }
}
