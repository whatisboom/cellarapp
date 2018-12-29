import * as React from 'react';
import { connect } from 'react-redux';
import { IBeer, IUser, IUserResponse } from '../../types';

import {
  ListItem,
  TextField,
  ListItemText,
  ListItemSecondaryAction,
  Theme,
  createStyles,
  WithStyles,
  withStyles
} from '@material-ui/core';
import { BEER_ADDED_TO_INVENTORY } from '../../actions';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import { CellarApiResource } from '../../services';

const styles = (theme: Theme) =>
  createStyles({
    addField: {
      width: 50
    }
  });

interface BeerListItemProps extends WithStyles<typeof styles> {
  beer: IBeer;
  user: IUser;
  updated: (amount: number) => void;
}

interface BeerListItemState {
  adding: boolean;
}

export class BeerListItem extends React.Component<
  BeerListItemProps,
  BeerListItemState
> {
  private inputRef: HTMLInputElement;
  public state: BeerListItemState = {
    adding: false
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
    const { adding } = this.state;

    return (
      <ListItem>
        <ListItemText primary={beer.name} secondary={beer.brewery.name} />
        <ListItemSecondaryAction>
          {adding ? (
            <React.Fragment>
              <TextField
                type="number"
                defaultValue="1"
                label="Amount:"
                InputLabelProps={{
                  shrink: true
                }}
                className={classes.addField}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  event.persist();
                  if (event.keyCode === 13) {
                    this.addToMyInventory(
                      beer,
                      parseInt(this.inputRef.value, 10)
                    );
                  }
                }}
                inputRef={(input) => {
                  this.inputRef = input;
                }}
              />
              <CheckIcon
                onClick={() => {
                  this.addToMyInventory(
                    beer,
                    parseInt(this.inputRef.value, 10)
                  );
                }}
              />
            </React.Fragment>
          ) : (
            <AddIcon
              onClick={() =>
                this.setState({
                  adding: true
                })
              }
            />
          )}
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
  private async addToMyInventory(beer: IBeer, amount: number): Promise<void> {
    try {
      const { user } = this.props;
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BeerListItem));
