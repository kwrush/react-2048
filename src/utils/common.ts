import { Color } from '../themes/common';

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

export const getTileColor = (v: number) => `tile${clamp(v, 2, 2048)}` as Color;

export const calcCellWidth = (
  gridSize: number,
  cellsNum: number,
  spacing: number,
) => (gridSize - (cellsNum + 1) * spacing) / cellsNum;

export const calcTileSize = (
  gridSize: number,
  rows: number,
  cols: number,
  spacing: number,
) => ({
  width: calcCellWidth(gridSize, cols, spacing),
  height: calcCellWidth(gridSize, rows, spacing),
});

export const calcLocation = (w: number, c: number, spacing: number) =>
  (spacing + w) * c + spacing;

export const createIndexArray = (num: number) => Array.from(Array(num).keys());