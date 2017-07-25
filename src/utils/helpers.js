import { List } from 'immutable'; 

let id = 0;

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

export function randomCellValue () {
    return Math.random() > 0.95 ? 4 : 2;
}

export function within2dList (list, r, c) {
    return List.isList(list) && r >= 0 && c >= 0 && r < list.size && c < list.get(0).size;
}

export function newId () {
    return `id${id++}`;
}

