import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Form, Field } from 'react-final-form';
import { CellarApiResource } from '../../services';
import { IBeersResponse, IBeer, IUser } from '../../types';
import BeerListItem from './beer-list-item';
import {
  List,
  IconButton,
  Theme,
  createStyles,
  WithStyles,
  withStyles
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { TextField } from 'final-form-material-ui';

interface BeerSearchProps extends WithStyles<typeof styles> {
  user: IUser;
}
interface BeerSearchState {
  beers: IBeer[];
}

const styles = (theme: Theme) =>
  createStyles({
    right: {
      float: 'right',
      position: 'relative',
      top: theme.spacing.unit
    },
    searchField: {
      margin: theme.spacing.unit,
      display: 'flex'
    }
  });

export class BeerSearch extends React.Component<
  RouteComponentProps<BeerSearchProps>,
  BeerSearchState
> {
  private resource: CellarApiResource<
    {
      q: string;
    },
    IBeersResponse
  > = new CellarApiResource({
    path: '/search/beers'
  });

  public state: BeerSearchState = { beers: [] };

  public render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Form
          validate={this.validate}
          onSubmit={this.onSubmit.bind(this)}
          render={({ handleSubmit, pristine, invalid }) => (
            <form onSubmit={handleSubmit} autoComplete="off">
              <IconButton
                type="submit"
                color="primary"
                disabled={pristine || invalid}
                className={classes.right}
              >
                <SearchIcon />
              </IconButton>
              <Field
                className={classes.searchField}
                name="q"
                component={TextField}
                label="Search Beers"
                autoFocus={true}
              />
            </form>
          )}
        />
        <List>
          {this.state.beers.map((beer, index) => (
            <BeerListItem key={index} beer={beer} />
          ))}
        </List>
      </React.Fragment>
    );
  }

  private async onSubmit(formValues: { [key: string]: string }): Promise<void> {
    const { q } = formValues;
    try {
      const { beers } = await this.resource.read({
        q
      });
      this.setState({ beers });
    } catch (e) {
      console.log(e);
    }
  }

  private validate(values: { [key: string]: string }): any {
    if (values.q && values.q.length < 3) {
      return {
        q: 'Minimum 3 characters'
      };
    }
  }
}

export default withStyles(styles)(BeerSearch);
