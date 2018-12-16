import { GenericInput } from './generic';

interface TextProps {
  name: string;
}

export class Text extends GenericInput<TextProps> {
  public type: string = 'string';
  componentWillMount() {
    this.name = this.props.name;
  }
}
