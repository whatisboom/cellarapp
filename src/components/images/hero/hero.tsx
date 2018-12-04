import * as React from 'react';

export interface HeroImageProps {
  src: string;
}

export class HeroImage extends React.Component<HeroImageProps> {
  public render() {
    const { src, children } = this.props;
    return (
      <div
        style={{
          backgroundImage: `linear-gradient(
            hsla(34, 54%, 55%, 0.5),
            hsla(34, 54%, 55%, 0.5)),
            url(${src})`
        }}
      >
        <span>{children}</span>
      </div>
    );
  }
}
