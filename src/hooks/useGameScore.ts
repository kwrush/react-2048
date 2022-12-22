import { useCallback, useState } from 'react';

const useGameScore = (initialBest: number) => {
  const [total, setTotal] = useState(0);
  const [best, setBest] = useState(initialBest);

  const addScore = useCallback((s: number) => setTotal((t) => t + s), []);

  if (total > best) {
    setBest(total);
  }

  return {
    total,
    best,
    setTotal,
    addScore,
  };
};

export default useGameScore;
