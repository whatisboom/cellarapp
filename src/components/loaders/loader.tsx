import * as React from 'react';
const styles = require('./loader.css');

export class Loader extends React.Component {
  public render() {
    return (
      <div className={styles.container}>
        <span className={styles.loader} />
      </div>
    );
  }
}
