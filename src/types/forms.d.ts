export interface ISigninForm {
  username: string;
  password: string;
}

export interface ISignupForm extends ISigninForm {
  email: string;
}
