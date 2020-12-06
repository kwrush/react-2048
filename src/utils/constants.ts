export const keyCodes = {
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  LEFT: 37,
  SPACEBAR: 32,
};

export const VECTORS = {
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
};

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

export const GRID_SIZE = 360;
