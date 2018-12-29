import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import {
  Typography,
  Theme,
  createStyles,
  WithStyles,
  withStyles
} from '@material-ui/core';
import { ThemeSwitcher } from 'components/theme';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit
    }
  });

interface SettingsProps extends WithStyles<typeof styles> {}

export class Settings extends React.Component<
  RouteComponentProps<SettingsProps>
> {
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Typography variant="h6">Settings</Typography>
        <ThemeSwitcher />
      </div>
    );
  }
}

export default withStyles(styles)(Settings);
