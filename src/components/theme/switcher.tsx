import * as React from 'react';
import { connect } from 'react-redux';
import {
  Typography,
  Switch,
  Theme,
  createStyles,
  WithStyles,
  withStyles
} from '@material-ui/core';
import { SWITCH_THEME_MODE } from 'actions';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center'
    }
  });

interface SwitcherProps extends WithStyles<typeof styles> {
  darkMode: string;
  changeTheme?: () => void;
}

export class Switcher extends React.Component<SwitcherProps> {
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Typography style={{ flex: 1 }}>Dark Mode:</Typography>
        <Switch
          checked={this.props.darkMode}
          onChange={() => this.props.changeTheme()}
        />
      </div>
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
)(withStyles(styles)(Switcher));
