import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { BeerCellarTheme } from 'components/theme';

(async () => {
  const {
    AppConnected
  } = await import(/* webpackChunkName: "main" */ './pages/app');
  render(
    <BeerCellarTheme>
      <Provider store={store}>
        <AppConnected />
      </Provider>
    </BeerCellarTheme>,
    document.getElementById('beercellar')
  );
})();
