import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import GlobalStyle from './components/GlobalStyle';

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('game'),
);

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    const pathname = window.location.pathname.replace(/\/$/g, '');
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(`${pathname}/service-worker.js`)
        .then((registration) => {
          // eslint-disable-next-line no-console
          console.log('SW registered:', registration);
        })
        // eslint-disable-next-line no-console
        .catch((e) => console.error('SW registration failed', e));
    });
  }
}
