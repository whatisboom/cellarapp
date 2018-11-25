import * as React from 'react';

interface IComponentProps {
  items: any[];
  listItemComponent: any;
  format: string;
  toKey: string;
}

export class List extends React.Component<IComponentProps> {
  public render() {
    const { items, format, toKey } = this.props;
    const ListItem = this.props.listItemComponent;
    const list = items.map((item) => (
      <ListItem key={item._id} item={item} format={format} toKey={toKey} />
    ));
    return (
      <nav>
        <ul>{list}</ul>
      </nav>
    );
  }
}
