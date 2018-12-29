declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
  interface DeepPartial {
    [key: string]: any;
  }
}

import { notifications, themeMode, user } from './reducers';
import { createStore, combineReducers } from 'redux';

const rootReducer = combineReducers({ notifications, themeMode, user });
const initialState: Object = {
  user: null,
  themeMode: localStorage.getItem('beerCellarThemeMode') || 'dark'
};
const devToolsMiddleware =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;
export const store = createStore(rootReducer, initialState, devToolsMiddleware);
