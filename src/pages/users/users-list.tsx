import * as React from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { CellarApiResource } from '../../services/api';
import { Loader } from '../../components/loaders/loader';
import { IUserResponse, IUser } from '../../types';
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles
} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing.unit * 2
    },
    link: {
      textDecoration: 'none'
    }
  });

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

  public resource = new CellarApiResource<null, IUserResponse>({
    path: '/users'
  });

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.state.loading ? (
          <Loader />
        ) : (
          <List
            component="nav"
            subheader={<Typography variant="h4">Users</Typography>}
          >
            {this.state.users.map((user) => (
              <ListItem
                key={user._id}
                component={() => {
                  return (
                    <Link to={user.username} className={classes.link}>
                      <ListItemText
                        primary={user.username}
                        secondary={`Owned: ${user.owned.length}`}
                      />
                    </Link>
                  );
                }}
              />
            ))}
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
    } catch (e) {}
  }
}

export default withStyles(styles)(UsersListContainer);
