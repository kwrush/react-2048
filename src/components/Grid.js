import React from 'react';
import {
    calcGridSpacing, 
    calcCellHeight,
    calcCellWidth
} from '../utils';

// Background grid that won't update after mounting
export default class Grid extends React.Component {
    shouldComponentUpdate () {
        return false;
    }

    renderRow (gridSize, rows, cols, key) {
        const lines = rows >= cols ? rows : cols;
        const gridSpacing = calcGridSpacing(gridSize, lines);
        const cellHeight = calcCellHeight(gridSize, rows, gridSpacing);
        const cellWidth = calcCellWidth(gridSize, cols, gridSpacing);

        const rowStyles = {
            marginBottom: gridSpacing + 'px'
        };

        let gridRows = [];
        while (cols > 0) {
            gridRows.push(this.renderCell(cellWidth, cellHeight, gridSpacing, cols--));
        }

        return (
            <div key={key} className="grid-row" style={rowStyles}>
                {gridRows}
            </div>
        );
    }

    renderCell (width, height, gridSpacing, key) {
        const cellStyles = {
            width: width + 'px',
            height: height + 'px',
            marginRight: gridSpacing + 'px'
        };
        return <div key={key} className="grid-cell" style={cellStyles}></div>;
    }

    render () {
        let grid = [];
        let rows = this.props.rows;
        while (rows > 0) {
            grid.push(
                this.renderRow(
                    this.props.gridSize, this.props.rows, this.props.cols, rows--));
        }
        return (
            <div className="grid-container">
                {grid}
            </div>
        );
    }
}