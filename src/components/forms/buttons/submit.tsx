import { BaseButton } from './base';

interface ISubmitButton {
  isPristine?: boolean;
  isInvalid?: boolean;
}

export class SubmitButton extends BaseButton<ISubmitButton> {
  public text: string = 'Submit';
  public type: string = 'submit';
}
