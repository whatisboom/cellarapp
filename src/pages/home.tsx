import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { HeroImage } from '../components/images';
import { ButtonLink } from '../components/nav/links';

export class Home extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <React.Fragment>
        <HeroImage src="https://i.imgur.com/k89796E.jpg">
          <span>bc</span>
        </HeroImage>

        <div>
          <h2>Welcome to Beer Cellar!</h2>
          <p>With Beer Cellar you can:</p>
          <ul>
            <li>Keep track of the inventory in your cellar</li>
            <li>List items you own For Trade (FT)</li>
            <li>List Beers you're In Search Of (ISO)</li>
          </ul>
        </div>
        <div>
          <ButtonLink to="/signin">Signin</ButtonLink>
          <span> or </span>
          <ButtonLink to="/signup">Signup</ButtonLink>
        </div>
      </React.Fragment>
    );
  }
}
