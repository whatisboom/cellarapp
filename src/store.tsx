declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

import { navigation, notifications, darkMode, user } from './reducers';
import { createStore, combineReducers } from 'redux';
import { BEER_CELLAR_DARK_MODE_ENABLED } from 'beer-cellar-constants';

const rootReducer = combineReducers({
  navigation,
  notifications,
  darkMode,
  user
});
const initialState: Object = {
  navigation: { open: false },
  user: null,
  darkMode: localStorage.getItem(BEER_CELLAR_DARK_MODE_ENABLED) !== 'false'
};
const devToolsMiddleware =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;
export const store = createStore(rootReducer, initialState, devToolsMiddleware);
