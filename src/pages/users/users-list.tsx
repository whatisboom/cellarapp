import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { CellarApiResource } from 'services/api';
import Loader from 'components/loaders/loader';
import { IUserResponse, IUser } from 'types';
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles
} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import SearchIcon from '@material-ui/icons/Search';
import { InputAdornment, ListItemAvatar, Avatar } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing.unit
    },
    searchForm: {
      display: 'flex',
      paddingBottom: theme.spacing.unit
    },
    searchField: {
      flex: 1
    }
  });

interface ISearchForm {
  search: string;
}

interface UsersListProps extends WithStyles<typeof styles> {}

interface IComponentState {
  users?: IUser[];
  loading: boolean;
}
export class UsersListContainer extends React.Component<
  RouteComponentProps<UsersListProps>
> {
  public state: IComponentState = {
    loading: true
  };

  public resource = new CellarApiResource<null | ISearchForm, IUserResponse>({
    path: '/users'
  });

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {this.getSearch()}
        {this.state.loading ? (
          <Loader />
        ) : (
          <List
            component="nav"
            subheader={<Typography variant="h4">Users</Typography>}
          >
            {this.state.users.map(this.getListItem)}
          </List>
        )}
      </div>
    );
  }

  public async componentDidMount() {
    try {
      const { users } = await this.resource.list();
      this.setState({
        users,
        loading: false
      });
    } catch (e) {
      console.log(e);
    }
  }

  private getSearch(): React.ReactNode {
    const { classes } = this.props;
    return (
      <Form
        validate={this.validateSearch.bind(this)}
        onSubmit={this.searchSubmit.bind(this)}
        render={({ handleSubmit, pristine, invalid, values }) => (
          <form
            className={classes.searchForm}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <Field
              className={classes.searchField}
              name="search"
              component={TextField}
              label="Search Users"
              autoFocus={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </form>
        )}
      />
    );
  }

  private async searchSubmit(values: ISearchForm): Promise<void> {
    let users;
    try {
      const { search } = values;
      const response = await this.resource.list({
        search
      });
      users = response.users;
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({
        users,
        loading: false
      });
    }
  }

  private validateSearch(values: object): object {
    return {};
  }

  private getListItem(user: IUser) {
    return (
      <ListItem
        disableGutters={true}
        key={user._id}
        component={(props) => <Link to={user.username} {...props} />}
      >
        <ListItemAvatar>
          <Avatar alt={user.username} src={user.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={user.username}
          secondary={`Owned: ${user.owned.length}`}
        />
      </ListItem>
    );
  }
}

export default withStyles(styles)(UsersListContainer);
