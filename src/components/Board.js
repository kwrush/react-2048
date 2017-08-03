import React from 'react';
import PropTypes from 'prop-types';
import Immutable, {Map, List} from 'immutable';
import {keyCodes, VECTORS} from '../utils/constants';
import {randomCellValue, within2dList, newId, getTouches} from '../utils/helpers';
import Tile from './Tile';

export default class Board extends React.Component {

    // Queue of moving tiles. Needed for performing some actions, such as
    // merging tiles or creating a new tile, after all transition 
    // events are consumed
    moveQueue = []

    // Used for avoid transitionend event triggered by, for instance, zoom in/out
    moved = false

    // Collection of tile components
    tilesView = []

    // Save touchstart event object
    touch = {x: 0, y: 0}

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
        this.board.addEventListener('touchmove', this.touchMoveHandler, {passive: false});
        this.addStartTiles();
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this.keyDownHandler, false);
        this.board.removeEventListener('touchmove', this.touchMoveHandler, {passive: false});
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.reset) {
            this.setup();
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        return this.isResized(nextProps) || 
            !Immutable.is(this.state.grid, nextState.grid) || 
            this.props.gridSize !== nextProps.gridSize;
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

        // Sort tiles by their keys before rendering to prevent 
        // transition animaion is aborted from recreating DOM elemnt
        // by React
        this.tilesView = tiles.sort((t1, t2) => {
            return parseInt(t1.key, 10) - parseInt(t2.key, 10);
        });
    }

    componentDidUpdate (prevProps, nextState) {
        // If there's different row or columns
        if (this.isResized(prevProps)) {
            this.setup();

        } else if (this.props.gridSize !== prevProps.gridSize) {
            // Adjust tiles position if the browser windows is resized
            this.setState({
                grid: this.adjustCellsPosition()
            });
        } else {
            // Otherwise check if there're empty cells left
            const availableCells = this.findEmptyCells();

            // Do the expensive checking when all cells are occupied
            if (availableCells.length === 0 && !this.canMove()) {
                this.props.gameOver();
            }
        }
    }

    render () {
        return (
            <div
                ref={(board) => {this.board = board}} 
                className="board" 
                onTransitionEnd={this.transitionEndHandler} 
                onAnimationEnd={this.animationEndHandler}
                onTouchStart={this.touchStartHandler}
                onTouchMove={this.touchMoveHandler}
                onTouchEnd={this.touchEndHandler}
            >
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

    touchStartHandler = (event) => {
        this.touch = getTouches(event.touches);
    }

    touchMoveHandler = (event) => {
        event.preventDefault();
    }

    touchEndHandler = (event) => {
        if (!this.touch.x || !this.touch.y || this.moveQueue.length > 0 || this.props.pause) return;
    
        const {x, y} = getTouches(event.changedTouches);
        const dx = this.touch.x - x;
        const dy = this.touch.y - y;

        let vector = {x:0, y: 0}

        if (Math.abs(dx) >= Math.abs(dy)) {
            vector = dx > 0 ? this.getDirection('LEFT') : this.getDirection('RIGHT');
        } else {
            vector = dy > 0 ? this.getDirection('UP') : this.getDirection('DOWN');
        }

        this.moveInDirection(vector);
    }


    /**
     * Handle keydown event
     * @param {object} event object
     */
    keyDownHandler = (event) => {
        event.preventDefault();
        // Do nothing until the previous event is finished
        if (this.moveQueue.length > 0 || this.props.pause) return;

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

        // Only handle the event triggered by moving tiles
        if (!this.moved) return;

        if (event.target.classList.contains('tile')) {
            // pop queue till the last element left
            if (this.moveQueue.length > 1) {
                this.moveQueue.shift();
            } else {
                this.moveQueue.shift();
                this.moved = false;

                // merge and add new tile after all tiles have been moved
                // to their new locations
                let grid = this.mergeTiles();
                grid = this.addRandomTile(grid);
                
                this.setState({
                    grid: grid
                });
            }
        }
    }

    /**
     * Handle animationend event, removing some animation classes in
     * DOM elements to prevent repeat animation from next rendering
     * @param {object} event object
     */
    animationEndHandler = (event) => {
        if (['apear', 'merge'].indexOf(event.animationName) === -1) return;

        if (event.target.classList.contains('tile-inner')) {
            event.target.parentElement.classList.remove('tile-new', 'tile-merge');
        }
    }

    /**
     * initiate game board
     */
    setup = () => {
        this.setState({
            grid: this.createEmptyGrid()
        }, () => {
            this.addStartTiles();
        });
    }

    /**
     * Add initial tiles
     */
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

    /**
     * Merge tiles
     * @return {List} grid that has been merged 
     */
    mergeTiles = () => {
        let scoreAdded = 0;
        const grid = this.state.grid.map((row, r) => {
            return row.map((cell, c) => {
                if (cell.get('tile').size > 1) {
                    const value = cell.get('tile').reduce((t1, t2) => {
                        return t1.get('value') + t2.get('value');
                    });

                    scoreAdded += value;

                    if (scoreAdded === this.props.max && !this.props.continue) this.props.winGame();

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

    /**
     * Add a new tile in a random available location
     * @param {List} grid
     * @return {List} grid with new tile
     */
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

    /**
     * Add new tile to the specifc cell of the given grid
     * @param {List} grid
     * @param {number} row index
     * @param {number} column index
     * @return {List} grid with the new tile
     */
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
     * @param {string} direction
     * @return {object} vector object
     */
    getDirection = (direction) => {
        return VECTORS[direction.toUpperCase()];
    }

    /**
     * Create an array that indicates tranversal order of all tiles
     * @param {object} direction vector e.g. {x: 0, y: 1}
     * @return {Map} traversal map in row and column wise
     */
    prepareTraversalMap = (vector) => {
        let traversal = Map({
            row: Array.apply(null, {length: this.props.rows}).map(Number.call, Number),
            col: Array.apply(null, {length: this.props.cols}).map(Number.call, Number)
        });

        // Always start from the farthest tile
        if (vector.x === 1) traversal = traversal.update('col', value => value.reverse());
        if (vector.y === 1) traversal = traversal.update('row', value => value.reverse());

        return traversal;
    }

    /**
     * Move tiles in the given direction
     * @param {object} direction vector
     */
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
                        this.moved = this.moved ? this.moved : true;
                        grid = this.moveTo(grid, nextPos);
                    }
                }
            });
        });

        this.setState({
            grid: grid
        });
    }

    /**
     * Calcualte next position of the specific tile 
     * following the direction vector
     * @param {List} grid
     * @param {number} row index
     * @param {number} column index
     * @param {object} vector of direction 
     * @return {object} object indicates next position of row and column
     */
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
            // Move the tile to the next position if it's empty
            if (nextCell.get('tile').size === 0) {
                nextPos = Object.assign(nextPos, {
                    nextRow: nextRow,
                    nextCol: nextCol
                });
            } else {
                // If the cell is occurpied, then check if we can merge two tiles
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
    
    /**
     * Move all tiles to their next positions
     * @param {List} grid to be moved
     * @param {pos} object of next position
     * @return {List} updated grid
     */
    moveTo = (grid, pos) => {
        // Get the tile to be moved
        let tmpTile = grid.getIn([pos.row, pos.col]).get('tile').first().merge({
            isNew: false
        });

        grid = grid.updateIn([pos.nextRow, pos.nextCol], cell => {
            return cell.update('tile', tile => tile.push(tmpTile));
        });

        // Remove this tile from old position
        grid = grid.updateIn([pos.row, pos.col], cell => {
            return cell.update('tile', tile => tile.clear());
        });  

        return grid;
    }

    /**
     * Check if it's possible to continue the game
     * @return {boolean} true if there's a tile can be moved
     */
    canMove = () => {
        const vectors = [
            this.getDirection('LEFT'),
            this.getDirection('RIGHT'),
            this.getDirection('UP'),
            this.getDirection('DOWN')
        ];

        for (let r = 0; r < this.state.grid.size; r++) {
            for (let c = 0; c < this.state.grid.get(r).size; c++) {
                const tile = this.state.grid.getIn([r, c, 'tile']);
                if (tile.size > 0) {
                    for (let i = 0; i < vectors.length; i++) {
                        const nextPos = this.nextPosition(this.state.grid, r, c, vectors[i]);
                        if (nextPos.row !== nextPos.nextRow || nextPos.col !== nextPos.nextCol) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
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
     * @return {List} empty grid
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
     * Adjust positions of cells based on current width of the browser window
     * @return {List} grid adjusted
     */
    adjustCellsPosition = () => {
        const {gridSpacing, cellWidth, cellHeight} = this.props;

        return this.state.grid.map((row, r) => {
            return row.map((cell, c) => {
                return cell.merge({
                    x: gridSpacing * (c + 1) + c * cellWidth,
                    y: gridSpacing * (r + 1) + r * cellHeight,
                });
            });
        });
    }

    /**
     * Empty new cell
     * @param {number} row index
     * @param {number} column index
     * @return {Map} empty cell map
     */
    newCell = (r, c) => {
        const {gridSpacing, cellWidth, cellHeight} = this.props;
        return Map({
            x: gridSpacing * (c + 1) + c * cellWidth,
            y: gridSpacing * (r + 1) + r * cellHeight,
            tile: List()
        });
    }

    /**
     * Empty tile
     * @param {object} tile propertie
     * @return {Map} map of a tile 
     */
    newTile = (props) => {
        const {row, col, value, isNew, isMerged} = props;
        return Map({
            id: newId(),
            value: randomCellValue(),
            isNew: isNew,
            isMerged: isMerged
        });
    }
}