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
      margin: `${theme.spacing.unit}px 0 ${theme.spacing.unit * 2}px`,
      touchAction: 'none'
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
  forTrade: number;
}
export class InventoryListItem extends React.Component<InventoryListItemProps> {
  public state: InventoryListItemState = {
    editing: false,
    amount: this.props.row.amount,
    forTrade: this.props.row.forTrade
  };
  public render() {
    const { classes, row } = this.props;
    const { amount, editing, forTrade } = this.state;
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
            Amount in inventory: {amount}
          </Typography>
          <Slider
            className={classes.slider}
            value={amount}
            min={0}
            max={12}
            step={1}
            onChange={this.onAmountTrade.bind(this)}
          />
          <Typography variant="caption">
            Amount for trade: {forTrade}
          </Typography>
          <Slider
            className={classes.slider}
            value={forTrade}
            min={0}
            max={12}
            step={1}
            onChange={this.onForTradeChange.bind(this)}
          />
        </Collapse>
      </React.Fragment>
    );
  }

  private onAmountTrade(e: React.ChangeEvent, amount: number): void {
    const { forTrade } = this.state;
    if (amount < forTrade) {
      this.setState({
        amount,
        forTrade: amount
      });
    } else {
      this.setState({ amount });
    }
  }

  private onForTradeChange(e: React.ChangeEvent, forTrade: number): void {
    const { amount } = this.state;
    if (forTrade > amount) {
      this.setState({
        amount: forTrade,
        forTrade
      });
    } else {
      this.setState({ forTrade });
    }
  }

  private handleCancel(): void {
    this.setState({
      editing: false,
      amount: this.props.row.amount,
      forTrade: this.props.row.forTrade
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
        forTrade?: number;
      },
      IUpdateOwnedResponse
    >({
      path: '/inventory/:ownedId'
    });
    const amount = this.state.amount;
    const forTrade = this.state.forTrade;
    const ownedId = this.props.row._id;
    const { beer } = await resource.update({
      ownedId,
      amount,
      forTrade
    });
    this.props.update(beer);
    return this.setState({
      editing: false
    });
  }
}

export default withStyles(styles)(InventoryListItem);
