import {
  BEER_UPDATE_INVENTORY_QUANTITY,
  BEER_ADDED_TO_INVENTORY,
  SHOW_GENERIC_NOTIFICATION,
  ERROR_NOTIFICATION
} from 'actions';

export function notifications(state: any[] = [], action: any): any {
  const clonedState = state.slice(0);
  let id = '';
  let text = '';
  let status = 'neutral';
  switch (action.type) {
    case BEER_ADDED_TO_INVENTORY:
      id = action.beer.untappdId + '#' + action.beer.amount + new Date();
      text = `${action.beer.name} (${action.beer.amount}) added to inventory.`;
      status = 'success';
      clonedState.push({ id, text, status });
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
      status = 'success';
      clonedState.push({ id, text, status });
      return clonedState;
    case SHOW_GENERIC_NOTIFICATION:
      clonedState.push(action.notification);
      return clonedState;
    case ERROR_NOTIFICATION:
      clonedState.push({
        id: +new Date(),
        text: JSON.stringify(action.error.message),
        status: 'error'
      });
    default:
      return state;
  }
}
