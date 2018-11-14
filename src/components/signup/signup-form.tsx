import * as React from 'react';
import { Form } from 'react-final-form';
import { Username, Password, Email } from '../forms/inputs';
import { SubmitButton } from '../forms/buttons';
import { AuthService } from '../../services/auth';

import { ISignupPayload } from '../../types/signuppayload';

export class SignupForm extends React.Component {
  public render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        validate={this.validate}
        render={({ handleSubmit, pristine, invalid }) => (
          <form onSubmit={handleSubmit}>
            <Username />
            <Email />
            <Password />
            <SubmitButton isPristine={pristine} isInvalid={invalid} />
          </form>
        )}
      />
    );
  }

  private async onSubmit(values: ISignupPayload): Promise<void> {
    const response = await AuthService.signup(values);
    AuthService.saveTokens(response);
  }

  private validate({
    username,
    password,
    email
  }: ISignupPayload): ISignupPayload {
    const errors: any = {};
    if (!password) {
      errors.password = 'Required';
    }
    if (!username) {
      errors.username = 'Required';
    }
    if (!email) {
      errors.email = 'Required';
    }
    return errors;
  }
}
