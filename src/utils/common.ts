import { TILE_COLORS } from './constants';

let index = 0;

// eslint-disable-next-line no-plusplus
export const nextIndex = () => index++;

export const resetIndex = () => {
  index = 0;
};

export const getId = (ind: number) => `${ind}_${Date.now()}`;

export const clamp = (d: number, min: number, max: number) =>
  Math.max(Math.min(max, d), min);

export const getTileFontSize = (w: number, h: number, v: number) => {
  const min = Math.min(w, h);
  return v >= 1024 ? min / 2.8 : min / 2;
};

export const getTileColor = (v: number) =>
  TILE_COLORS[clamp(v, 2, 2048).toFixed(0)];

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

export const createIndexArray = (num: number) => Array.from(Array(num).keys());
