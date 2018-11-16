import { createStore, Action } from 'redux';
function signinReducer(state: { [key: string]: any } = {}, action: any): any {
  switch (action.type) {
    case 'SIGNIN':
      return { ...state, user: action.user };
    default:
      return state;
  }
}
export const store = createStore(signinReducer, {});
