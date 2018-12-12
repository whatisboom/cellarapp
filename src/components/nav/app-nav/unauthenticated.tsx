import * as React from 'react';
import { Link } from '@reach/router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    link: {
      textDecoration: 'none',
      color: theme.palette.common.white,
      marginLeft: theme.spacing.unit * 2
    },
    grow: {
      flexGrow: 1
    }
  });

interface StyledComponentProps extends WithStyles<typeof styles> {}

export class UnauthenticatedNav extends React.Component<StyledComponentProps> {
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.grow}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" className={classes.grow}>
              <Link className={[classes.link].join(' ')} to="/">
                bc
              </Link>
            </Typography>
            <Typography variant="h6">
              <Link className={classes.link} to="/auth">
                Signin or Signup
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(UnauthenticatedNav);
