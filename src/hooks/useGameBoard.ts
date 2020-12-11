import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  clamp,
  createIndexArray,
  nextIndex,
  getId,
  resetIndex,
} from '../utils/common';
import { DIR, Vector } from '../utils/constants';
import { GameStatus } from './useGameStatus';

export interface Location {
  r: number;
  c: number;
}

export interface Tile extends Location {
  index: number; // self increment index
  id: string;
  isNew: boolean;
  isMerging: boolean;
  canMerge: boolean;
  value: number;
}

export type Cell = {
  tile?: Tile;
};

export type GameBoardParams = {
  rows: number;
  cols: number;
  gameStatus: GameStatus;
  addScore: (score: number) => void;
};

const createRow = <T>(rows: number, cb: (r: number) => T) =>
  Array.from(Array(rows)).map((_, r) => cb(r));

const createEmptyGrid = (rows: number, cols: number) =>
  createRow(rows, () => createRow<Cell>(cols, () => ({})));

const createNewTile = (r: number, c: number): Tile => {
  const index = nextIndex();
  const id = `${index}_${getId()}`;
  return {
    index,
    id,
    r,
    c,
    isNew: true,
    canMerge: false,
    isMerging: false,
    value: 2,
  };
};

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
  const rowsMap = createIndexArray(rows);
  const colsMap = createIndexArray(cols);
  return {
    // Always start from the last cell in the moving direction
    rows: dir.r > 0 ? rowsMap.reverse() : rowsMap,
    cols: dir.c > 0 ? colsMap.reverse() : colsMap,
  };
};

const sortTiles = (tiles: Tile[]) =>
  tiles.sort((t1, t2) => t1.index - t2.index);

const canMoveTile = (grid: Cell[][], tiles: Tile[]) => {
  const totalRows = grid.length;
  const totalCols = grid[0].length;
  // We can always move when there're empty cells,
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
  const tiles: Tile[] = [];
  const mergeQueue: number[] = [];
  let score = 0;

  const newGrid = grid.map((row) => {
    return row.map((cell) => {
      const { tile } = cell;
      if (tile != null) {
        const { canMerge, value, index, ...rest } = tile;
        const newValue = canMerge ? 2 * value : value;
        const newTile = {
          ...rest,
          index,
          value: newValue,
          isMerging: canMerge,
          canMerge: false,
          isNew: false,
        };

        tiles.push(newTile);

        if (canMerge) {
          mergeQueue.push(index);
          score += newValue;
        }

        return { tile: newTile };
      }

      return cell;
    });
  });

  const emptyCells = getEmptyCellsLocation(newGrid);
  const newTiles = createRandomTiles(emptyCells, 1);
  newTiles.forEach((tile) => {
    newGrid[tile.r][tile.c] = { tile };
  });

  tiles.push(...newTiles);
  mergeQueue.push(...newTiles.map(({ index }) => index));

  return {
    grid: newGrid,
    tiles: sortTiles(tiles),
    score,
    mergeQueue,
  };
};

const moveInDirection = (grid: Cell[][], dir: Vector) => {
  const newGrid = grid.slice(0);
  const totalRows = newGrid.length;
  const totalCols = newGrid[0].length;
  const tiles: Tile[] = [];
  const moveQueue: number[] = [];

  const traversal = createTraveralMap(totalRows, totalCols, dir);
  traversal.rows.forEach((row) => {
    traversal.cols.forEach((col) => {
      const { tile } = newGrid[row][col];
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
          const { tile: nextTile } = newGrid[nextRow][nextCol];
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
        const { tile: currentTile } = newGrid[currRow][currCol];
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
          newGrid[currRow][currCol] = { tile: updatedTile };
          newGrid[row][col] = {};
          tiles.push(updatedTile);
          moveQueue.push(updatedTile.index);
        } else if (currentTile != null) {
          tiles.push({ ...currentTile, isNew: false, isMerging: false });
        }
      }
    });
  });

  return {
    // sort by index to persist iteration order of tiles array so that React won't rerender when id is not changed
    tiles: sortTiles(tiles),
    grid: newGrid,
    moveQueue,
  };
};

const resetGameBoard = (rows: number, cols: number) => {
  // Index restarts from 0 on reset
  resetIndex();
  const grid = createEmptyGrid(rows, cols);
  const emptyCells = getEmptyCellsLocation(grid);
  const newTiles = createRandomTiles(emptyCells, 2);

  newTiles.forEach((tile) => {
    grid[tile.r][tile.c] = { tile };
  });

  return {
    grid,
    tiles: newTiles,
  };
};

const useGameBoard = ({
  rows,
  cols,
  gameStatus,
  addScore,
}: GameBoardParams) => {
  const gridRef = useRef(createEmptyGrid(rows, cols));
  const [tiles, setTiles] = useState<Tile[]>([]);
  const pendingQueueRef = useRef<number[]>([]);
  const [moving, setMoving] = useState(false);
  const [winGame, setWinGame] = useState<boolean | undefined>();
  const pauseRef = useRef(gameStatus.pause);

  const onMove = useCallback((dir: Vector) => {
    if (pendingQueueRef.current.length === 0 && !pauseRef.current) {
      const { tiles: newTiles, moveQueue, grid } = moveInDirection(
        gridRef.current,
        dir,
      );
      gridRef.current = grid;
      pendingQueueRef.current = moveQueue;
      setMoving(moveQueue.length > 0);
      setTiles(newTiles);
    }
  }, []);

  const onMovePending = useCallback(() => {
    pendingQueueRef.current.pop();
    setMoving(pendingQueueRef.current.length > 0);
  }, []);

  const onMergePending = useCallback(() => {
    pendingQueueRef.current.pop();
  }, []);

  useLayoutEffect(() => {
    if (!moving) {
      const {
        tiles: newTiles,
        mergeQueue,
        score,
        grid,
      } = mergeAndCreateNewTiles(gridRef.current);
      gridRef.current = grid;
      pendingQueueRef.current = mergeQueue;

      addScore(score);
      setTiles(newTiles);
    }
  }, [moving, addScore]);

  useEffect(() => {
    const { grid, tiles: newTiles } = resetGameBoard(rows, cols);
    gridRef.current = grid;
    setWinGame(undefined);
    setTiles(newTiles);
  }, [rows, cols]);

  useEffect(() => {
    if (!pauseRef.current) {
      if (winGame == null && tiles.some(({ value }) => value === 2048)) {
        setWinGame(true);
      }

      if (!canMoveTile(gridRef.current, tiles)) {
        setWinGame(false);
      }
    }
  }, [tiles, winGame]);

  useEffect(() => {
    const { win, pause } = gameStatus;
    pauseRef.current = pause;

    if (win == null) {
      const r = gridRef.current.length;
      const c = gridRef.current[0].length;
      const { grid, tiles: newTiles } = resetGameBoard(r, c);

      gridRef.current = grid;
      setTiles(newTiles);
      setWinGame(undefined);
    }
  }, [gameStatus]);

  return { tiles, winGame, onMove, onMovePending, onMergePending };
};

export default useGameBoard;
