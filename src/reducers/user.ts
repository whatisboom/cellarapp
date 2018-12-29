export function user(state: any = null, action: any): any {
  switch (action.type) {
    case 'UPDATE_LOGGED_IN_USER':
      console.log('update');
      return action.user;
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
}
