import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { DIR, Vector } from '../utils/constants';
import { clamp, createCells, newId } from '../utils/common';
import useGameScore from './useGameScore';

export interface Location {
  r: number;
  c: number;
}

export interface Tile extends Location {
  id: number; // self increment id
  isNew: boolean;
  isMerging: boolean;
  canMerge: boolean;
  value: number;
}

export type Cell = {
  tile?: Tile;
};

const createRow = <T>(rows: number, cb: (r: number) => T) =>
  Array.from(Array(rows)).map((_, r) => cb(r));

const createEmptyGrid = (rows: number, cols: number) =>
  createRow(rows, () => createRow<Cell>(cols, () => ({})));

const createNewTile = (r: number, c: number): Tile => ({
  id: newId(),
  r,
  c,
  isNew: true,
  canMerge: false,
  isMerging: false,
  value: Math.random() > 0.99 ? 4 : 2,
});

const getEmptyCellsLocation = (grid: Cell[][]) =>
  grid.flatMap((row, r) =>
    row.reduce<Location[]>((acc, cell, c) => {
      if (cell.tile == null) acc.push({ r, c });
      return acc;
    }, []),
  );

const createRandomTiles = (emptyCells: Location[], amount: number) => {
  if (emptyCells.length === 0) return [];

  const tilesNumber = emptyCells.length < amount ? emptyCells.length : amount;
  return Array.from(Array(tilesNumber)).map<Tile>(() => {
    const [{ r, c }] = emptyCells.splice(
      Math.floor(Math.random() * emptyCells.length),
      1,
    );
    return createNewTile(r, c);
  });
};

const createTraveralMap = (rows: number, cols: number, dir: Vector) => {
  const rowsMap = createCells(rows);
  const colsMap = createCells(cols);
  return {
    // Always start from the last cell in the moving direction
    rows: dir.r > 0 ? rowsMap.reverse() : rowsMap,
    cols: dir.c > 0 ? colsMap.reverse() : colsMap,
  };
};

const sortTiles = (tiles: Tile[]) => tiles.sort((t1, t2) => t1.id - t2.id);

const canMoveTile = (tiles: Tile[], grid: Cell[][]) => {
  const totalRows = grid.length;
  const totalCols = grid[0].length;
  // For sure we can move when there're empty cells,
  if (tiles.length < totalRows * totalCols) return true;

  const dirs = [DIR.Left, DIR.Right, DIR.Up, DIR.Down];

  /* eslint-disable no-plusplus */
  for (let ind = 0; ind < tiles.length; ind++) {
    const { r, c, value } = tiles[ind];
    for (let d = 0; d < dirs.length; d++) {
      const dir = dirs[d];
      const nextRow = clamp(r + dir.r, 0, totalRows - 1);
      const nextCol = clamp(c + dir.c, 0, totalCols - 1);

      if (nextRow !== r || nextCol !== c) {
        const { tile } = grid[nextRow][nextCol];
        if (tile == null || tile.value === value) return true;
      }
    }
  }
  /* eslint-enable no-plusplus */
  return false;
};

const mergeAndCreateNewTiles = (grid: Cell[][]) => {
  const mergeQueue: number[] = [];
  let score = 0;
  const tiles = grid.flatMap((row) =>
    row.reduce<Tile[]>((acc, { tile }) => {
      if (tile != null) {
        const { canMerge, value, id, ...rest } = tile;
        acc.push({
          ...rest,
          id,
          value: canMerge ? 2 * value : value,
          isMerging: canMerge,
          canMerge: false,
          isNew: false,
        });
        if (canMerge) {
          mergeQueue.push(id);
          score += 2 * value;
        }
      }
      return acc;
    }, []),
  );
  const emptyCells = getEmptyCellsLocation(grid);
  const newTiles = createRandomTiles(emptyCells, 2);
  tiles.push(...newTiles);
  mergeQueue.push(...newTiles.map(({ id }) => id));

  return {
    tiles: sortTiles(tiles),
    score,
    mergeQueue,
  };
};

