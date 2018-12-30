import * as React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  withStyles,
  Theme,
  createStyles,
  WithStyles,
  Divider,
  ListItemIcon
} from '@material-ui/core';
import { connect } from 'react-redux';
import { TOGGLE_NAVIGATION_MENU } from 'actions';
import { Link } from '@reach/router';
import DashboardIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import UsersIcon from '@material-ui/icons/Group';

const styles = (theme: Theme) =>
  createStyles({
    subheading: {
      padding: theme.spacing.unit * 2
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.getContrastText(theme.palette.background.default)
    },
    list: {
      minWidth: 250
    }
  });

interface NavMenuProps extends WithStyles<typeof styles> {
  open?: boolean;
  handleClose?: () => void;
}

export class Navigation extends React.Component<NavMenuProps> {
  public render() {
    const { classes, handleClose } = this.props;
    return (
      <Drawer open={this.props.open} onClick={() => handleClose()}>
        <List
          subheader={
            <Typography className={classes.subheading} variant="h5">
              Beer Cellar
            </Typography>
          }
          className={classes.list}
        >
          <ListItem
            button
            onClick={() => handleClose()}
            component={(props) => (
              <Link className={classes.link} to="/dashboard" {...props} />
            )}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => handleClose()}
            component={(props) => <Link to="/users" {...props} />}
          >
            <ListItemIcon>
              <UsersIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleClose()}
            component={(props) => <Link to="/beers" {...props} />}
          >
            <ListItemIcon>
              <UsersIcon />
            </ListItemIcon>
            <ListItemText primary="Beers" />
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => handleClose()}
            component={(props) => (
              <Link className={classes.link} to="/settings" {...props} />
            )}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem
            button
            onClick={() => handleClose()}
            component={(props) => (
              <Link className={classes.link} to="/logout" {...props} />
            )}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

function mapStateToProps(state: any, props: NavMenuProps) {
  return {
    open: state.navigation.open
  };
}

function mapDispatchToProps(dispatch: React.Dispatch<any>) {
  return {
    handleClose() {
      dispatch({
        type: TOGGLE_NAVIGATION_MENU,
        open: false
      });
    }
  };
}

export const NavMenu = withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navigation)
);
