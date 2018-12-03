import * as React from 'react';
const styles = require('./base.css');

export interface BaseButtonProps {
  disabled?: boolean;
  type?: string;
  className?: string;
}

export class BaseButton extends React.Component<BaseButtonProps> {
  public render() {
    const { children, disabled, type = 'text' } = this.props;
    return (
      <button
        className={[styles.button, this.props.className].join(' ')}
        data-testid="Button"
        disabled={disabled}
        type={type}
      >
        {children}
      </button>
    );
  }
}
