import * as React from 'react';
import { connect } from 'react-redux';
import { Typography, Switch } from '@material-ui/core';
import { SWITCH_THEME_MODE } from 'actions';

interface SwitcherProps {
  darkMode: string;
  changeTheme?: () => void;
}

export class Switcher extends React.Component<SwitcherProps> {
  public render() {
    return (
      <Typography>
        Dark Mode:{' '}
        <Switch
          checked={this.props.darkMode}
          onChange={() => this.props.changeTheme()}
        />
      </Typography>
    );
  }
}

function mapStateToProps(state: any) {
  const { darkMode } = state;
  return {
    darkMode
  };
}

function mapDispatchToProps(dispatch: React.Dispatch<any>) {
  return {
    changeTheme(): void {
      dispatch({
        type: SWITCH_THEME_MODE
      });
    }
  };
}

export const ThemeSwitcher = connect(
  mapStateToProps,
  mapDispatchToProps
)(Switcher);
