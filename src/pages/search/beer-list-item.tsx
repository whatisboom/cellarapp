import * as React from 'react';
import { connect } from 'react-redux';
import { IBeer, IUser } from '../../types';
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

import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';

const styles = (theme: Theme) =>
  createStyles({
    addField: {
      width: 50
    }
  });

interface BeerListItemProps extends WithStyles<typeof styles> {
  beer: IBeer;
  user: IUser;
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
    const { user } = this.props;
    const url = `/users/${user.username}/beers/${beer.slug}`;
    const body = {
      amount
    };
    console.log(url, body);
  }
}

function mapStateToProps(state: any, ownProps: any) {
  const { user } = state;
  return {
    user
  };
}

export default connect(mapStateToProps)(withStyles(styles)(BeerListItem));
