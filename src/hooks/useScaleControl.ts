import { useCallback, useState } from 'react';
import { clamp } from '../utils/common';
import { MAX_SCALE, MIN_SCALE } from '../utils/constants';

const useScaleControl = (initScale: number): [number, (s: number) => void] => {
  const [scale, setScale] = useState(clamp(initScale, MIN_SCALE, MAX_SCALE));

  const onSetScale = useCallback((s: number) => {
    setScale(clamp(s, MIN_SCALE, MAX_SCALE));
  }, []);

  return [scale, onSetScale];
};

export default useScaleControl;
