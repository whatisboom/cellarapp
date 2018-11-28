import * as React from 'react';

export interface BaseButtonProps {
  disabled: boolean;
  type?: string;
}

export class BaseButton extends React.Component<BaseButtonProps> {
  public render() {
    const { children, disabled, type = 'text' } = this.props;
    return (
      <button data-testid="Button" disabled={disabled} type={type}>
        {children}
      </button>
    );
  }
}
