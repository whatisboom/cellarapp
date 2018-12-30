import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { HeroImage } from 'components/images';
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button
} from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import HappyIcon from '@material-ui/icons/Mood';
import ThumbsIcon from '@material-ui/icons/ThumbUp';

const styles = (theme: Theme) =>
  createStyles({
    buttonLink: {
      textDecoration: 'none',
      color: theme.palette.common.white
    },
    container: {
      padding: theme.spacing.unit,
      textAlign: 'center'
    },
    logo: {
      backgroundColor: 'hsla(0, 0%, 80%, 0.7)',
      padding: '20px',
      borderRadius: '50%',
      display: 'inline-block'
    }
  });

interface HomeProps extends WithStyles<typeof styles> {}

export class Home extends React.Component<RouteComponentProps<HomeProps>> {
  public render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <HeroImage src="https://i.imgur.com/k89796E.jpg">
          <Typography variant="h2">
            <span className={classes.logo}>bc</span>
          </Typography>
        </HeroImage>

        <div className={classes.container}>
          <Typography variant="h5">Welcome to Beer Cellar!</Typography>
          <Typography>
            We're currently in an early preview period. Our current feature list
            (and roadmap) include:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText>
                Keep track of the beers and their quantity in your cellar
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HappyIcon />
              </ListItemIcon>
              <ListItemText>
                COMING SOON: List items from your cellar For Trade (FT)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HappyIcon />
              </ListItemIcon>
              <ListItemText>
                COMING SOON: List Beers you're In Search Of (ISO)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CalendarIcon />
              </ListItemIcon>
              <ListItemText>
                PLANNED: Automatically be matched with people who would be good
                trades
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CalendarIcon />
              </ListItemIcon>
              <ListItemText>
                PLANNED: Automatic suggestions to manage your inventory with
                Untappd checkins
              </ListItemText>
            </ListItem>
          </List>
          <Button variant="contained" color="primary">
            <Link className={classes.buttonLink} to="/auth">
              Signin or Signup
            </Link>
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Home);
