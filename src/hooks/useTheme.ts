import { useReducer } from 'react';
import { ThemeValue } from '../themes/types';

const isThemeValue = (t: string): t is ThemeValue =>
  t === 'default' || t === 'dark';

const themeReducer = (theme: ThemeValue, nextTheme: string) =>
  isThemeValue(nextTheme) ? nextTheme : theme;

const useTheme = (
  theme: ThemeValue,
): [ThemeValue, (nextTheme: string) => void] => useReducer(themeReducer, theme);

export default useTheme;
