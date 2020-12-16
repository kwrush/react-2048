export type Vector = {
  r: 0 | 1 | -1;
  c: 0 | 1 | -1;
};

export enum ArrowKey {
  ArrowLeft,
  ArrowUp,
  ArrowRight,
  ArrowDown,
}

export enum Direction {
  Left,
  Right,
  Up,
  Down,
}

export type ArrowKeyType = keyof typeof ArrowKey;
export type DirectionType = keyof typeof Direction;

export const APP_NAME = 'react-2048';

export const DIR: Record<ArrowKeyType | DirectionType, Vector> = {
  ArrowLeft: { r: 0, c: -1 },
  ArrowRight: { r: 0, c: 1 },
  ArrowUp: { r: -1, c: 0 },
  ArrowDown: { r: 1, c: 0 },
  Left: { r: 0, c: -1 },
  Right: { r: 0, c: 1 },
  Up: { r: -1, c: 0 },
  Down: { r: 1, c: 0 },
};

export const GRID_SIZE = 370;
export const MIN_SCALE = 4;
export const MAX_SCALE = 8;
export const SPACING = 10;
