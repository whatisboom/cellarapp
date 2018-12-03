import { GenericInput } from './generic';

export class Password extends GenericInput {
  public name: string = 'password';
  public placeholder: string = 'Password';
  public type: string = 'password';
}
