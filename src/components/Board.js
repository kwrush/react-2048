import React from 'react';
import {keyCodes} from '../constants';

// Board controls how the tile being moved
export default class Board extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            grid: newTileBoard(this.props.row, this.props.col)
        }

        this.moveDown = this.moveDown.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
    }

    componentWillMount () {
        window.addEventListener('keydown', this.keyDownHandler, true);
    }

    componentWillUnmount () {
        window.removeEventListener('keydown', this.keyDownHandler, true);
    }

    newTileBoard(r, c) {

    }

    keyDownHandler (event) {
        switch (event.keyCode) {
            case keyCodes.LEFT:

            case keyCodes.RIGHT:

            case keyCodes.UP:
            case keyCodes.DOWN:
            default:
        }

        console.log(event.keyCode);
    }

    moveUp () {
        
    }

    moveDown () {

    }

    moveLeft () {

    }

    moveRight () {
        
    }

    render () {
        return (
            <div id="game-board">

            </div>
        );
    }
}