export function user(state: any = null, action: any): any {
  switch (action.type) {
    case 'SIGNIN':
      return action.user;
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
}
