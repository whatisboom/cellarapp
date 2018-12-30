import * as React from 'react';
import {
  Grid,
  Paper,
  Typography,
  WithStyles,
  createStyles,
  Theme,
  withStyles
} from '@material-ui/core';
import { IUser } from 'types';

const styles = (theme: Theme) =>
  createStyles({
    avatar: {
      width: '100%',
      borderRadius: '50%'
    },
    paper: {
      margin: theme.spacing.unit,
      padding: theme.spacing.unit
    }
  });
interface UserCardProps extends WithStyles<typeof styles> {
  user: IUser;
}

export class UserCard extends React.Component<UserCardProps> {
  render() {
    const { classes, user } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <img
              className={classes.avatar}
              src={user.avatar}
              alt={user.username}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6">{user.username}</Typography>
            {user.location && (
              <Typography component="span">{user.location}</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(UserCard);
