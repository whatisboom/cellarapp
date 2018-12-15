import * as React from 'react';
import { Link, RouteComponentProps } from '@reach/router';
import { CellarApiResource } from '../services/api';
import { IUserResponse, IUser, IQuantity, IBeer, IBrewery } from 'types';
import Loader from '../components/loaders/loader';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  Grid,
  Theme,
  createStyles,
  ListItem,
  List,
  ListItemText
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
        {this.getBeerList('owned', 'Inventory')}
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

  public getBeerList(key: 'owned', subheading: string = ''): React.ReactNode {
    const { user } = this.state;
    const { classes } = this.props;
    return (
      <List
        className={classes.beerList}
        component="ul"
        subheader={<Typography variant="h6">{subheading}</Typography>}
      >
        {user[key].map((row: IQuantity) => {
          return this.getBeerListItem(row);
        })}
      </List>
    );
  }

  public getBeerListItem({ beer, amount }: IQuantity): React.ReactNode {
    const { classes } = this.props;
    return (
      <ListItem key={beer._id} disableGutters={true}>
        <ListItemText
          className={classes.beerName}
          primary={this.getBeerLink(beer)}
          secondary={this.getBreweryLink(beer.brewery)}
        />
        <Typography className={classes.amount}>{amount}</Typography>
      </ListItem>
    );
  }

  public getBeerLink(beer: IBeer): React.ReactNode {
    const { classes } = this.props;
    return (
      <Link className={classes.listLink} to={`/beers/${beer.slug}`}>
        {beer.name}
      </Link>
    );
  }

  public getBreweryLink(brewery: IBrewery): React.ReactNode {
    const { classes } = this.props;
    return (
      <Link
        className={[classes.listLink, classes.breweryName].join(' ')}
        to={`/breweries/${brewery.slug}`}
      >
        {brewery.name}
      </Link>
    );
  }
}

export default withStyles(styles)(Dashboard);
