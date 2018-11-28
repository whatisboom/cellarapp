import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { HeroImage } from '../components/images';

export class Home extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <React.Fragment>
        <HeroImage text="Beer Cellar" src="https://placekitten.com/800/600" />

        <div>With Beer Cellar you can ...</div>
      </React.Fragment>
    );
  }
}
