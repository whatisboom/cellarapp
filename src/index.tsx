import * as React from 'react';
import ReactDom from 'react-dom';
(async () => {
  const { App } = await import('./components/App');
  ReactDom.render(<App />, document.getElementById('beercellar'));
})();
