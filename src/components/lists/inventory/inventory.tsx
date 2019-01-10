import * as React from 'react';
import {
  List,
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { navigate } from '@reach/router';
import { IQuantity } from 'types';
import InventoryListItem from './inventory-list-item';
import { CellarApiResource } from 'services';
import { connect } from 'react-redux';
import {
  BEER_UPDATE_INVENTORY_QUANTITY,
  BEER_REMOVE_FROM_INVENTORY
} from 'actions';

const styles = (theme: Theme) =>
  createStyles({
    addIcon: {
      float: 'right',
      position: 'relative',
      top: theme.spacing.unit / 2,
      color: theme.palette.getContrastText(theme.palette.background.default),
      opacity: 0.6
    },
    beerList: {
      margin: theme.spacing.unit
    }
  });

interface InventoryProps extends WithStyles<typeof styles> {
  beers: IQuantity[];
  updateQuantityNotification: (updated: IQuantity) => void;
  deleteFromInventory: (owned: IQuantity) => void;
}

interface InventoryState {
  deleteDialog: IQuantity | null;
}

export class Inventory extends React.Component<InventoryProps> {
  public state: InventoryState = {
    deleteDialog: null
  };

  private ownedResource = new CellarApiResource<
    {
      ownedId: string;
    },
    null
  >({
    path: '/inventory/:ownedId'
  });

  public render() {
    const { beers, classes } = this.props;
    const showDeleteDialog = this.state.deleteDialog !== null;
    return (
      <React.Fragment>
        <List
          className={classes.beerList}
          component="ul"
          subheader={
            <React.Fragment>
              <AddIcon
                className={classes.addIcon}
                onClick={() => {
                  navigate('/search/beers');
                }}
              />
              <Typography variant="h6">Inventory</Typography>
            </React.Fragment>
          }
        >
          {beers.map((row) => (
            <InventoryListItem
              key={row._id}
              row={row}
              update={this.props.updateQuantityNotification.bind(this)}
              deleteDialog={this.openDeleteDialog.bind(this)}
            />
          ))}
        </List>
        {showDeleteDialog ? this.getDeleteDialog() : null}
      </React.Fragment>
    );
  }

  public openDeleteDialog(row: IQuantity): void {
    this.setState({
      deleteDialog: row
    });
  }

  private getDeleteDialog(): React.ReactNode {
    return (
      <Dialog
        open={this.state.deleteDialog !== null}
        onClose={() => {
          console.log('onClose');
        }}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {this.state.deleteDialog.beer.name}{' '}
            from your inventory?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDelete.bind(this)}>Cancel</Button>
          <Button onClick={this.handleDelete.bind(this)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  private closeDelete(): void {
    this.setState({
      deleteDialog: null
    });
  }

  private async handleDelete(): Promise<void> {
    try {
      await this.doDelete();
      this.setState({
        deleteDialog: null
      });
    } catch (e) {
      console.log(e);
    }
  }

  private async doDelete(): Promise<void> {
    const owned = this.state.deleteDialog;
    try {
      await this.ownedResource.remove({
        ownedId: owned._id
      });
      this.props.deleteFromInventory(owned);
    } catch (e) {
      console.log(e);
    }
  }
}

function mapDispatchToProps(dispatch: React.Dispatch<any>) {
  return {
    updateQuantityNotification(updated: IQuantity): void {
      dispatch({
        type: BEER_UPDATE_INVENTORY_QUANTITY,
        updated
      });
    },
    deleteFromInventory(owned: IQuantity): void {
      dispatch({
        type: BEER_REMOVE_FROM_INVENTORY,
        owned
      });
    }
  };
}

export default withStyles(styles)(
  connect(
    null,
    mapDispatchToProps
  )(Inventory)
);
