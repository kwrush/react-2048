import React from 'react';
import ReactDOM from 'react-dom';
import style from './style/index.scss';
import Game from './components/Game';

ReactDOM.render(<Game fromSave={false} />, document.getElementById('game'));