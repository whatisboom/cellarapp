import {
  UPDATE_LOGGED_IN_USER,
  LOGOUT,
  BEER_REMOVE_FROM_INVENTORY
} from 'actions';
import { IQuantity } from 'types';

export function user(state: any = null, action: any): any {
  switch (action.type) {
    case UPDATE_LOGGED_IN_USER:
      return action.user;
    case BEER_REMOVE_FROM_INVENTORY:
      const newState = JSON.parse(JSON.stringify(state));
      const { owned } = state;
      const index = owned.findIndex(
        (item: IQuantity) => item._id === action.owned._id
      );
      newState.owned.splice(index, 1);
      return newState;
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
