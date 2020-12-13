import React, { FC, useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Box from '../components/Box';
import Control from '../components/Control/Control';
import GameBoard from '../components/GameBoard';
import Notification from '../components/Notification';
import ScoreBoard from '../components/ScoreBoard';
import Text from '../components/Text';
import Tile from '../components/Tile';
import useGameBoard from '../hooks/useGameBoard';
import useGameScore from '../hooks/useGameScore';
import useGameState from '../hooks/useGameState';
import useScaleControl from '../hooks/useScaleControl';
import theme from '../themes/default';
import { calcTileSize } from '../utils/common';
import { GRID_SIZE, MIN_SCALE, SPACING } from '../utils/constants';

const App: FC = () => {
  const [{ status: gameStatus, pause }, setGameStatus] = useGameState();
  const [rows, setRows] = useScaleControl(MIN_SCALE);
  const [cols, setCols] = useScaleControl(MIN_SCALE);

  const [tileSize, setTileSize] = useState(
    calcTileSize(GRID_SIZE, rows, cols, SPACING),
  );

  const { total, best, addScore, setTotal } = useGameScore();
  const { tiles, onMove, onMovePending, onMergePending } = useGameBoard({
    rows,
    cols,
    pause,
    gameStatus,
    setGameStatus,
    addScore,
  });

  const onCloseNotification = useCallback(() => {
    setGameStatus(gameStatus === 'win' ? 'continue' : 'restart');
  }, [gameStatus, setGameStatus]);

  const onResetGame = useCallback(() => {
    setGameStatus('restart');
  }, [setGameStatus]);

  useEffect(() => {
    if (gameStatus === 'restart') {
      setTotal(0);
    }
  }, [gameStatus, setTotal]);

  useEffect(() => {
    setTileSize(calcTileSize(GRID_SIZE, rows, cols, SPACING));
  }, [rows, cols, setTileSize]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        justifyContent="center"
        inlineSize="100%"
        blockSize="100%"
        alignItems="start"
      >
        <Box
          justifyContent="center"
          flexDirection="column"
          inlineSize={`${GRID_SIZE}px`}
        >
          <Box inlineSize="100%" justifyContent="space-between">
            <Box>
              <Text fontSize={64} fontWeight="bold" color="primary">
                2048
              </Text>
            </Box>
            <Box justifyContent="center">
              <ScoreBoard total={total} title="score" />
              <ScoreBoard total={best} title="best" />
            </Box>
          </Box>
          <Box marginBlock="s5" inlineSize="100%">
            <Control
              rows={rows}
              cols={cols}
              onReset={onResetGame}
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
              spacing={SPACING}
              onMove={onMove}
              onMovePending={onMovePending}
              onMergePending={onMergePending}
            >
              <Notification
                gameStatus={gameStatus}
                onClose={onCloseNotification}
              />
              {tiles?.map(({ r, c, id, value, isMerging, isNew }) => (
                <Tile
                  key={id}
                  width={tileSize.width}
                  height={tileSize.height}
                  x={(SPACING + tileSize.width) * c}
                  y={(SPACING + tileSize.height) * r}
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
    </ThemeProvider>
  );
};

export default App;
