export function notifications(state: any[] = [], action: any): any {
  const clonedState = state.slice(0);
  switch (action.type) {
    case 'BEER_ADDED_TO_INVENTORY':
      const { beer } = action;
      const id = beer.untappdId + '#' + beer.amount;
      const text = `${beer.name} (${beer.amount}) added to inventory.`;
      const notification = {
        id,
        text
      };
      const newState = clonedState.concat(notification);
      return newState;
    default:
      return state;
  }
}
