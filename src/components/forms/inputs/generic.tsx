import * as React from 'react';
import { Field } from 'react-final-form';

export class GenericInput extends React.Component {
  public label: string = '';
  public name: string = '';
  public placeholder: string = '';
  public type: string = 'text';
  render() {
    return (
      <Field name={this.name}>
        {({ input, meta }) => (
          <div>
            {this.label && <label>{this.label}</label>}
            <input {...input} placeholder={this.placeholder} type={this.type} />
            {meta.error && meta.touched && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
    );
  }
}
