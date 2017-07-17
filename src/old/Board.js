import React from 'react';


// Background board that won't update after mounting unless grid size changes
export default class Board extends React.Component {
    shouldComponentUpdate (nextProps, nextState) {
        const props = this.props;

        return (
            props.gridSize !== nextProps.gridSize ||
            props.gridSpacing !== nextProps.gridSpacing ||
            props.row !== nextProps.row || 
            props.col !== nextProps.col || 
            props.cellWidth !== nextProps.cellWidth || 
            props.cellHeight !== nextProps.cellHeight
        );
    }

    renderRow (key) {
        const gridSpacing = this.props.gridSpacing;
        let cols = this.props.cols;

        const rowStyles = {
            marginBottom: `${this.props.gridSpacing}px`
        };

        let gridRows = [];
        while (cols > 0) {
            gridRows.push(this.renderCell(cols--));
        }

        return (
            <div key={key} className="grid-row" style={rowStyles}>
                {gridRows}
            </div>
        );
    }

    renderCell (key) {
        const cellStyles = {
            width: `${this.props.cellWidth}px`,
            height: `${this.props.cellHeight}px`,
            marginRight: `${this.props.gridSpacing}px`
        };
        return <div key={key} className="grid-cell" style={cellStyles}></div>;
    }

    render () {
        let grid = [];
        let rows = this.props.rows;
        while (rows > 0) {
            grid.push(this.renderRow(rows--));
        }

        return (
            <div className="board">
                {grid}
            </div>
        );
    }
}