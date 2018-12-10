import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

export class Loader extends React.Component {
  public render() {
    return (
      <Grid
        style={{ minHeight: 200 }}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <CircularProgress />
      </Grid>
    );
  }
}

export default Loader;
