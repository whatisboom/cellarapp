import * as React from 'react';
import { Form } from 'react-final-form';
import * as validate from 'validate.js';
import { navigate } from '@reach/router';
import { Username, Password } from '../forms/inputs';
import { SubmitButton } from '../forms/buttons';
import { AuthService } from '../../services/auth';

import { ISigninForm } from '../../types';

export class SigninForm extends React.Component {
  public render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        validate={this.validate}
        render={({ handleSubmit, pristine, invalid }) => (
          <form onSubmit={handleSubmit}>
            <Username />
            <Password />
            <SubmitButton isPristine={pristine} isInvalid={invalid} />
          </form>
        )}
      />
    );
  }

  private async onSubmit(values: ISigninForm): Promise<void> {
    try {
      const response = await AuthService.signin(values);
      AuthService.saveTokens(response);
      navigate('/dashboard');
    } catch (e) {}
  }

  private validate(values: ISigninForm): ISigninForm {
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
      }
    };

    return validate.validate(values, constraints);
  }
}
