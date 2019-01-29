import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import untappdPoweredBy from 'images/pbu_80_yellow.png';
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
  Typography,
  Button
} from '@material-ui/core';

const SignupStyles = (theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing.unit
    },
    buttonLink: {
      textDecoration: 'none',
      color: theme.palette.common.white
    },
    container: {
      padding: theme.spacing.unit,
      textAlign: 'center'
    },
    link: {
      color: theme.palette.getContrastText(theme.palette.background.default)
    },
    untappdLogo: {
      maxWidth: '100%',
      padding: theme.spacing.unit
    }
  });

interface SignupProps extends WithStyles<typeof SignupStyles> {}

export class SignupSignin extends React.Component<
  RouteComponentProps<SignupProps>
> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <img src={untappdPoweredBy} className={classes.untappdLogo} />

        <Typography>
          In order to share{' '}
          <a
            className={classes.link}
            href="https://untappd.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Untappd's
          </a>{' '}
          amazing database of beer, we require authentication (OAuth) through
          their website. We will import your username, first/last name, and
          email. You will be able to update these after signing up (COMING
          SOON). Don't worry your email will be kept private and only used for
          important updates regarding our service.
        </Typography>
        <Button variant="contained" color="primary" className={classes.button}>
          <a
            className={classes.buttonLink}
            href={`https://untappd.com/oauth/authenticate/?client_id=${
              process.env.UNTAPPD_CLIENT_ID
            }&response_type=code&redirect_url=${
              process.env.UNTAPPD_REDIRECT_URL
            }`}
          >
            Authenticate via Untappd
          </a>
        </Button>
      </div>
    );
  }
}

export default withStyles(SignupStyles)(SignupSignin);
