import * as React from 'react';
import { render } from 'react-dom';
(async () => {
  const { App } = await import('./pages/App');
  render(<App />, document.getElementById('beercellar'));
})();
