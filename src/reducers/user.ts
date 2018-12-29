import { UPDATE_LOGGED_IN_USER, LOGOUT } from 'actions';

export function user(state: any = null, action: any): any {
  switch (action.type) {
    case UPDATE_LOGGED_IN_USER:
      return action.user;
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
