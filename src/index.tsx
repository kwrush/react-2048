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
