import * as React from 'react';
import { Field } from 'react-final-form';

export class GenericInput<T = null> extends React.Component<T> {
  public label: string = '';
  public name: string = '';
  public placeholder: string = '';
  public type: string = 'text';
  render() {
    return (
      <Field name={this.name}>
        {({ input, meta }) => (
          <label>
            {this.label && <label>{this.label}</label>}
            <div>
              <input
                {...input}
                placeholder={this.placeholder}
                type={this.type}
              />
            </div>
            {meta.error && meta.touched && <span>{meta.error}</span>}
          </label>
        )}
      </Field>
    );
  }
}
