import React from 'react';
import {keyCodes} from '../constants';

function newGrid (r, c) {
    let grid = new Array(r).fill(new Array(c).fill(0));
    let initNums = 2;
    // Put 2 in two random locations
    while (initNums > 0) {
        const cr = Math.floor(Math.random() * r);
        const cc = Math.floor(Math.random() * c);

        if (grid[r][c] === 0) {
            grid[r][c] = 2;
            initNums--;
        }
    }

    return grid;
} 

export default class Grid extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            grid: newGrid(this.props.row, this.props.col)
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
            <div id="grid">
            </div>
        );
    }
}