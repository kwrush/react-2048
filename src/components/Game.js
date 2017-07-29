import React from 'react';
import PropTypes from 'prop-types';
import Score from './Score';
import Resize from './Resize';
import Grid from './Grid';
import Board from './Board';
import Overlay from './Overlay';
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
            reset: false,
            scoreAdded: 0,
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
                    <Score score={this.state.score} scoreAdded={this.state.scoreAdded} resetScoreAdded={this.resetScoreAdded}/>
                </header>
                <div className="game-ctrl">
                    <button id="reset" className="button" onClick={this.reset}>New Game</button>
                    <Resize label='Rows:' number={this.state.rows} resize={this.changeRow} />
                    <Resize label='Columns:' number={this.state.cols} resize={this.changeCol} />
                </div>
                <div className="grid-container">
                    <Overlay 
                        win={this.state.win}
                        lose={this.state.lose}
                        reset={this.reset}
                        continue={this.continueGame}
                    />
                    <Grid {...props}/>
                    <Board 
                        {...props}
                        reset={this.state.reset}
                        pause={this.state.win || this.state.lose}
                        winGame={this.winGame}
                        gameOver={this.gameOver}
                        startTiles={this.props.startTiles} 
                    />
                </div>
                <footer id="footer">
                    <p>Join tiles with the same number and get to the 2048 tile</p>
                </footer>
            </div>
        );
    }

    reset = () => {
        this.setState({
            reset: true,
            win: false,
            lose: false,
            score: 0,
            scoreAdded: 0
        }, () => {
            this.setState({
                reset: false
            });
        });
    }

    winGame = () => {
        this.setState({
            win: true,
            lose: false
        });
    }

    gameOver = () => {
        this.setState({
            win: false,
            lose: true
        });
    }

    continueGame = () => {
        this.setState({
            win: false,
            lose: false,
            reset: false
        })
    }

    changeRow = (diff) => {
        let rows = this.state.rows + diff;
        if (rows <= this.props.maxRow && rows >= this.props.minRow) {
            this.setState({
                score: 0,
                scoreAdded: 0,
                rows: rows
            });
        }
    }

    changeCol = (diff) => {
        let cols = this.state.cols + diff;
        if (cols <= this.props.maxCol && cols >= this.props.minCol) {
            this.setState({
                score: 0,
                scoreAdded: 0,
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

    resetScoreAdded = (event) => {
        this.setState({
            scoreAdded: 0
        })
    }
}