const moveInDirection = (grid: Cell[][], dir: Vector) => {
  const tempGrid = grid.slice(0);
  const totalRows = tempGrid.length;
  const totalCols = tempGrid[0].length;
  const tiles: Tile[] = [];
  const moveQueue: number[] = [];

  const traversal = createTraveralMap(totalRows, totalCols, dir);
  traversal.rows.forEach((row) => {
    traversal.cols.forEach((col) => {
      const { tile } = tempGrid[row][col];
      if (tile != null) {
        const pos = {
          currRow: row,
          currCol: col,
          // clamp to ensure next row and col are still in the grid
          nextRow: clamp(row + dir.r, 0, totalRows - 1),
          nextCol: clamp(col + dir.c, 0, totalCols - 1),
        };

        while (pos.nextRow !== pos.currRow || pos.nextCol !== pos.currCol) {
          const { nextRow, nextCol } = pos;
          const { tile: nextTile } = tempGrid[nextRow][nextCol];
          if (nextTile != null) {
            // Move to the next cell if the tile inside has the same value and not been merged
            if (nextTile.value === tile.value && !nextTile.canMerge) {
              pos.currRow = nextRow;
              pos.currCol = nextCol;
            }
            break;
          }
          // We keep moving to the next cell until the cell contains a tile
          pos.currRow = nextRow;
          pos.currCol = nextCol;
          pos.nextRow = clamp(nextRow + dir.r, 0, totalRows - 1);
          pos.nextCol = clamp(nextCol + dir.c, 0, totalCols - 1);
        }

        const { currRow, currCol } = pos;
        const { tile: currentTile } = tempGrid[currRow][currCol];
        // If the tile has been moved
        if (currRow !== row || currCol !== col) {
          const updatedTile = {
            ...tile,
            r: currRow,
            c: currCol,
            canMerge: tile.value === currentTile?.value,
            isNew: false,
            isMerging: false,
          };
          tempGrid[currRow][currCol] = { tile: updatedTile };
          tempGrid[row][col] = {};
          tiles.push(updatedTile);
          moveQueue.push(updatedTile.id);
        } else if (currentTile != null) {
          tiles.push({ ...currentTile, isNew: false, isMerging: false });
        }
      }
    });
  });

  return {
    // sort by id to persist order of tiles array so that React won't rerender when id is not changed
    tiles: sortTiles(tiles),
    moveQueue,
  };
};

// TODO: test helper, remove it
const createTiles = (r: number, c: number) => {
  const v = [2, 4, 8, 16, 32];
  return createEmptyGrid(r, c).flatMap((rows, rr) =>
    rows.reduce<Tile[]>((acc, _, cc) => {
      acc.push({
        id: newId(),
        r: rr,
        c: cc,
        isNew: true,
        isMerging: false,
        canMerge: false,
        value: v[Math.floor(Math.random() * v.length)],
      });
      return acc;
    }, []),
  );
};

const useGame = (rows: number, cols: number, toggle: boolean) => {
  const gridRef = useRef(createEmptyGrid(rows, cols));
  const [tiles, setTiles] = useState<Tile[]>([]);
  const pendingQueueRef = useRef<number[]>([]);
  const [moving, setMoving] = useState(false);

  const { best, total, addScore } = useGameScore();

  const onMove = useCallback((dir: Vector) => {
    if (pendingQueueRef.current.length === 0) {
      const { tiles: newTiles, moveQueue } = moveInDirection(
        gridRef.current,
        dir,
      );
      pendingQueueRef.current = moveQueue;
      setMoving(moveQueue.length > 0);
      setTiles(newTiles);
    }
  }, []);

  const onMovePending = useCallback(() => {
    pendingQueueRef.current.splice(-1, 1);
    setMoving(pendingQueueRef.current.length > 0);
  }, []);

  const onMergePending = useCallback(() => {
    pendingQueueRef.current.splice(-1, 1);
  }, []);

  useLayoutEffect(() => {
    tiles.forEach(({ r, c, ...rest }) => {
      const currentTile = gridRef.current[r][c].tile;
      if (!currentTile?.canMerge) {
        gridRef.current[r][c] = { tile: { r, c, ...rest } };
      }
    });
  }, [tiles]);

  useEffect(() => {
    if (!moving) {
      const { tiles: newTiles, mergeQueue, score } = mergeAndCreateNewTiles(
        gridRef.current,
      );
      pendingQueueRef.current = mergeQueue;
      newTiles.forEach((tile) => {
        gridRef.current[tile.r][tile.c] = { tile };
      });

      addScore(score);
      setTiles(newTiles);
    }
  }, [moving, addScore]);

  useEffect(() => {
    gridRef.current = createEmptyGrid(rows, cols);
    const emptyCells = getEmptyCellsLocation(gridRef.current);
    setTiles(createRandomTiles(emptyCells, 2));
  }, [rows, cols, toggle]);

  return { tiles, total, best, onMove, onMovePending, onMergePending };
};

export default useGame;
