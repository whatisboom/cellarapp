import * as React from 'react';
import { IUser } from 'types';
import {
  withStyles,
  Theme,
  createStyles,
  WithStyles,
  Menu,
  MenuItem,
  Typography
} from '@material-ui/core';
import { Link } from '@reach/router';

interface NavUserDropdownProps extends WithStyles<typeof styles> {
  user: IUser;
}

interface IComponentState {
  anchorEl: any;
}

const styles = (theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.common.white
    },
    menuItem: {
      color: theme.palette.common.black,
      textDecoration: 'none'
    }
  });

export class NavUserDropdown extends React.Component<NavUserDropdownProps> {
  state: IComponentState = {
    anchorEl: null
  };
  public render() {
    const { classes, user } = this.props;
    const { anchorEl } = this.state;
    return (
      <span>
        <span onClick={this.handleOpen.bind(this)} className={classes.link}>
          {user.username}
        </span>
        <NavUserDropdownMenu
          username={user.username}
          anchorEl={anchorEl}
          handleClose={this.handleClose.bind(this)}
          classes={classes}
        />
      </span>
    );
  }

  private handleOpen(e: UIEvent) {
    this.setState({
      anchorEl: e.currentTarget
    });
  }

  private handleClose() {
    this.setState({
      anchorEl: null
    });
  }
}

interface NavUserDropdownMenuProps {
  anchorEl: any;
  handleClose: () => void;
  username: string;
  classes: any;
}

export class NavUserDropdownMenu extends React.Component<
  NavUserDropdownMenuProps
> {
  public render() {
    const { anchorEl, handleClose, username, classes } = this.props;
    return (
      <Menu
        id="user-menu"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <MenuItem>
          <Link
            className={classes.menuItem}
            onClick={handleClose}
            to={`/users/${username}`}
          >
            <Typography>My Profile</Typography>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            className={classes.menuItem}
            onClick={handleClose}
            to="/settings"
          >
            <Typography>Settings</Typography>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link className={classes.menuItem} onClick={handleClose} to="/logout">
            <Typography>Logout</Typography>
          </Link>
        </MenuItem>
      </Menu>
    );
  }
}

export default withStyles(styles)(NavUserDropdown);
