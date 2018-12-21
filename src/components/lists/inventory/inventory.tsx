import * as React from 'react';
import {
  List,
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { navigate } from '@reach/router';
import { IQuantity } from 'types';
import InventoryListItem from './inventory-list-item';

const styles = (theme: Theme) =>
  createStyles({
    addIcon: {
      float: 'right',
      position: 'relative',
      top: theme.spacing.unit
    },
    beerList: {
      margin: theme.spacing.unit * 2
    }
  });

interface InventoryProps extends WithStyles<typeof styles> {
  beers: IQuantity[];
}

export class Inventory extends React.Component<InventoryProps> {
  render() {
    const { beers, classes } = this.props;
    return (
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
          <InventoryListItem row={row} />
        ))}
      </List>
    );
  }
}

export default withStyles(styles)(Inventory);