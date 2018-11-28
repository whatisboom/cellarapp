import * as React from 'react';
import { Field } from 'react-final-form';
const styles = require('./generic.css');

export class GenericInput extends React.Component {
  public label: string = '';
  public name: string = '';
  public placeholder: string = '';
  public type: string = 'text';
  render() {
    return (
      <Field name={this.name}>
        {({ input, meta }) => (
          <div className={styles.container}>
            {this.label && <label className={styles.label}>{this.label}</label>}
            <span className={styles.inputContainer}>
              <input
                className={styles.input}
                {...input}
                placeholder={this.placeholder}
                type={this.type}
              />
            </span>
            {meta.error && meta.touched && <span>{meta.error}</span>}
          </div>
        )}
      </Field>
    );
  }
}
