import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { CellarApiResource } from '../services/api';

export class Dashboard extends React.Component<RouteComponentProps> {
  public state: any = {
    user: {
      username: 'loading'
    }
  };

  public me = new CellarApiResource({
    path: '/users/me'
  });

  public render() {
    return <h1>{this.state.user.username}</h1>;
  }

  public async componentDidMount() {
    try {
      const { user } = await this.me.read();
      this.setState({
        user
      });
    } catch (e) {}
  }
}
