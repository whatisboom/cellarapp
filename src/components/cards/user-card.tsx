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
      margin: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2
    },
    cell: {
      padding: theme.spacing.unit * 1
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
    );
  }
}

export default withStyles(styles)(UserCard);
