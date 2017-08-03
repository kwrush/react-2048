import { List } from 'immutable'; 

let id = null;

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
    return Math.random() > 0.99 ? 4 : 2;
}

export function within2dList (list, r, c) {
    return List.isList(list) && r >= 0 && c >= 0 && r < list.size && c < list.get(0).size;
}

export function newId () {
    if (id === null) id = (new Date()).getTime();
    return '' + id++;
}

export function getTouches (touches) {
    return Object.assign({}, {
        x: touches[0].clientX,
        y: touches[0].clientY
    });
}

