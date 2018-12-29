import * as React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import { connect } from 'react-redux';
import { AppConnected } from 'pages/app';
import { BEER_CELLAR_THEME_MODE } from 'beer-cellar-constants';
interface BeerCellarThemeProps {
  themeMode: any;
}

export class BCTheme extends React.Component<BeerCellarThemeProps> {
  public render() {
    return (
      <MuiThemeProvider theme={this.getTheme()}>
        <AppConnected />
      </MuiThemeProvider>
    );
  }
  public shouldComponentUpdate(): boolean {
    return true;
  }

  private getTheme() {
    const { themeMode } = this.props;
    localStorage.setItem(BEER_CELLAR_THEME_MODE, themeMode);
    return createMuiTheme({
      palette: {
        primary: {
          main: blue[800]
        },
        secondary: {
          main: red[900]
        },
        type: themeMode
      },
      typography: {
        useNextVariants: true
      }
    });
  }
}

function mapStateToProps(state: any) {
  const { themeMode } = state;
  return {
    themeMode
  };
}

export const BeerCellarTheme = connect(mapStateToProps)(BCTheme);
