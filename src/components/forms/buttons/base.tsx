import * as React from 'react';

export class BaseButton<T> extends React.Component<T> {
  public text: string = 'Base Button';
  public type: string = '';
  public disabled: boolean = false;
  public render() {
    return (
      <button disabled={this.disabled} type={this.type}>
        {this.text}
      </button>
    );
  }
}
