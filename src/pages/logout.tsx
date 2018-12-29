import * as React from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import Loader from 'components/loaders/loader';
import { AuthService } from 'services/auth';

interface IComponentProps {
  logout: () => void;
}

export default class Logout extends React.Component<
  RouteComponentProps<IComponentProps>
> {
  public render() {
    return <Loader />;
  }
  public async componentDidMount() {
    await AuthService.deleteTokens();
    this.props.logout();
    navigate('/');
  }
}
