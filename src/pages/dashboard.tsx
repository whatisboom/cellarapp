import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { IUserResponse, IUser } from 'types';
import Loader from '../components/loaders/loader';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  Grid,
  Theme,
  createStyles
} from '@material-ui/core';
import UserCard from '../components/cards/user-card';

const styles = (theme: Theme) =>
  createStyles({
    avatar: {
      width: '100%',
      borderRadius: '50%'
    },
    paper: {
      margin: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2
    },
    cell: {
      padding: theme.spacing.unit * 1
    },
    beerName: {
      fontWeight: theme.typography.fontWeightMedium,
      textDecoration: 'none'
    },
    amount: {
      color: theme.palette.getContrastText(theme.palette.background.paper)
    },
    beerList: {
      margin: theme.spacing.unit * 2
    },
    listLink: {
      display: 'block',
      width: '100%',
      textDecoration: 'none',
      color: theme.palette.getContrastText(theme.palette.background.paper)
    },
    breweryName: {
      opacity: 0.6
    }
  });

interface DashboardProps extends WithStyles<typeof styles> {
  signin: (user: IUser) => void;
}

interface IComponentState {
  user?: IUser;
  loading: boolean;
}

export class Dashboard extends React.Component<
  RouteComponentProps<DashboardProps>
> {
  public state: IComponentState = {
    loading: true
  };

  public me = new CellarApiResource<null, IUserResponse>({
    path: '/users/me'
  });

  public render() {
    const { classes } = this.props;
    const { user, loading } = this.state;
    if (loading) {
      return <Loader />;
    }
    return (
      <React.Fragment>
        <UserCard user={user} />
      </React.Fragment>
    );
  }

  public async componentDidMount() {
    try {
      const { user } = await this.me.read();
      this.setState({
        user,
        loading: false
      });
      this.props.signin(user);
    } catch (e) {}
  }
}

export default withStyles(styles)(Dashboard);
