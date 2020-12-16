import React, { FC, useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Box from '../components/Box';
import Control from '../components/Control/Control';
import GameBoard from '../components/GameBoard';
import Notification from '../components/Notification';
import ScoreBoard from '../components/ScoreBoard';
import Switch from '../components/Switch';
import Text from '../components/Text';
import Tile from '../components/Tile';
import useGameBoard from '../hooks/useGameBoard';
import useGameScore from '../hooks/useGameScore';
import useGameState from '../hooks/useGameState';
import useScaleControl from '../hooks/useScaleControl';
import defaultTheme from '../themes/default';
import darkTheme from '../themes/dark';
import { calcLocation, calcTileSize } from '../utils/common';
import { APP_NAME, GRID_SIZE, MIN_SCALE, SPACING } from '../utils/constants';
import useLocalStorage from '../hooks/useLocalStorage';

export type ThemeValue = 'default' | 'dark';

export type Configuration = {
  theme: ThemeValue;
  bestScore: number;
  rows: number;
  cols: number;
};

const isThemeValue = (t: string): t is ThemeValue => {
  return t === 'default' || t === 'dark';
};

const App: FC = () => {
  const [{ status: gameStatus, pause }, setGameStatus] = useGameState();
  const [config, setConfig] = useLocalStorage<Configuration>(APP_NAME, {
    theme: 'default',
    bestScore: 0,
    rows: MIN_SCALE,
    cols: MIN_SCALE,
  });
  // The fallback values make sure the game can be rendered correctly
  // if no such items in localStorage
  const [theme, setTheme] = useState(config.theme ?? 'default');
  const [rows, setRows] = useScaleControl(config.rows ?? MIN_SCALE);
  const [cols, setCols] = useScaleControl(config.cols ?? MIN_SCALE);
  const { total, best, addScore, setTotal } = useGameScore(
    config.bestScore ?? 0,
  );

  const [tileSize, setTileSize] = useState(
    calcTileSize(GRID_SIZE, rows, cols, SPACING),
  );

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

  const onChangeTheme = useCallback((newTheme: string) => {
    if (isThemeValue(newTheme)) {
      setTheme(newTheme);
    }
  }, []);

  useEffect(() => {
    setTileSize(calcTileSize(GRID_SIZE, rows, cols, SPACING));
  }, [rows, cols, setTileSize]);

  useEffect(() => {
    if (gameStatus === 'restart') setTotal(0);
  }, [gameStatus, setTotal]);

  useEffect(() => {
    const { rows: currentRows, cols: currentCols } = config;
    if (rows !== currentRows) setConfig({ ...config, rows });
    if (cols !== currentCols) setConfig({ ...config, cols });
  }, [cols, config, rows, setConfig]);

  useEffect(() => {
    const { bestScore, theme: currentTheme } = config;
    if (bestScore !== best) setConfig({ ...config, bestScore: best });
    if (currentTheme !== theme) setConfig({ ...config, theme });
  }, [best, theme, config, setConfig]);

  return (
    <ThemeProvider theme={theme === 'default' ? defaultTheme : darkTheme}>
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
          <Box marginBlockStart="s5" inlineSize="100%" justifyContent="end">
            <Switch
              title="dark mode"
              value={config.theme}
              activeValue="dark"
              inactiveValue="default"
              knobColor="background"
              activeColor="white"
              inactiveColor="black"
              onChange={onChangeTheme}
            />
          </Box>
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
          <Box marginBlockStart="s3" marginBlockEnd="s6" inlineSize="100%">
            <Control
              rows={rows}
              cols={cols}
              onReset={onResetGame}
              onChangeRow={setRows}
              onChangeCol={setCols}
            />
          </Box>
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
                x={calcLocation(tileSize.width, c, SPACING)}
                y={calcLocation(tileSize.height, r, SPACING)}
                value={value}
                isNew={isNew}
                isMerging={isMerging}
              />
            ))}
          </GameBoard>
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
