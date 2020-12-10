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

export const NAME = 'react-2048';

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

export const GRID_SIZE = 350;
export const MIN_SCALE = 4;
export const MAX_SCALE = 8;

export enum GameStatus {
  WIN,
  LOSE,
  CONTINUE,
  PENDING,
}

// TODO: Move colors and spacing to theme
export const TILE_COLORS: Record<string, string> = {
  '2': '#eeeeee',
  '4': '#eeeecc',
  '8': '#ffbb88',
  '16': '#ff9966',
  '32': '#ff7755',
  '64': '#ff5533',
  '128': '#eecc77',
  '256': '#eecc66',
  '512': '#eecc55',
  '1024': '#eecc33',
  '2048': '#eecc11',
};

export type Spacing =
  | 's0'
  | 's1'
  | 's2'
  | 's3'
  | 's4'
  | 's5'
  | 's6'
  | 's7'
  | 's8'
  | 's9'
  | 's10';

export const SpacingValues: Record<Spacing, string> = {
  s0: '1px',
  s1: '2px',
  s2: '4px',
  s3: '8px',
  s4: '12px',
  s5: '16px',
  s6: '20px',
  s7: '24px',
  s8: '32px',
  s9: '48px',
  s10: '64px',
};
