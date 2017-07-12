// Give an appropriate spacing between two cells
export function calcGridSpacing (gridSize, rows) {
    return gridSize / Math.pow(rows + 1.5, 2);
}

// Calculate height of a cell based on the given parameters
export function calcCellHeight (gridSize, rows, spacing) {
    return (gridSize - (rows + 1) * spacing) / rows;
}

// Calculate width of a cell based on the given parameters
export function calcCellWidth (gridSize, cols, spacing) {
    return (gridSize - (cols + 1) * spacing) / cols;
}