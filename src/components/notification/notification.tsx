import * as React from 'react';
import { INotification } from '../../types';
import { Snackbar } from '@material-ui/core';

interface SnackbarWrapperProps {
  note: INotification;
}

interface SnackbarWrapperState {
  open: boolean;
}

export class Notification extends React.Component<SnackbarWrapperProps> {
  public state: SnackbarWrapperState = {
    open: true
  };
  public render() {
    const { note } = this.props;
    return (
      <Snackbar
        open={this.state.open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        autoHideDuration={3000}
        message={<span>{note.text}</span>}
        onClose={() =>
          this.setState({
            open: false
          })
        }
      />
    );
  }
}
