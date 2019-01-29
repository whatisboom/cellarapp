import * as React from 'react';
import { RouteComponentProps, navigate, Link } from '@reach/router';
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Typography
} from '@material-ui/core';
import { CellarApiResource, AuthService } from 'services';
import { ILoginResponse } from 'types';
import { Loader } from 'components/loaders';

const SignupStyles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit,
      textAlign: 'center'
    },
    link: {
      color: theme.palette.getContrastText(theme.palette.background.default)
    }
  });

interface AuthState {
  loading: boolean;
  error: Error;
}

interface OAuthUntappdProps extends WithStyles<typeof SignupStyles> {}

export class OAuthUntappd extends React.Component<
  RouteComponentProps<OAuthUntappdProps>
> {
  public state: AuthState = {
    loading: true,
    error: null
  };

  private resource = new CellarApiResource<{ code: string }, ILoginResponse>({
    path: '/auth/oauth/untappd'
  });

  public async componentWillMount() {
    const code = this.getCode();
    try {
      const response = await this.doLogin(code);
      AuthService.saveTokens(response);
      navigate('/dashboard');
      this.setState({
        loading: false
      });
    } catch (e) {
      console.log('error block', e);
      this.setState({
        error: e,
        loading: false
      });
    }
  }

  public render() {
    const { classes } = this.props;
    const { loading, error } = this.state;
    return (
      <div className={this.props.classes.container}>
        <Typography>
          {loading && !error && 'Signing you in...'}
          {error && (
            <React.Fragment>
              There was an error logging you in, please{' '}
              <Link className={classes.link} to="/auth">
                try again.
              </Link>
            </React.Fragment>
          )}
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
  private getCode(): string {
    const code = this.parseQS(this.props.location.search).get('code');
    return code;
  }
  private async doLogin(code: string): Promise<ILoginResponse> {
    return await this.resource.create({
      code
    });
  }
}

export default withStyles(SignupStyles)(OAuthUntappd);
