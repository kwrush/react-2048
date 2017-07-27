import React from 'react';
import PropTypes from 'prop-types';
import Immutable, {Map, List} from 'immutable';
import {keyCodes, VECTORS} from '../utils/constants';
import {randomCellValue, within2dList, newId} from '../utils/helpers';
import Tile from './Tile';

export default class Board extends React.Component {

    // Queue of moving tiles. Needed for performing some actions, such as
    // merging tiles or create a new tile, after finishing the 
    // current transition event
    moveQueue = []

    // Collection of tile components
    tilesView = []

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
        this.state = {
            grid: this.createEmptyGrid()
        };
    }

    componentDidMount () {
        document.addEventListener('keydown', this.keyDownHandler, false);
        this.addStartTiles();
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this.keyDownHandler, false);
    }

    shouldComponentUpdate (nextProps, nextState) {
        return this.isResized(nextProps) || !Immutable.is(this.state.grid, nextState.grid);
    }

    componentWillUpdate (nextProps, nextState) {
        let tiles = [];
        nextState.grid.flatten(1).forEach((cell) => {
            cell.get('tile').forEach(tile => {
                tiles.push(<Tile
                    key={tile.get('id')}
                    width={this.props.cellWidth}
                    height={this.props.cellHeight}
                    x={cell.get('x')}
                    y={cell.get('y')}
                    {...tile.toJS() }
                />);
            });
        });

        this.tilesView = tiles.sort((t1, t2) => {
            return parseInt(t1.key, 10) - parseInt(t2.key, 10);
        });
    }

    componentDidUpdate (prevProps, nextState) {
        if (this.isResized(prevProps)) {
            this.setState({
                grid: this.createEmptyGrid()
            }, () => {
                this.addStartTiles();
            });
        } else {
            const availableCells = this.findEmptyCells();
            if (availableCells.length === 0) {

            }
        }
    }

    render () {
        return (
            <div className="board" onTransitionEnd={this.transitionEndHandler} onAnimationEnd={this.animationEndHandler}>
                {this.tilesView}
            </div>
        );
    }

    /**
     * Check if the grid is resized
     * @param {object} next props
     * @return {boolean} true if the grid has been resized
     */
    isResized = (nextProps) => {
        return this.props.rows !== nextProps.rows || this.props.cols !== nextProps.cols;
    }
    
    
    /**
     * Handle keydown event
     * @param {object} event object
     */
    keyDownHandler = (event) => {
        // Do nothing until the previous event is finished
        if (this.moveQueue.length > 0) return;

        let vector = {x: 0, y: 0};
        switch (event.keyCode) {
            case keyCodes.UP:
                vector = this.getDirection('UP');
                break;
            case keyCodes.RIGHT:
                vector = this.getDirection('RIGHT');
                break;
            case keyCodes.DOWN:
                vector = this.getDirection('DOWN');
                break;
            case keyCodes.LEFT:
                vector = this.getDirection('LEFT');
                break;
            default:
                return;
        }

        this.moveInDirection(vector);
    }

    /**
     * Handle transitionend event
     * @param {object} event object
     */
    transitionEndHandler = (event) => {
        if (event.propertyName !== 'transform') return;

        if (event.target.classList.contains('tile')) {
            // pop queue till the last element left
            if (this.moveQueue.length > 1) {
                this.moveQueue.shift();
            } else {
                this.moveQueue.shift();
                let grid = this.mergeTiles();
                grid = this.addRandomTile(grid);
                
                this.setState({
                    grid: grid
                });
            }
        }
    }

    /**
     * Handle animationend event
     * @param {object} event object
     */
    animationEndHandler = (event) => {
        if (['apear', 'merge'].indexOf(event.animationName) === -1) return;

        if (event.target.classList.contains('tile-inner')) {
            event.target.parentElement.classList.remove('tile-new', 'tile-merge');
        }
    }


    addStartTiles = () => {
        const availableCells = this.findEmptyCells();
        let grid = this.state.grid;
        for (let i = 0; i < this.props.startTiles; i++) {
            const index = Math.floor(Math.random() * availableCells.length);
            const pos = availableCells.splice(index, 1)[0];
            grid = this.insertNewTile(grid, pos.row, pos.col);
        }

        this.setState({
            grid: grid
        });
    }

    mergeTiles = () => {
        let scoreAdded = 0;
        const grid = this.state.grid.map((row, r) => {
            return row.map((cell, c) => {
                if (cell.get('tile').size > 1) {
                    const value = cell.get('tile').reduce((t1, t2) => {
                        return t1.get('value') + t2.get('value');
                    });

                    scoreAdded += value;

                    return cell.update('tile', tile => {
                        return List.of(tile.first().merge({
                            id: newId(),
                            value: value,
                            isNew: false,
                            isMerged: true
                        }));
                    })
                } else {
                    return cell;
                }
            })
        });

        this.props.addScore(scoreAdded);

        return grid;
    }

    addRandomTile = (grid) => {
        const availableCells = this.findEmptyCells();

        if (availableCells.length > 0) {

            const index = Math.floor(Math.random() * availableCells.length);
            const pos = availableCells.splice(index, 1)[0];
            return this.insertNewTile(grid, pos.row, pos.col);

        } else {
            return grid;
        }
    }

    insertNewTile = (grid, r, c) => {
        if (within2dList(grid, r, c)) {
            grid = grid.updateIn([r, c], (cell) => {
                const tileProps = {
                    row: r,
                    col: c,
                    value: randomCellValue(),
                    isNew: true,
                    isMerged: false
                };

                return cell.update('tile', 
                    tile => tile.push(this.newTile(tileProps)));
            });
        }

        return grid;
    }

    /**
     * Return the direction vector object
     * LEFT->{x: -1, y: 0}
     * RIGHT->{x: 1, y: 0}
     * UP->{x: 0, y: -1}
     * DOWN->{x: 0, y: 1}
     */
    getDirection = (direction) => {
        return VECTORS[direction.toUpperCase()];
    }

    /**
     * Create an array that indicates tranversal order of all tiles
     * @param {object} direction vector e.g. {x: 0, y: 1}
     */
    prepareTraversalMap = (vector) => {
        let traversal = Map({
            row: Array.apply(null, {length: this.props.rows}).map(Number.call, Number),
            col: Array.apply(null, {length: this.props.cols}).map(Number.call, Number)
        });

        if (vector.x === 1) traversal = traversal.update('col', value => value.reverse());
        if (vector.y === 1) traversal = traversal.update('row', value => value.reverse());

        return traversal;
    }

    moveInDirection = (vector) => {
        const traversal = this.prepareTraversalMap(vector);
        let grid = this.state.grid;

        traversal.get('row').forEach(r => {
            traversal.get('col').forEach(c => {
                let cell = grid.getIn([r, c]);
                if (cell.get('tile').size > 0) {
                    const nextPos = this.nextPosition(grid, r, c, vector);
                    if (nextPos.row !== nextPos.nextRow || nextPos.col !== nextPos.nextCol) {
                        this.moveQueue.push(nextPos);
                        grid = this.moveTo(grid, nextPos);
                    }
                }
            });
        });

        this.setState({
            grid: grid
        });
    }

    nextPosition = (grid, r, c, vector) => {
        let nextPos = {
            row: r,
            col: c,
            nextRow: r,
            nextCol: c
        };

        let currCell = grid.getIn([r, c]);

        let nextRow = nextPos.nextRow + vector.y;
        let nextCol = nextPos.nextCol + vector.x;

        while (within2dList(grid, nextRow, nextCol)) {
            let nextCell = grid.getIn([nextRow, nextCol]);
            if (nextCell.get('tile').size === 0) {
                nextPos = Object.assign(nextPos, {
                    nextRow: nextRow,
                    nextCol: nextCol
                });
            } else {
                if (nextCell.get('tile').size === 1 && 
                    currCell.getIn(['tile', 0, 'value']) === nextCell.getIn(['tile', 0, 'value'])) {
                    nextPos = Object.assign(nextPos, {
                        nextRow: nextRow,
                        nextCol: nextCol
                    });
                }
                break;
            }

            nextRow += vector.y;
            nextCol += vector.x;
        }

        return nextPos;
    }  
    
    moveTo = (grid, pos) => {
        let tmpTile = grid.getIn([pos.row, pos.col]).get('tile').first().merge({
            isNew: false
        });

        grid = grid.updateIn([pos.nextRow, pos.nextCol], cell => {
            return cell.update('tile', tile => tile.push(tmpTile));
        });

        grid = grid.updateIn([pos.row, pos.col], cell => {
            return cell.update('tile', tile => tile.clear());
        });  

        return grid;
    }

    /**
     * Return positions of empty cells in the current grid
     * @return {array} array of object {row: num, col: num}
     */
    findEmptyCells = () => {
        let cells = [];
        const grid = this.state.grid;
        grid.map((row, r) => {
            row.map((cell, c) => {
                if (cell.get('tile').size === 0) {
                    cells.push({
                        row: r,
                        col: c
                    });
                }
            });
        })

        return cells;
    }

    /**
     * Return an grid filled with initial cells 
     */
    createEmptyGrid = () => {
        const {rows, cols} = this.props;

        let grid = new Array(rows).fill(new Array(cols).fill(null));

        return List(grid.map((row, r) => {
            return List(row.map((cell, c) => {
                return this.newCell(r, c);
            }));
        }));
    }

    /**
     * Empty new cell
     */
    newCell = (r, c) => {
        const {gridSpacing, cellWidth, cellHeight} = this.props;
        return Map({
            x: gridSpacing * (c + 1) + c * cellWidth,
            y: gridSpacing * (r + 1) + r * cellHeight,
            tile: List()
        });
    }

    newTile = (props) => {
        const {row, col, value, isNew, isMerged} = props;
        return Map({
            id: newId(),
            value: value,
            isNew: isNew,
            isMerged: isMerged
        });
    }
}