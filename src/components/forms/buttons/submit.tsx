import { BaseButton } from './base';

interface ISubmitButton {
  isPristine: boolean;
  isInvalid: boolean;
}

export class SubmitButton extends BaseButton<ISubmitButton> {
  public text: string = 'submit';
  public type: string = 'submit';
  constructor(props) {
    super(props);
    // this.disabled = props.isInvalid;
  }
}
