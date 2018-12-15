import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { IQuantity, IUser, IUserResponse, IBeer, IBrewery } from 'types';
import { CellarApiResource } from '../../services/api';
import Loader from '../../components/loaders/loader';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles
} from '@material-ui/core/styles';
import UserCard from '../../components/cards/user-card';

interface UserDetailsState {
  user?: IUser;
  loading: boolean;
}

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

interface UserDetailsProps extends WithStyles<typeof styles> {
  username: string;
}

export class UserDetails extends React.Component<
  RouteComponentProps<UserDetailsProps>
> {
  public state: UserDetailsState = {
    loading: true
  };

  public resource = new CellarApiResource<
    {
      username: string;
    },
    IUserResponse
  >({
    path: '/users/:username'
  });

  public render() {
    const { loading, user } = this.state;
    const { classes } = this.props;

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
      const { user } = await this.resource.read({
        username: this.props.username
      });
      this.setState({
        user,
        loading: false
      });
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

export default withStyles(styles)(UserDetails);
