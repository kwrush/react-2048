import { TILE_COLORS } from './constants';

export const getTileFontSize = (w: number, h: number, v: number) => {
  const mid = (w + h) / 2;
  return v >= 1024 ? mid / 2.8 : mid / 2;
};

export const getTileColor = (v: number) => TILE_COLORS[v.toFixed(0)];

export const calcGridSpacing = (gridSize: number, rows: number) =>
  gridSize / (rows + 1.5) ** 2;

export const calcCellWidth = (
  gridSize: number,
  cellsNum: number,
  spacing: number,
) => (gridSize - (cellsNum - 1) * spacing) / cellsNum;

export const calcTileSize = (
  gridSize: number,
  rows: number,
  cols: number,
  spacing: number,
) => ({
  width: calcCellWidth(gridSize, cols, spacing),
  height: calcCellWidth(gridSize, rows, spacing),
});

export const createCells = (num: number) =>
  Array.from(Array(num)).map((_, index) => index);
