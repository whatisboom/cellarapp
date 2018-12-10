import * as React from 'react';
import { Link } from '@reach/router';
import {
  AppBar,
  Toolbar,
  Typography,
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core';

import { NavUserDropdown } from './nav-user-dropdown';
import { IUser } from 'types';

const styles = (theme: Theme) =>
  createStyles({
    link: {
      textDecoration: 'none',
      color: theme.palette.common.white,
      marginRight: theme.spacing.unit * 2
    },
    grow: {
      flexGrow: 1
    }
  });

interface StyledComponentProps extends WithStyles<typeof styles> {
  user: IUser;
}

export class AuthenticatedNav extends React.Component<StyledComponentProps> {
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.grow}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" className={classes.grow}>
              <Link className={classes.link} to="/dashboard">
                Dashboard
              </Link>
              <Link className={classes.link} to="/users">
                Users
              </Link>
              <Link className={classes.link} to="/breweries">
                Breweries
              </Link>
              <Link className={classes.link} to="/beers">
                Beers
              </Link>
            </Typography>
            <Typography variant="h6">
              <NavUserDropdown user={this.props.user} />
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(AuthenticatedNav);
