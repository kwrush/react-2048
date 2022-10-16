import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import GlobalStyle from './components/GlobalStyle';

const container = document.getElementById('game') as HTMLElement;
const root = createRoot(container);
root.render(
  <>
    <GlobalStyle />
    <App />
  </>,
);
