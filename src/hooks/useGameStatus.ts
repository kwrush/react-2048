import { useReducer } from 'react';

export type GameStatus = {
  win?: boolean;
  pause: boolean;
};

export type GameStatusActionType = 'win' | 'lose' | 'continue' | 'restart';

export type ChangeStatusAction = {
  type: GameStatusActionType;
};

const initState = { pause: false };

const reducer = (
  state: GameStatus = initState,
  action: ChangeStatusAction,
): GameStatus => {
  switch (action.type) {
    case 'win':
      return { ...state, win: true, pause: true };
    case 'lose':
      return { ...state, win: false, pause: true };
    case 'continue':
      return { ...state, pause: false };
    case 'restart':
      return { ...initState };
    default:
      return state;
  }
};

const useGameStatus = () => {
  return useReducer(reducer, initState);
};

export default useGameStatus;
