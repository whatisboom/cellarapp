import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
require('normalize.css');
require('./core.css');

(async () => {
  const { AppConnected } = await import('./pages/App');
  render(
    <Provider store={store}>
      <AppConnected />
    </Provider>,
    document.getElementById('beercellar')
  );
})();
