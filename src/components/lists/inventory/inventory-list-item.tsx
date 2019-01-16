import * as React from 'react';
import {
  WithStyles,
  Theme,
  createStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  withStyles,
  Typography,
  Collapse
} from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/NotInterested';
import Slider from '@material-ui/lab/Slider';
import { IOwned, IUpdateOwnedResponse } from 'types';
import { CellarApiResource } from 'services';

const styles = (theme: Theme) =>
  createStyles({
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
      color: green[500]
    },
    cancelIcon: {
      color: red[500],
      position: 'relative',
      top: -1,
      fontSize: 20
    },
    slider: {
      margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit * 2}px`
    }
  });

interface InventoryListItemProps extends WithStyles<typeof styles> {
  row: IOwned;
  update: (beer: IOwned) => void;
  deleteDialog: (row: IOwned) => void;
}
interface InventoryListItemState {
  editing: boolean;
  amount: number;
}
export class InventoryListItem extends React.Component<InventoryListItemProps> {
  public state: InventoryListItemState = {
    editing: false,
    amount: this.props.row.amount
  };
  public render() {
    const { classes, row } = this.props;
    const { amount, editing } = this.state;
    return (
      <React.Fragment>
        <ListItem
          disableGutters={true}
          onClick={() => {
            this.setState({
              editing: !editing
            });
          }}
        >
          <ListItemText
            className={classes.beerName}
            primary={row.beer.name}
            secondary={row.beer.brewery.name}
          />
          <ListItemSecondaryAction>
            {editing && (
              <React.Fragment>
                <CheckIcon
                  className={[classes.icon, classes.checkIcon].join(' ')}
                  onClick={this.handleUpdate.bind(this)}
                />
                <CancelIcon
                  className={[classes.icon, classes.cancelIcon].join(' ')}
                  onClick={this.handleCancel.bind(this)}
                />
              </React.Fragment>
            )}
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={editing}>
          <Typography variant="caption">
            Amount in inventory: {amount > 12 ? 'Unlimited' : amount}
          </Typography>
          <Slider
            className={classes.slider}
            value={amount}
            min={0}
            max={13}
            step={1}
            onChange={this.onChange.bind(this, 'amount')}
          />
        </Collapse>
      </React.Fragment>
    );
  }

  private onChange(name: string, e: React.ChangeEvent, value: number): void {
    this.setState({
      [name]: value
    });
  }

  private handleCancel(): void {
    this.setState({
      editing: false,
      amount: this.props.row.amount
    });
  }

  private async handleUpdate(): Promise<void> {
    if (this.props.row.amount === this.state.amount) {
      return this.setState({
        editing: false
      });
    }
    const resource = new CellarApiResource<
      {
        ownedId: string;
        amount: number;
      },
      IUpdateOwnedResponse
    >({
      path: '/inventory/:ownedId'
    });
    const amount = this.state.amount;
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
