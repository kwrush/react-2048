import React from 'react';
import PropTypes from 'prop-types';
import {Map, List} from 'immutable';
import {keyCodes, VECTORS} from '../utils/constants';
import {randomCellValue, within2dList} from '../utils/helpers';
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
        this.state = {
            grid: this.createEmptyGrid()
        };
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
        let index = 0;
        const tilesView = this.state.grid.map((row, r) => {
            return row.map((cell, c) => {
                const tile = cell.get('tile').first();
                return (typeof tile === 'undefined') ? null :
                <Tile
                    key={index++} 
                    width={this.props.cellWidth}
                    height={this.props.cellHeight}
                    x={cell.get('x')}
                    y={cell.get('y')}
                    {...tile.toJS()}
                />;
            });
        });

        return (
            <div className="board" ref={(div) => this.gridContainer = div}>
                {tilesView}
            </div>
        );
    }

    keyDownHandler = (event) => {
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

    transitionEndHandler = (event) => {

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
            col: Array.apply(null, {length: this.props.rows}).map(Number.call, Number)
        });

        if (vector.x === 1) traversal = traversal.update('row', value => value.reverse());
        if (vector.y === 1) traversal = traversal.update('col', value => value.reverse());

        return traversal;
    }

    moveInDirection = (vector) => {
        const traversal = this.prepareTraversalMap(vector);
        let grid = this.state.grid;
        let nextPos = List();

        traversal.get('row').forEach(r => {
            traversal.get('col').forEach(c => {
                let cell = grid.getIn([r, c]);
                if (cell.get('tile').size === 1) {
                    nextPos = nextPos.push(this.nextPosition(grid, r, c, vector));
                }
            });
        });

        this.moveTo(nextPos);
    }

    moveTo = (nextPos) => {
        let grid = this.state.grid;

        nextPos.forEach(pos => {
            let tmpTile = grid.getIn([pos.row, pos.col]).get('tile').first().set('isNew', false);

            grid = grid.updateIn([pos.row, pos.col], cell => {
                return cell.update('tile', tile => tile.clear());
            });

            grid = grid.updateIn([pos.nextRow, pos.nextCol], cell => {
                return cell.update('tile', tile => tile.push(tmpTile));
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
                nextRow += vector.y;
                nextCol += vector.x;
            } else {
                if (currCell.getIn(['tile', 'value']) === nextCell.getIn(['tile', 'value'])) {
                    nextPos = Object.assign(nextPos, {
                        nextRow: nextRow,
                        nextCol: nextCol
                    });
                } 
            }
        }

        return nextPos;
    }   

    /**
     * Return positions of empty cells in the current grid
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
            row: row,
            col: col,
            value: value,
            isNew: isNew,
            isMerged: isMerged
        });
    }
}