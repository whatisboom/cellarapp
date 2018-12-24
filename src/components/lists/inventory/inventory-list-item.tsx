import * as React from 'react';
import {
  WithStyles,
  Theme,
  createStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  withStyles,
  TextField
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { IQuantity, IQuantityResponse } from 'types';
import { Link } from '@reach/router';
import { CellarApiResource } from '../../../services';

const styles = (theme: Theme) =>
  createStyles({
    updateQuantity: {
      width: 50
    },
    beerName: {
      fontWeight: theme.typography.fontWeightMedium,
      textDecoration: 'none'
    },
    breweryName: {
      opacity: 0.6
    },
    listLink: {
      display: 'block',
      width: '100%',
      textDecoration: 'none',
      color: theme.palette.getContrastText(theme.palette.background.paper)
    }
  });

interface InventoryListItemProps extends WithStyles<typeof styles> {
  row: IQuantity;
}
interface InventoryListItemState {
  editing: boolean;
}
export class InventoryListItem extends React.Component<InventoryListItemProps> {
  private inputRef: HTMLInputElement;
  public state: InventoryListItemState = {
    editing: false
  };
  public render() {
    const { classes } = this.props;
    return (
      <ListItem disableGutters={true}>
        <ListItemText
          className={classes.beerName}
          primary={this.getBeerLink()}
          secondary={this.getBreweryLink()}
        />
        {this.getRowActions()}
      </ListItem>
    );
  }

  private getRowActions(): React.ReactNode {
    const { editing } = this.state;
    return editing ? (
      <ListItemSecondaryAction>{this.getEditInput()}</ListItemSecondaryAction>
    ) : (
      <ListItemSecondaryAction>
        <EditIcon
          onClick={() => {
            this.setState({
              editing: true
            });
          }}
        />
        <DeleteIcon onClick={() => {}} />
      </ListItemSecondaryAction>
    );
  }

  private getBeerLink(): React.ReactNode {
    const { row, classes } = this.props;
    const { beer, amount } = row;
    return (
      <Link className={classes.listLink} to={`/beers/${beer.slug}`}>
        {beer.name} ({amount})
      </Link>
    );
  }
  private getBreweryLink(): React.ReactNode {
    const { row, classes } = this.props;
    const { brewery } = row.beer;
    return (
      <Link
        className={[classes.listLink, classes.breweryName].join(' ')}
        to={`/breweries/${brewery.slug}`}
      >
        {brewery.name}
      </Link>
    );
  }

  private getEditInput(): React.ReactNode {
    const { classes, row } = this.props;
    return (
      <React.Fragment>
        <TextField
          type="number"
          defaultValue={row.amount}
          label="Amount:"
          InputLabelProps={{
            shrink: true
          }}
          className={classes.updateQuantity}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            event.persist();
            if (event.keyCode === 13) {
              this.handleUpdate();
            }
          }}
          inputRef={(input) => {
            this.inputRef = input;
          }}
        />
        <CheckIcon
          onClick={() => {
            this.handleUpdate();
          }}
        />
      </React.Fragment>
    );
  }

  private async handleUpdate(): Promise<void> {
    const resource = new CellarApiResource<
      {
        ownedId: string;
        amount: number;
      },
      IQuantityResponse
    >({
      path: '/inventory/:ownedId'
    });
    const amount = parseInt(this.inputRef.value, 10);
    const ownedId = this.props.row._id;
    const { owned } = await resource.update({
      ownedId,
      amount
    });
    return this.setState({
      editing: false
    });
  }
}

export default withStyles(styles)(InventoryListItem);
