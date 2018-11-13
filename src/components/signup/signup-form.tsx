import * as React from 'react';
import { Form } from 'react-final-form';
import { Username, Password, Email } from '../forms/inputs';
import { SubmitButton } from '../forms/buttons';

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

  private async onSubmit(values) {
    console.log(values);
  }

  private validate({ username, password, email }): any {
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
    console.log(errors);
    return errors;
  }
}
