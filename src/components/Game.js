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
import Store from '../utils/store';

export default class Game extends React.Component {
    static propTypes = {
        startTiles: PropTypes.number,
        maxRow: PropTypes.number,
        maxCol: PropTypes.number,
        minRow: PropTypes.number,
        minCol: PropTypes.number,
        initialGridSize: PropTypes.number,
        padding: PropTypes.number,
        max: PropTypes.number,
        maxGridSize: PropTypes.number
    }

    static defaultProps = {
        minRow: 4,
        minCol: 4,
        maxRow: 10,
        maxCol: 10,
        max: 2048,
        startTiles: 2,
        padding: 5,
        initialGridSize: 360,
        maxGridSize: 360
    }

    constructor (props) {
        super(props);

        const width = this.props.initialGridSize > this.props.maxGridSize ? 
            this.props.maxGridSize : this.props.initialGridSize;

        this.state = {
            rows: this.props.minRow,
            cols: this.props.minCol,
            win: false,
            lose: false,
            reset: false,
            continue: false,
            scoreAdded: 0,
            score: 0,
            bestScore: 0,
            gridSize: width - 2 * this.props.padding
        }
    }

    componentWillMount () {
        if (Store.getBestScore() === null) {
            Store.init(); 
        }

        window.addEventListener('resize', this._windowResize, false);
    }

    componentDidMount () {
        this.setState({
            bestScore: Store.getBestScore()
        });
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this._windowResize, false);
    }

    componentDidUpdate (prevProps, prevState) {
        const bestScore = Store.getBestScore();
        if (this.state.score > bestScore) {
            this.setState({
                bestScore: this.state.score
            });

            Store.saveBestScore(this.state.score);
        }
    }

    render () {
        
        const {gridSize, rows, cols, gridSpacing} = this.calcDemension();
        
        const props = {
            gridSize: gridSize,
            gridSpacing: gridSpacing,
            cellHeight: calcCellHeight(gridSize, rows, gridSpacing),
            cellWidth: calcCellWidth(gridSize, cols, gridSpacing),
            rows: rows,
            cols: cols,
            max: this.props.max,
            addScore: this.addScore
        }

        return (
            <div id="game" style={{width: `${gridSize}px`}}>
                <header className="game-heading">
                    <h1>2048</h1>
                    <Score 
                        score={this.state.score} 
                        scoreAdded={this.state.scoreAdded} 
                        resetScoreAdded={this.resetScoreAdded}
                        bestScore={this.state.bestScore}
                    />
                </header>
                <div className="game-ctrl">
                    <button id="reset" className="button" onClick={this.reset}>New Game</button>
                    <Resize label='Rows:' number={this.state.rows} resize={this.changeRow} />
                    <Resize label='Columns:' number={this.state.cols} resize={this.changeCol} />
                </div>
                <div className="grid-container" style={{width: `${gridSize}px`, height: `${gridSize}px`}}>
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
                        continue={this.state.continue}
                        pause={this.state.win || this.state.lose}
                        winGame={this.winGame}
                        gameOver={this.gameOver}
                        startTiles={this.props.startTiles} 
                    />
                </div>
                <footer id="footer">
                    <p>Join tiles with the same value to get the 2048 tile</p>
                </footer>
            </div>
        );
    }

    _windowResize = (event) => {
        const width = window.outerWidth > this.props.maxGridSize ? this.props.maxGridSize : window.outerWidth;
        this.setState({
            gridSize: width - this.props.padding * 2
        });
    }

    calcDemension = () => {
        const r = this.state.rows;
        const c = this.state.cols;
        const width = this.state.gridSize;
        return {
            gridSize: this.state.gridSize,
            rows: r,
            cols: c,
            gridSpacing: calcGridSpacing(width, r >= c ? r : c)
        }
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

    // Continue the game even if there's a 2048 tiles
    continueGame = () => {
        this.setState({
            win: false,
            lose: false,
            continue: true,
            reset: false
        })
    }

    /**
     * Change row numbers of the grid
     * @param {number} row number to add
     */
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

    /**
     * Change column numbers of the grid
     * @param {number} column number to add
     */
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

    /**
     * Add score
     * @param {number} value of score to add
     */
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

