import React from 'react';
import PropTypes from 'prop-types';
import {keyCodes} from '../utils/constants';
import {randomCellValue} from '../utils/helper';
import Tile from './Tile';

export default class Board extends React.Component {
    static propTypes = {
        startTiles: PropTypes.number.isRequired,
        gridSize: PropTypes.number.isRequired,
        gridSpacing: PropTypes.number.isRequired,
        rows: PropTypes.number.isRequired,
        cols: PropTypes.number.isRequired,
        cellWidth: PropTypes.number.isRequired,
        cellHeight: PropTypes.number.isRequired
    }

    constructor (props) {
        super(props);
    }

    componentWillMount () {
        document.addEventListener('keydown', this.keyDownHandler, false);
    }

    componentDidMount () {
        this.gridContainer.addEventListener('transitionend', this.transitionEndHandler, false);
        this.addStartTiles();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDownHandler, false);
    }

    render () {

    }

    keyDownHandler = (event) => {

    }

    transitionEndHandler = (event) => {

    }

    addStartTiles = () => {
        // add from save 
        if (this.props.savedGrid) {

        } else {
            
        }
    }


}