import * as React from 'react';
import { NavUserDropdownMenu } from './nav-user-dropdown-menu';
import { IUser } from 'types';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core';

interface NavUserDropdownProps extends WithStyles<typeof styles> {
  user: IUser;
}

interface IComponentState {
  open: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.common.white
    }
  });

export class NavUserDropdown extends React.Component<NavUserDropdownProps> {
  state: IComponentState = {
    open: false
  };
  public render() {
    const { classes, user } = this.props;
    return (
      <span onClick={this.toggleOpen.bind(this)}>
        <span className={classes.link}>{user.username}</span>
        {this.state.open ? <NavUserDropdownMenu user={user} /> : null}
      </span>
    );
  }

  private toggleOpen() {
    this.setState({
      open: !this.state.open
    });
  }
}

export default withStyles(styles)(NavUserDropdown);
