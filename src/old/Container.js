import React from 'react';
import {
    calcGridSpacing, 
    calcCellHeight,
    calcCellWidth
} from '../utils';
import Board from './Board';
import Grid from './Grid';

export default class Container extends React.Component {
    constructor (props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.rows !== nextProps.rows ||
            this.props.cols !== nextProps.cols ||
            this.props.gridSize !== nextProps.gridSize) {
            return true;
        }

        return false;
    }

    render () {
        const gridSize = this.props.gridSize;
        const rows = this.props.rows;
        const cols = this.props.cols;
        const lines = rows >= cols ? rows : cols;
        const gridSpacing = calcGridSpacing(gridSize, lines);
        
        const props = {
            gridSpacing: gridSpacing,
            cellHeight: calcCellHeight(gridSize, rows, gridSpacing),
            cellWidth: calcCellWidth(gridSize, cols, gridSpacing),
            rows: rows,
            cols: cols
        }

        return (
            <div className="grid-container">
                <Board {...props} />
                <Grid {...Object.assign({}, props, {startTiles: this.props.startTiles})} />
            </div>
        ); 
    }  
}