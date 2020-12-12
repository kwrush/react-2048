import React, { FC, useCallback, useEffect, useState } from 'react';
import Box from '../components/Box';
import Control from '../components/Control/Control';
import GameBoard from '../components/GameBoard';
import Notification from '../components/Notification';
import ScoreBoard from '../components/ScoreBoard';
import Text from '../components/Text';
import Tile from '../components/Tile';
import useGameBoard from '../hooks/useGameBoard';
import useGameScore from '../hooks/useGameScore';
import useGameStatus from '../hooks/useGameStatus';
import useScaleControl from '../hooks/useScaleControl';
import { calcGridSpacing, calcTileSize } from '../utils/common';
import { GRID_SIZE, MIN_SCALE } from '../utils/constants';

const App: FC = () => {
  const [gameStatus, setGameStatus] = useGameStatus();
  const [rows, setRows] = useScaleControl(MIN_SCALE);
  const [cols, setCols] = useScaleControl(MIN_SCALE);
  const [spacing, setSpacing] = useState(
    calcGridSpacing(GRID_SIZE, Math.max(rows, cols)),
  );
  const [tileSize, setTileSize] = useState(
    calcTileSize(GRID_SIZE, rows, cols, spacing),
  );

  const { total, best, addScore, setTotal } = useGameScore();
  const {
    tiles,
    winGame,
    onMove,
    onMovePending,
    onMergePending,
  } = useGameBoard({
    rows,
    cols,
    gameStatus,
    addScore,
  });

  const onCloseNotification = useCallback(() => {
    const { win } = gameStatus;
    setGameStatus({ type: win ? 'continue' : 'restart' });
  }, [gameStatus, setGameStatus]);

  useEffect(() => {
    if (gameStatus.win == null) {
      setTotal(0);
    }
  }, [gameStatus, setTotal]);

  useEffect(() => {
    if (winGame != null) {
      setGameStatus({ type: winGame ? 'win' : 'lose' });
    }
  }, [winGame, setGameStatus]);

  useEffect(() => {
    const newSpacing = calcGridSpacing(GRID_SIZE, Math.max(rows, cols));
    setSpacing(newSpacing);
    setTileSize(calcTileSize(GRID_SIZE, rows, cols, newSpacing));
  }, [rows, cols, setTileSize, setSpacing]);

  return (
    <Box justifyContent="center">
      <Box justifyContent="center" flexDirection="column" padding="s5">
        <Box inlineSize="100%" justifyContent="space-between">
          <Box>
            <Text fontSize={64} fontWeight="bold">
              2048
            </Text>
          </Box>
          <Box justifyContent="center">
            <ScoreBoard total={total} title="score" />
            <ScoreBoard total={best} title="best" />
          </Box>
        </Box>
        <Box marginBlock="s5">
          <Control
            rows={rows}
            cols={cols}
            onReset={() => setGameStatus({ type: 'restart' })}
            onChangeRow={setRows}
            onChangeCol={setCols}
          />
        </Box>
        <Box marginBlock="s4">
          <GameBoard
            width={GRID_SIZE}
            height={GRID_SIZE}
            rows={rows}
            cols={cols}
            spacing={spacing}
            onMove={onMove}
            onMovePending={onMovePending}
            onMergePending={onMergePending}
          >
            <Notification win={gameStatus.win} onClose={onCloseNotification} />
            {tiles?.map(({ r, c, id, value, isMerging, isNew }) => (
              <Tile
                key={id}
                width={tileSize.width}
                height={tileSize.height}
                x={(spacing + tileSize.width) * c}
                y={(spacing + tileSize.height) * r}
                value={value}
                isNew={isNew}
                isMerging={isMerging}
              />
            ))}
          </GameBoard>
        </Box>
        <Box marginBlock="s4" justifyContent="center" flexDirection="column">
          <Text fontSize={16} as="p">
            ✨ Join tiles with the same value to get 2048
          </Text>
          <Text fontSize={16} as="p">
            🕹️ Play with arrow keys or swipe
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
