import * as React from 'react';
import {
  WithStyles,
  Theme,
  createStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  withStyles
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { IQuantity } from 'types';
import { Link } from '@reach/router';

const styles = (theme: Theme) =>
  createStyles({
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
  public state: InventoryListItemState = {
    editing: false
  };
  public render() {
    const { row, classes } = this.props;
    return (
      <ListItem key={row._id} disableGutters={true}>
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
    return (
      <ListItemSecondaryAction>
        <EditIcon onClick={() => {}} />
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
}

export default withStyles(styles)(InventoryListItem);
