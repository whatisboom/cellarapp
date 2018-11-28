import * as React from 'react';
import { NavUserDropdownMenu } from './nav-user-dropdown-menu';
import { IUser } from 'types';
const styles = require('./nav-user-dropdown.css');
const appStyles = require('../app-nav.css');

interface IComponentProps {
  user: IUser;
}

interface IComponentState {
  open: boolean;
}

export class NavUserDropdown extends React.Component<IComponentProps> {
  state: IComponentState = {
    open: false
  };
  public render() {
    return (
      <span
        className={[
          appStyles.section,
          appStyles.justifyEnd,
          appStyles.link,
          styles.container
        ].join(' ')}
        onClick={this.toggleOpen.bind(this)}
      >
        <span>{this.props.user.username}</span>
        {this.state.open ? <NavUserDropdownMenu /> : null}
      </span>
    );
  }

  private toggleOpen() {
    this.setState({
      open: !this.state.open
    });
  }
}
