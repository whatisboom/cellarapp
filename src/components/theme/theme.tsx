import * as React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[800]
    },
    secondary: {
      main: red[900]
    },
    type: 'dark'
  },
  typography: {
    useNextVariants: true
  }
});

export class BeerCellarTheme extends React.Component {
  public render() {
    return (
      <MuiThemeProvider theme={theme}>{this.props.children}</MuiThemeProvider>
    );
  }
}
