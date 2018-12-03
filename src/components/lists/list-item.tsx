import * as React from 'react';
import { Link } from '@reach/router';

interface IComponentProps {
  item: any;
  format: string;
  toKey: string;
}

export class ListItem extends React.Component<IComponentProps> {
  render() {
    const { item, format, toKey } = this.props;
    const text = this.formatText(format, item);
    // convert to item[key]
    return (
      <li key={item._id}>
        <Link to={item[toKey]}>{text}</Link>
      </li>
    );
  }
  private formatText(format: string, item: { [key: string]: string }): string {
    // TODO: support nested properties like _.get
    const regex: RegExp = /%[_a-zA-Z0-9\-]+%/gi;
    let result: string = format;

    if (!regex.test(format)) {
      throw new Error(
        'Provide a string with key identifiers: %example%\n\n\nString provided: ' +
          format
      );
    }

    const matches: string[] = format.match(regex);

    matches.forEach((match) => {
      const key = match.substr(1, match.length - 2);
      result = result.replace(match, item[key]);
    });
    return result;
  }
}
