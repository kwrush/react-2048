import React from 'react';
import Immutable, {Map, List} from 'immutable'; 
import {keyCodes} from '../constants';
import {randomCellValue} from '../utils';
import Tile from './tile';

// Board controls how the tile being moved
export default class Grid extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            grid: this.emptyGrid(),
            tiles: List([])
        }
    }

    componentWillMount () {
        document.addEventListener('keydown', this.keyDownHandler, true);
    }

    componentDidMount () {
        this.addStartTiles();
        this.gridContainer.addEventListener('transitionend', this.handleTransitionEnd, false);
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this.keyDownHandler, false);
        this.gridContainer.removeEventListener('transitionend', this.handleTransitionEnd, false);
    }

    render () {
        let index = 0;
        const tilesView = this.state.grid.map((row, r) => {
            return row.map((cell, c) => {
                const tile = cell.get('tile').first();
                return tile ? <Tile
                    key={index++} 
                    width={this.props.cellWidth}
                    height={this.props.cellHeight}
                    {...tile.toJS()}
                /> : null
            });
        });

        return (
            <div className="grid" ref={(div) => this.gridContainer = div}>
                {tilesView}
            </div>
        );
    }

    handleTransitionEnd = (event) => {
        if (event.target.classList.contains('tile')) {
            this.mergeTiles();
        }
    }

    // for test
    keyDownHandler = (event) => {
        event.stopPropagation();
        const key = event.keyCode;
        let direction = {x: 0, y: 0};
        if (key === 37) {
            direction.x = -1;
        } else if (key === 38) {
            direction.y = -1;
        } else if (key === 39) {
            direction.x = 1;
        } else if (key === 40) {
            direction.y = 1;
        }

        this.moveTiles(direction);
    }
    
    mergeTiles = () => {
        let scoree = 0;
        let grid = this.state.grid;
        let tiles = this.state.tiles;

        tiles = tiles.map((tile, index) => {
            
        });
    }

    moveTiles = (direction) => {
        let grid = this.state.grid;

        grid = grid.map((row, r) => {
            return row.map((cell, c) => {
                let tile = cell.get('tile').first();
                
            });
        });

        tiles = tiles.map((tile, index) => {
            const oldRow = tile.get('row');
            const oldCol = tile.get('col');

            const newRow = oldRow + direction.y;
            const newCol = oldCol + direction.x;

            if (newRow >= 0 && newCol >= 0 && newRow < grid.size && newCol < grid.get(0).size) {
                const cell = grid.get(newRow).get(newCol);
                tile = 
                
                grid = grid.update(oldRow, (row) => {
                    return row.update(oldCol, (col) => {
                        return col.set('tile', false);
                    })
                }).update(newRow, (row) => {
                    return row.update(newCol, (col) => {
                        return col.set('tile', true);
                    })
                });
            }

            return tile;
        });

        this.setState({
            grid: grid,
            tiles: tiles
        });
    }

    addStartTiles = () => {
        let grid = this.state.grid;
        let cells = this.availableCells();

        for (let i = 0; i < this.props.startTiles; i++) {
            let rs = this.randomAvailableCell(cells);
            const pos = rs.cell;
            cells = rs.availableCells;

            if (pos !== null) {
                let cell = grid.get(pos.row).get(pos.col);
                let tile = cell.get('tile');
                cell = cell.merge({
                    tile: tile.push(Map({
                        x: cell.get('x'),
                        y: cell.get('y'),
                        row: cell.get('row'),
                        col: cell.get('col'),
                        value: randomCellValue(),
                        isNew: true,
                        isMerged: false
                    }))
                });

                grid = grid.update(pos.row, (row) => {
                    return row.update(pos.col, (col) => {
                        return col.merge(cell);
                    })
                });
            }
        }

        this.setState({
            grid: grid
        });
    }

    randomAvailableCell = (availableCells) => {
        let cell = {cell: null, availableCells: availableCells};

        if (List.isList(availableCells)) {
            const index = Math.floor(Math.random() * availableCells.size);
            cell.cell = availableCells.get(index);
            cell.availableCells = availableCells.delete(index);
        }

        return cell;
    }

    availableCells = () => {
        let cells = [];
        
        this.state.grid.map((row, r) => {
            row.map((cell, c) => {
                if (cell.get('tile').size === 0) {
                    cells.push({
                        row: r,
                        col: c
                    });
                }
            });
        });

        return List(cells);
    }

    checkCellsAvailable = () => {
        return this.availableCells().length > 0;
    }

    // Create an empty grid
    emptyGrid = () => {
        const {gridSpacing, cellWidth, cellHeight, rows, cols} = this.props;

        let grid = new Array(rows).fill(new Array(cols).fill({}));

        return List(grid.map((row, r) => {
            return List(row.map((cell, c) => {
                return this.emptyCell(r, c);
            }));
        })); 
    }

    emptyCell = (r, c) => {
        const spacing = this.props.gridSpacing;
        const w = this.props.cellWidth;
        const h = this.props.cellHeight;
        return Map({
            x: spacing * (c + 1) + c * w,
            y: spacing * (r + 1) + r * h,
            tile: List([])
        });
    } 
}