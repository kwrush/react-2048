import React from 'react';
import ReactDOM from 'react-dom';
import style from './style/index.scss';
import Game from './components/Game';

const width = window.outerWidth;
const padding = 5;
ReactDOM.render(
  <Game initialGridSize={width} padding={padding} maxGridSize={360} />,
  document.getElementById('game'),
);
