import React from 'react';
import PropTypes from 'prop-types';

/*
 * Create background grid that won't update
 * unless the grid actual size or dimension changes
 */
export default class Grid extends React.Component {
  static propTypes = {
    gridSize: PropTypes.number.isRequired,
    gridSpacing: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
    cols: PropTypes.number.isRequired,
    cellWidth: PropTypes.number.isRequired,
    cellHeight: PropTypes.number.isRequired,
  };

  shouldComponentUpdate(nextProps) {
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

  renderRow(key) {
    let cols = this.props.cols;

    const rowStyles = {
      marginBottom: `${this.props.gridSpacing}px`,
    };

    let gridRows = [];
    while (cols > 0) {
      gridRows.push(this.renderCell(cols--));
    }

    return (
      <div key={`row-${key}`} className="grid-row" style={rowStyles}>
        {gridRows}
      </div>
    );
  }

  renderCell(key) {
    const cellStyles = {
      width: `${this.props.cellWidth}px`,
      height: `${this.props.cellHeight}px`,
      marginRight: `${this.props.gridSpacing}px`,
    };
    return (
      <div key={`cell-${key}`} className="grid-cell" style={cellStyles}></div>
    );
  }

  render() {
    let grid = [];
    let rows = this.props.rows;
    while (rows > 0) {
      grid.push(this.renderRow(rows--));
    }

    return <div className="grid">{grid}</div>;
  }
}
