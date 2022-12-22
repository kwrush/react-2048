import React, { FC, useCallback, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import Box from './components/Box';
import Control from './components/Control/Control';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import Switch from './components/Switch';
import Text from './components/Text';
import useGameBoard from './hooks/useGameBoard';
import useGameScore from './hooks/useGameScore';
import useGameState, { GameStatus } from './hooks/useGameState';
import useScaleControl from './hooks/useScaleControl';
import { GRID_SIZE, MIN_SCALE, SPACING } from './utils/constants';
import useLocalStorage from './hooks/useLocalStorage';
import { ThemeName } from './themes/types';
import useTheme from './hooks/useTheme';
import { canGameContinue, isWin } from './utils/rules';

export type Configuration = {
  theme: ThemeName;
  bestScore: number;
  rows: number;
  cols: number;
};

const APP_NAME = 'react-2048';

const App: FC = () => {
  const [gameState, setGameStatus] = useGameState({
    status: 'running',
    pause: false,
  });

  const [config, setConfig] = useLocalStorage<Configuration>(APP_NAME, {
    theme: 'default',
    bestScore: 0,
    rows: MIN_SCALE,
    cols: MIN_SCALE,
  });

  const [{ name: themeName, value: themeValue }, setTheme] = useTheme(
    config.theme,
  );

  const [rows, setRows] = useScaleControl(config.rows);
  const [cols, setCols] = useScaleControl(config.cols);

  const { total, best, addScore, setTotal } = useGameScore(config.bestScore);

  const { tiles, grid, onMove, onMovePending, onMergePending } = useGameBoard({
    rows,
    cols,
    gameState,
    addScore,
  });

  const onResetGame = useCallback(() => {
    setGameStatus('restart');
  }, [setGameStatus]);

  const onCloseNotification = useCallback(
    (currentStatus: GameStatus) => {
      setGameStatus(currentStatus === 'win' ? 'continue' : 'restart');
    },
    [setGameStatus],
  );

  if (gameState.status === 'restart') {
    setTotal(0);
    setGameStatus('running');
  } else if (gameState.status === 'running' && isWin(tiles)) {
    setGameStatus('win');
  } else if (gameState.status !== 'lost' && !canGameContinue(grid, tiles)) {
    setGameStatus('lost');
  }

  useEffect(() => {
    setGameStatus('restart');
  }, [rows, cols, setGameStatus]);

  useEffect(() => {
    setConfig({ rows, cols, bestScore: best, theme: themeName });
  }, [rows, cols, best, themeName, setConfig]);

  return (
    <ThemeProvider theme={themeValue}>
      <Box
        justifyContent="center"
        inlineSize="100%"
        blockSize="100%"
        alignItems="start"
        borderRadius={0}
      >
        <Box
          justifyContent="center"
          flexDirection="column"
          inlineSize={`${GRID_SIZE}px`}
        >
          <Box marginBlockStart="s6" inlineSize="100%" justifyContent="end">
            <Switch
              title="dark mode"
              checked={themeName === 'dark'}
              activeValue="dark"
              inactiveValue="default"
              onChange={setTheme}
            />
          </Box>
          <Box
            inlineSize="100%"
            justifyContent="space-between"
            marginBlockStart="s2"
          >
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
          <Box marginBlockStart="s2" marginBlockEnd="s6" inlineSize="100%">
            <Control
              rows={rows}
              cols={cols}
              onReset={onResetGame}
              onChangeRow={setRows}
              onChangeCol={setCols}
            />
          </Box>
          <GameBoard
            tiles={tiles}
            boardSize={GRID_SIZE}
            rows={rows}
            cols={cols}
            spacing={SPACING}
            gameStatus={gameState.status}
            onMove={onMove}
            onMovePending={onMovePending}
            onMergePending={onMergePending}
            onCloseNotification={onCloseNotification}
          />
          <Box marginBlock="s4" justifyContent="center" flexDirection="column">
            <Text fontSize={16} as="p" color="primary">
              ✨ Join tiles with the same value to get 2048
            </Text>
            <Text fontSize={16} as="p" color="primary">
              🕹️ Play with arrow keys or swipe
            </Text>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
