import * as React from 'react';
import { WithStyles, Theme, createStyles, withStyles } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      minHeight: '30vh',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    content: {
      textAlign: 'center',
      width: '100%'
    }
  });

export interface HeroImageProps extends WithStyles<typeof styles> {
  src: string;
}

class HeroImageCmp extends React.Component<HeroImageProps> {
  public render() {
    const { src, children, classes } = this.props;
    return (
      <div
        className={classes.container}
        style={{
          backgroundImage: `linear-gradient(
            hsla(34, 54%, 55%, 0.5),
            hsla(34, 54%, 55%, 0.5)),
            url(${src})`
        }}
      >
        <span className={classes.content}>{children}</span>
      </div>
    );
  }
}

export const HeroImage = withStyles(styles)(HeroImageCmp);
