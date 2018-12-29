declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
  interface DeepPartial {
    [key: string]: any;
  }
}

import { notifications, darkMode, user } from './reducers';
import { createStore, combineReducers } from 'redux';
import { BEER_CELLAR_DARK_MODE_ENABLED } from 'beer-cellar-constants';

const rootReducer = combineReducers({ notifications, darkMode, user });
const initialState: Object = {
  user: null,
  darkMode: localStorage.getItem(BEER_CELLAR_DARK_MODE_ENABLED) !== 'false'
};
const devToolsMiddleware =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;
export const store = createStore(rootReducer, initialState, devToolsMiddleware);
