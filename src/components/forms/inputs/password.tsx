import { GenericInput } from './generic';
import { Field } from 'react-final-form';

export class Password extends GenericInput {
  public name: string = 'password';
  public placeholder: string = 'Password';
  public type: string = 'password';
}
