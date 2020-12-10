import { useCallback, useEffect, useRef, useState } from 'react';
import { NAME } from '../utils/constants';
import ScoreStorage from '../utils/ScoreStorage';

const useGameScore = () => {
  const storageRef = useRef(new ScoreStorage(NAME));
  const [total, setTotal] = useState(0);
  const [best, setBest] = useState(storageRef.current.getScore());

  const addScore = useCallback((s: number) => setTotal((t) => t + s), []);

  useEffect(() => {
    setBest((b) => (total > b ? total : b));
  }, [total]);

  useEffect(() => {
    storageRef.current.saveScore(best);
  }, [best]);

  return {
    total,
    best,
    setTotal,
    addScore,
  };
};

export default useGameScore;
