import type { Cell, Tile } from '../hooks/useGameBoard';
import { clamp } from './common';
import { DIRECTION_MAP } from './constants';

export const isWin = (tiles: Tile[]) =>
  tiles.some(({ value }) => value === 2048);

export const canGameContinue = (grid: Cell[][], tiles: Tile[]) => {
  const totalRows = grid.length;
  const totalCols = grid[0].length;
  // We can always continue the game when there're empty cells,
  if (tiles.length < totalRows * totalCols) return true;

  const dirs = [
    DIRECTION_MAP.Left,
    DIRECTION_MAP.Right,
    DIRECTION_MAP.Up,
    DIRECTION_MAP.Down,
  ];

  for (let ind = 0; ind < tiles.length; ind++) {
    const { r, c, value } = tiles[ind];
    for (let d = 0; d < dirs.length; d++) {
      const dir = dirs[d];
      const nextRow = clamp(r + dir.r, 0, totalRows - 1);
      const nextCol = clamp(c + dir.c, 0, totalCols - 1);

      if (nextRow !== r || nextCol !== c) {
        const tile = grid[nextRow][nextCol];
        if (tile == null || tile.value === value) return true;
      }
    }
  }
  return false;
};
