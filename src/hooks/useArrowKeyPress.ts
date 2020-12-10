import { useCallback, useEffect } from 'react';
import { ArrowKey, ArrowKeyType, DIR, Vector } from '../utils/constants';

const isArrowKey = (key: string): key is ArrowKeyType =>
  Object.keys(ArrowKey).includes(key);

// Rather than returning the direction, we pass the direction to the given callback
// so that keydown event won't make React rerender until the callback changes some states
const useArrowKeyPress = (cb?: (dir: Vector) => void) => {
  const onKeyDown = useCallback(
    ({ key }: KeyboardEvent) => {
      if (isArrowKey(key) && cb) {
        cb(DIR[key]);
      }
    },
    [cb],
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);
};

export default useArrowKeyPress;
