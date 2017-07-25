import React from 'react';
import PropTypes from 'prop-types';
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
        rows: PropTypes.number,
        cols: PropTypes.number,
        gridSize: PropTypes.number,
        max: PropTypes.number,
        fromSave: PropTypes.bool.isRequired
    }

    static defaultProps = {
        rows: 4,
        cols: 4,
        maxRow: 10,
        maxCol: 10,
        max: 2048,
        startTiles: 2,
        gridSize: 360
    }

    render () {
        const gridSize = this.props.gridSize;
        const rows = this.props.rows;
        const cols = this.props.cols;
        const gridSpacing = calcGridSpacing(gridSize, rows >= cols ? rows : cols);
        
        const props = {
            gridSize: gridSize,
            gridSpacing: gridSpacing,
            cellHeight: calcCellHeight(gridSize, rows, gridSpacing),
            cellWidth: calcCellWidth(gridSize, cols, gridSpacing),
            rows: rows,
            cols: cols
        }

        return (
            <div id="game">
                <div className="grid-container">
                    <Grid {...props}/>
                    <Board 
                        {...props}
                        startTiles={this.props.startTiles} 
                    />
                </div>
            </div>
        );
    }
}

