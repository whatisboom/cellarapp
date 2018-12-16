import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Text } from '../../components/forms/inputs';
import { SubmitButton } from '../../components/forms/buttons';
import { Form } from 'react-final-form';
import { CellarApiResource } from '../../services';
import { IBeersResponse, IBeer } from '../../types';

interface BeerSearchState {
  beers: IBeer[];
}

export class BeerSearch extends React.Component<
  RouteComponentProps,
  BeerSearchState
> {
  private resource: CellarApiResource<
    {
      q: string;
    },
    IBeersResponse
  > = new CellarApiResource({
    path: '/search/beers'
  });

  public state: BeerSearchState = { beers: [] };

  public render() {
    return (
      <React.Fragment>
        <Form
          validate={this.validate}
          onSubmit={this.onSubmit.bind(this)}
          render={({ handleSubmit, pristine, invalid }) => (
            <form onSubmit={handleSubmit}>
              <Text name="q" />
              <SubmitButton disabled={pristine || invalid}>Search</SubmitButton>
            </form>
          )}
        />
        {this.state.beers.map((beer, index) => (
          <div key={index}>{beer.name}</div>
        ))}
      </React.Fragment>
    );
  }

  private async onSubmit(values: { [key: string]: string }): Promise<void> {
    const { q } = values;
    try {
      const { beers } = await this.resource.read({
        q
      });
      this.setState({ beers });
    } catch (e) {
      console.log(e);
    }
  }

  private validate(values: { [key: string]: string }): any {
    if (values.q && values.q.length < 3) {
      return {
        q: 'Minimum 3 characters'
      };
    }
  }
}
