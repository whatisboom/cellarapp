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
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                {...input}
                placeholder={this.placeholder}
                type={this.type}
              />
            </div>
            {meta.error && meta.touched && (
              <span className={styles.error}>{meta.error}</span>
            )}
          </div>
        )}
      </Field>
    );
  }
}
