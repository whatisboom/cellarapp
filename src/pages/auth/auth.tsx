import * as React from 'react';
import { RouteComponentProps, navigate, Router } from '@reach/router';
import { AuthService, CellarApiResource } from 'services';
import { ILoginResponse } from 'types';
import {
  Button,
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Typography
} from '@material-ui/core';
import { Loader } from 'components/loaders';

interface AuthState {
  loading: boolean;
}

export default class Auth extends React.Component<RouteComponentProps> {
  render() {
    return (
      <Router>
        <SignupSigninStyled default path="/" />
        <OAuthUntappdStyled path="oauth/untappd" />
      </Router>
    );
  }
}

const SignupStyles = (theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing.unit * 2
    },
    buttonLink: {
      textDecoration: 'none',
      color: theme.palette.common.white
    },
    container: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center'
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
        <Typography>
          In order to share <a href="https://untappd.com/">Untappd's</a> amazing
          database of beer, we require authentication (OAuth) through their
          website. We will import your username, first/last name, and email. You
          will be able to update these after signing up (COMING SOON). Don't
          worry your email will be kept private and only used for important
          updates regarding our service.
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

export const SignupSigninStyled = withStyles(SignupStyles)(SignupSignin);

interface OAuthUntappdProps extends WithStyles<typeof SignupStyles> {}

export class OAuthUntappd extends React.Component<
  RouteComponentProps<OAuthUntappdProps>
> {
  public state: AuthState = {
    loading: true
  };

  private resource = new CellarApiResource<{ code: string }, ILoginResponse>({
    path: '/auth/oauth/untappd'
  });

  public async componentWillMount() {
    const response = await this.getCode();
    AuthService.saveTokens(response);
    this.setState({
      loading: false
    });
    navigate('/dashboard');
  }

  public async getCode(): Promise<ILoginResponse> {
    const code = this.parseQS(this.props.location.search).get('code');
    try {
      return await this.resource.create({
        code
      });
    } catch (e) {
      console.log(e);
    }
  }

  public render() {
    return (
      <div className={this.props.classes.container}>
        <Typography>
          {this.state.loading
            ? 'Signing you in...'
            : 'Successfully signed in! Redirecting to your dashboard!'}
        </Typography>
        <Loader />
      </div>
    );
  }

  private parseQS(str: string): Map<string, string> {
    const pieces: string[] = str.substr(1).split('&');
    const result: Map<string, string> = new Map();
    pieces.forEach((piece: string) => {
      const [key, value] = piece.split('=');
      result.set(key, value);
    });
    return result;
  }
}

export const OAuthUntappdStyled = withStyles(SignupStyles)(OAuthUntappd);
