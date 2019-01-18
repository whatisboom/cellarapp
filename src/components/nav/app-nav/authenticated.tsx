import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import NavUserDropdown from './nav-user-dropdown';
import { IUser } from 'types';
import { NavMenu } from '../menu/menu';
import { connect } from 'react-redux';
import { TOGGLE_NAVIGATION_MENU } from 'actions';

const styles = (theme: Theme) =>
  createStyles({
    icon: {
      color: theme.palette.primary.contrastText
    },
    grow: {
      flexGrow: 1
    }
  });

interface AuthenticatedNavProps extends WithStyles<typeof styles> {
  user: IUser;
  toggleMenu?: () => void;
}

interface AuthenticatedNavState {
  menu: boolean;
}

export class AuthenticatedNav extends React.Component<AuthenticatedNavProps> {
  public state: AuthenticatedNavState = {
    menu: false
  };

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.grow}>
        <AppBar>
          <Toolbar>
            <MenuIcon
              onClick={() => this.props.toggleMenu()}
              className={classes.icon}
            />
            <div className={classes.grow} />
            <Typography variant="h6">
              <NavUserDropdown user={this.props.user} />
            </Typography>
          </Toolbar>
        </AppBar>
        <NavMenu />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: React.Dispatch<any>) {
  return {
    toggleMenu() {
      dispatch({
        type: TOGGLE_NAVIGATION_MENU,
        open: true
      });
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(AuthenticatedNav));
