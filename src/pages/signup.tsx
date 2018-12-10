import * as React from 'react';
import { RouteComponentProps } from '@reach/router';

export class Signup extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <a
        href={`https://untappd.com/oauth/authenticate/?client_id=${
          process.env.UNTAPPD_CLIENT_ID
        }&response_type=code&redirect_url=https://app.beercellar.io/auth/oauth/untappd`}
      >
        Signup via Untappd
      </a>
    );
  }
}
