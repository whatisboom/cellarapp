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

const rootReducer = combineReducers({ user, notifications });
const initialState: Object = {
  user: null
};
const devToolsMiddleware =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;
export const store = createStore(rootReducer, initialState, devToolsMiddleware);
