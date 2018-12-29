declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
  interface DeepPartial {
    [key: string]: any;
  }
}

import { notifications, user } from './reducers';
import { createStore, combineReducers } from 'redux';

export const store = createStore(
  combineReducers({ user, notifications }),
  {
    user: null
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
