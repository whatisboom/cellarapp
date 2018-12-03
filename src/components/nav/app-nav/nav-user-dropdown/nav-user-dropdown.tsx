import * as React from 'react';
import { NavUserDropdownMenu } from './nav-user-dropdown-menu';
import { IUser } from 'types';

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
      <span onClick={this.toggleOpen.bind(this)}>
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
