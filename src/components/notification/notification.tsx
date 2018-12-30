import * as React from 'react';
import { INotification } from 'types';
import {
  Snackbar,
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  SnackbarContent
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';

const styles = (theme: Theme) =>
  createStyles({
    success: {
      background: green[700],
      color: theme.palette.getContrastText(green[700])
    },
    neutral: {},
    error: {
      background: red[500],
      color: theme.palette.getContrastText(red[500])
    }
  });

interface SnackbarWrapperProps extends WithStyles<{ [key: string]: any }> {
  note: INotification;
}

interface SnackbarWrapperState {
  open: boolean;
}

export class NotificationCmp extends React.Component<SnackbarWrapperProps> {
  public state: SnackbarWrapperState = {
    open: true
  };
  public render() {
    const { note, classes } = this.props;
    const status = note.status || 'neutral';
    const variant: string = classes[status];
    return (
      <Snackbar
        open={this.state.open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        autoHideDuration={note.duration || 3000}
        onClose={() =>
          this.setState({
            open: false
          })
        }
      >
        <SnackbarContent
          className={variant}
          message={<span>{note.text}</span>}
        />
      </Snackbar>
    );
  }
}

export const Notification = withStyles(styles)(NotificationCmp);
