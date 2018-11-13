import * as React from 'react';
import { RouteComponentProps } from '@reach/router';

interface IUSerDetails {
  userId: string;
}
export class UserDetails extends React.Component<
  RouteComponentProps<IUSerDetails>
> {
  public render() {
    return `user: ${this.props.userId}`;
  }
}
