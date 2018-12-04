import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { IUser, IUserResponse } from 'types';
import { CellarApiResource } from '../../services/api';
import { Loader } from '../../components/loaders/loader';
import {
  Typography,
  Grid,
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Paper
} from '@material-ui/core';

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
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={6} className={classes.cell}>
            <img
              className={classes.avatar}
              src={user.avatar}
              alt={user.username}
            />
          </Grid>
          <Grid item xs={6} className={classes.cell}>
            <Typography variant="h6">{user.username}</Typography>
          </Grid>
        </Grid>
      </Paper>
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
