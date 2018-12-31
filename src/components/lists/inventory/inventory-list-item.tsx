import * as React from 'react';
import {
  WithStyles,
  Theme,
  createStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  withStyles,
  TextField,
  Typography
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import { IQuantity, IQuantityResponse } from 'types';
import { CellarApiResource } from 'services';

const styles = (theme: Theme) =>
  createStyles({
    updateQuantity: {
      width: 35
    },
    beerName: {
      fontWeight: theme.typography.fontWeightMedium,
      textDecoration: 'none'
    },
    breweryName: {
      opacity: 0.6
    },
    icon: {
      color: theme.palette.getContrastText(theme.palette.background.default),
      marginLeft: theme.spacing.unit / 2
    },
    listLink: {
      display: 'block',
      width: '100%',
      textDecoration: 'none',
      color: theme.palette.getContrastText(theme.palette.background.default)
    },
    checkIcon: {
      top: theme.spacing.unit,
      position: 'relative'
    }
  });

interface InventoryListItemProps extends WithStyles<typeof styles> {
  row: IQuantity;
  update: (beer: IQuantity) => void;
  deleteDialog: (row: IQuantity) => void;
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
    const { classes, row } = this.props;
    return (
      <ListItem
        disableGutters={true}
        onClick={() => {
          this.setState({
            editing: true
          });
        }}
      >
        <ListItemText
          className={classes.beerName}
          primary={row.beer.name}
          secondary={row.beer.brewery.name}
        />
        {this.getRowActions()}
      </ListItem>
    );
  }

  private getRowActions(): React.ReactNode {
    const { row } = this.props;
    const { editing } = this.state;
    return (
      <ListItemSecondaryAction>
        {editing ? (
          this.getEditInput()
        ) : (
          <Typography>({row.amount})</Typography>
        )}
      </ListItemSecondaryAction>
    );
  }

  private getEditInput(): React.ReactNode {
    const { classes, row, deleteDialog } = this.props;
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
          className={[classes.icon, classes.checkIcon].join(' ')}
          onClick={() => {
            this.handleUpdate();
          }}
        />
        <DeleteIcon
          className={[classes.icon, classes.checkIcon].join(' ')}
          onClick={() => {
            deleteDialog(row);
            this.setState({
              editing: false
            });
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
    const { beer } = await resource.update({
      ownedId,
      amount
    });
    this.props.update(beer);
    return this.setState({
      editing: false
    });
  }
}

export default withStyles(styles)(InventoryListItem);
