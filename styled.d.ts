import 'styled-components';

export type Color =
  | 'transparent'
  | 'black'
  | 'white'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'foreground'
  | 'background'
  | 'backdrop'
  | 'tile2'
  | 'tile4'
  | 'tile8'
  | 'tile16'
  | 'tile32'
  | 'tile64'
  | 'tile128'
  | 'tile256'
  | 'tile512'
  | 'tile1024'
  | 'tile2048';

export type Palette = Record<Color, string>;

declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string;
    palette: Palette;
  }
}
