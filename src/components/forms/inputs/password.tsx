import { GenericInput } from './generic';
import { Field } from 'react-final-form';

export class Password extends GenericInput {
  public label: string = 'Password';
  public name: string = 'password';
  public placeholder: string = 'Password';
  public type: string = 'password';
}
