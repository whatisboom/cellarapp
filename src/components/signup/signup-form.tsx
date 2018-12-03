import * as React from 'react';
import { Form } from 'react-final-form';
import * as validate from 'validate.js';
import { navigate } from '@reach/router';
import { Username, Password, Email } from '../forms/inputs';
import { SubmitButton } from '../forms/buttons';
import { AuthService } from '../../services/auth';
import { ISignupForm } from '../../types';
const styles = require('./signup-form.css');

export class SignupForm extends React.Component {
  public render() {
    return (
      <div className={styles.content}>
        <h1>Sign up for Beer Cellar</h1>
        <p>
          Let us know a bit about you. Your email is safe with us. We will only
          email you with service updates, unless you opt-in for more.
        </p>
        <div className={styles.formContainer}>
          <Form
            onSubmit={this.onSubmit}
            validate={this.validate}
            render={({ handleSubmit, pristine, invalid }) => (
              <form onSubmit={handleSubmit}>
                <Username />
                <Email />
                <Password />
                <SubmitButton
                  className={styles.submit}
                  disabled={pristine || invalid}
                >
                  Signup
                </SubmitButton>
              </form>
            )}
          />
        </div>
      </div>
    );
  }

  private async onSubmit(values: ISignupForm): Promise<void> {
    try {
      const response = await AuthService.signup(values);
      AuthService.saveTokens(response);
      navigate('/dashboard');
    } catch (e) {}
  }

  private validate(values: ISignupForm): ISignupForm {
    const constraints = {
      username: {
        presence: true,
        length: {
          minimum: 3,
          message: 'must be at least 3 characters'
        }
      },
      password: {
        presence: true
      },
      email: {
        presence: true,
        email: true
      }
    };

    return validate.validate(values, constraints);
  }
}
