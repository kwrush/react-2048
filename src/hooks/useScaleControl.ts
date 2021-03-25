import { useReducer } from 'react';
import { clamp } from '../utils/common';
import { MAX_SCALE, MIN_SCALE } from '../utils/constants';

const scaleReducer = (s: number, change: number) =>
  clamp(s + change, MIN_SCALE, MAX_SCALE);

const useScaleControl = (
  initScale: number,
): [number, (change: number) => void] =>
  useReducer(scaleReducer, clamp(initScale, MIN_SCALE, MAX_SCALE));

export default useScaleControl;
