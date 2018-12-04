import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { IQuantity, IUser, IUserResponse } from 'types';
import { CellarApiResource } from '../../services/api';
import { Loader } from '../../components/loaders';
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
      fontWeight: 800,
      textDecoration: 'none'
    },
    amount: {
      color: theme.palette.primary.dark
    },
    beerList: {
      margin: theme.spacing.unit * 2
    },
    listLink: {
      display: 'block',
      width: '100%'
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
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={4} className={classes.cell}>
              <img
                className={classes.avatar}
                src={user.avatar}
                alt={user.username}
              />
            </Grid>
            <Grid item xs={8} className={classes.cell}>
              <Typography variant="h6">{user.username}</Typography>
              {user.location && (
                <Typography component="span">{user.location}</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
        <List
          className={classes.beerList}
          component="ul"
          subheader={<Typography variant="h6">Inventory</Typography>}
        >
          {user.owned.map(({ beer, amount }: IQuantity) => {
            return (
              <ListItem key={beer._id} disableGutters={true}>
                <ListItemText
                  className={classes.beerName}
                  primary={
                    <Link
                      className={classes.listLink}
                      to={`/beers/${beer.slug}`}
                    >
                      {beer.name}
                    </Link>
                  }
                  secondary={
                    <Link
                      className={classes.listLink}
                      to={`/breweries/${beer.brewery.slug}`}
                    >
                      {beer.brewery.name}
                    </Link>
                  }
                />
                <Typography className={classes.amount}>{amount}</Typography>
              </ListItem>
            );
          })}
        </List>
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
}

export default withStyles(styles)(UserDetails);
