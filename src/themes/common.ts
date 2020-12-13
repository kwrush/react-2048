export type Spacing =
  | 's0'
  | 's1'
  | 's2'
  | 's3'
  | 's4'
  | 's5'
  | 's6'
  | 's7'
  | 's8'
  | 's9'
  | 's10';

export const SpacingValues: Record<Spacing, string> = {
  s0: '1px',
  s1: '2px',
  s2: '4px',
  s3: '8px',
  s4: '12px',
  s5: '16px',
  s6: '20px',
  s7: '24px',
  s8: '32px',
  s9: '48px',
  s10: '64px',
};

export type Color =
  | 'transparent'
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

export interface Theme {
  borderRadius: string;
  palette: Palette;
}
