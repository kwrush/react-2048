import { useCallback, useReducer } from 'react';

export type GameStatus = 'win' | 'lost' | 'continue' | 'restart' | 'running';

export type GameState = {
  status: GameStatus;
  pause: boolean;
};

export type ChangeStateAction = {
  type: GameStatus;
};

const initState: GameState = { status: 'running', pause: false };

const reducer = (
  state: GameState = initState,
  action: ChangeStateAction,
): GameState => {
  switch (action.type) {
    case 'win':
    case 'lost':
      return { ...state, status: action.type, pause: true };
    case 'continue':
    case 'restart':
      return { ...state, status: action.type, pause: false };
    case 'running':
      return { ...initState };
    default:
      return state;
  }
};

const useGameState = (): [GameState, (nextStatus: GameStatus) => void] => {
  const [gameState, dipatcher] = useReducer(reducer, initState);
  const setGameState = useCallback((nextStatus: GameStatus) => {
    dipatcher({ type: nextStatus });
  }, []);

  return [gameState, setGameState];
};

export default useGameState;
