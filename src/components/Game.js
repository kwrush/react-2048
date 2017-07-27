import React from 'react';
import PropTypes from 'prop-types';
import Score from './Score';
import Resize from './Resize';
import Grid from './Grid';
import Board from './Board';
import {
    calcGridSpacing, 
    calcCellHeight,
    calcCellWidth
} from '../utils/helpers';

export default class Game extends React.Component {
    static propTypes = {
        startTiles: PropTypes.number,
        maxRow: PropTypes.number,
        maxCol: PropTypes.number,
        minRow: PropTypes.number,
        minCol: PropTypes.number,
        gridSize: PropTypes.number,
        max: PropTypes.number,
        fromSave: PropTypes.bool.isRequired
    }

    static defaultProps = {
        minRow: 4,
        minCol: 4,
        maxRow: 10,
        maxCol: 10,
        max: 2048,
        startTiles: 2,
        gridSize: 360
    }

    constructor (props) {
        super(props);

        this.state = {
            rows: this.props.minRow,
            cols: this.props.minCol,
            win: false,
            lose: false,
            scoreAdded: null,
            score: 0
        }
    }

    render () {
        const gridSize = this.props.gridSize;
        const rows = this.state.rows;
        const cols = this.state.cols;
        const gridSpacing = calcGridSpacing(gridSize, rows >= cols ? rows : cols);
        
        const props = {
            gridSize: gridSize,
            gridSpacing: gridSpacing,
            cellHeight: calcCellHeight(gridSize, rows, gridSpacing),
            cellWidth: calcCellWidth(gridSize, cols, gridSpacing),
            rows: rows,
            cols: cols,
            addScore: this.addScore
        }

        return (
            <div id="game">
                <header className="game-heading">
                    <h1>2048</h1>
                    <Score score={this.state.score} scoreAdded={this.state.scoreAdded}/>
                </header>
                <div className="game-ctrl">
                    <Resize label='Rows:' number={this.state.rows} resize={this.changeRow} />
                    <Resize label='Columns:' number={this.state.cols} resize={this.changeCol} />
                    <button id="reset" className="button">New Game</button>
                </div>
                <div className="grid-container">
                    <Grid {...props}/>
                    <Board 
                        {...props}
                        startTiles={this.props.startTiles} 
                    />
                </div>
                <footer id="footer">
                    <p>Join tiles with the same number and get to the 2048 tile</p>
                </footer>
            </div>
        );
    }

    changeRow = (diff) => {
        let rows = this.state.rows + diff;
        if (rows <= this.props.maxRow && rows >= this.props.minRow) {
            this.setState({
                rows: rows
            });
        }
    }

    changeCol = (diff) => {
        let cols = this.state.cols + diff;
        if (cols <= this.props.maxCol && cols >= this.props.minCol) {
            this.setState({
                cols: cols
            });
        }
    }

    addScore = (value) => {
        this.setState({
            scoreAdded: value,
            score: this.state.score + value
        });
    } 
}

