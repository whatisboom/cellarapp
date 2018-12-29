import {
  BEER_UPDATE_INVENTORY_QUANTITY,
  BEER_ADDED_TO_INVENTORY
} from '../actions';

export function notifications(state: any[] = [], action: any): any {
  const clonedState = state.slice(0);
  let id = '';
  let text = '';
  switch (action.type) {
    case BEER_ADDED_TO_INVENTORY:
      id = action.beer.untappdId + '#' + action.beer.amount + new Date();
      text = `${action.beer.name} (${action.beer.amount}) added to inventory.`;
      clonedState.push({ id, text });
      return clonedState;
    case BEER_UPDATE_INVENTORY_QUANTITY:
      id =
        action.updated.beer.untappdId +
        '#' +
        action.updated.amount +
        new Date();
      text = `${action.updated.beer.name} updated with quantity ${
        action.updated.amount
      }`;
      clonedState.push({ id, text });
      return clonedState;
    default:
      return state;
  }
}
