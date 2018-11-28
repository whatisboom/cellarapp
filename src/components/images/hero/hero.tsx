import * as React from 'react';
const styles = require('./hero.css');

export interface HeroImageProps {
  src: string;
  text: string;
}

export class HeroImage extends React.Component<HeroImageProps> {
  public render() {
    const { src, text } = this.props;
    return (
      <div
        className={styles.container}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${src})`
        }}
      >
        <span className={styles.text}>{text}</span>
      </div>
    );
  }
}
