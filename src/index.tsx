import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { BeerCellarTheme } from 'components/theme';

render(
  <Provider store={store}>
    <BeerCellarTheme />
  </Provider>,
  document.getElementById('beercellar')
);
