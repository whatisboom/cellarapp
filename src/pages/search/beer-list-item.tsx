import * as React from 'react';
import { connect } from 'react-redux';
import { IBeer, IUser, IUserResponse } from 'types';

import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Collapse,
  Typography
} from '@material-ui/core';
import { BEER_ADDED_TO_INVENTORY } from 'actions';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import { CellarApiResource } from 'services';
import Slider from '@material-ui/lab/Slider';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

const styles = (theme: Theme) =>
  createStyles({
    icon: {
      color: theme.palette.getContrastText(theme.palette.background.default)
    },
    checkIcon: {
      color: green[500]
    },
    cancelIcon: {
      color: red[500]
    },
    slider: {
      margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit * 2}px`
    }
  });

interface BeerListItemProps extends WithStyles<typeof styles> {
  beer: IBeer;
  user: IUser;
  updated?: (amount: number) => void;
}

interface BeerListItemState {
  adding: boolean;
  amount: number;
}

export class BeerListItem extends React.Component<
  BeerListItemProps,
  BeerListItemState
> {
  public state: BeerListItemState = {
    adding: false,
    amount: 1
  };

  private addBeerToUser = new CellarApiResource<
    {
      username: string;
      untappdId: number;
      amount: number;
    },
    IUserResponse
  >({
    path: '/users/:username/beers/:untappdId'
  });

  render() {
    const { beer, classes } = this.props;
    const { adding, amount } = this.state;

    return (
      <React.Fragment>
        <ListItem disableGutters={true}>
          <ListItemText primary={beer.name} secondary={beer.brewery.name} />
          <ListItemSecondaryAction>
            {adding ? (
              <CheckIcon
                className={classes.checkIcon}
                onClick={this.addToMyInventory.bind(this)}
              />
            ) : (
              <AddIcon
                className={classes.icon}
                onClick={() =>
                  this.setState({
                    adding: true
                  })
                }
              />
            )}
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={adding}>
          <Typography variant="caption">
            Amount in inventory: {amount > 12 ? 'Unlimited' : amount}
          </Typography>
          <Slider
            className={classes.slider}
            value={amount}
            min={1}
            max={13}
            step={1}
            onChange={this.onChange.bind(this)}
          />
        </Collapse>
      </React.Fragment>
    );
  }
  private onChange(e: React.ChangeEvent, amount: number): void {
    this.setState({
      amount
    });
  }

  private async addToMyInventory(): Promise<void> {
    try {
      const { user, beer } = this.props;
      const { amount } = this.state;
      await this.addBeerToUser.create({
        username: user.username,
        untappdId: beer.untappdId,
        amount
      });
      this.setState({
        adding: false
      });
      this.props.updated(amount);
    } catch (e) {
      console.log(e);
    }
  }
}

function mapStateToProps(state: any, ownProps: BeerListItemProps) {
  const { user } = state;
  return {
    user
  };
}

function mapDispatchToProps(dispatch: any, ownProps: BeerListItemProps) {
  const props = {
    updated: (amount: number) => {
      dispatch({
        type: BEER_ADDED_TO_INVENTORY,
        beer: { ...ownProps.beer, amount }
      });
    }
  };
  return props;
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BeerListItem)
);
