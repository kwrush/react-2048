import React, { FC } from 'react';
import StyledTile, { StyledTileProps } from './StyledTile';

type TileProps = StyledTileProps;

const Tile: FC<TileProps> = ({ value, ...rest }) => (
  <StyledTile {...rest} value={value}>
    {value}
  </StyledTile>
);

export default Tile;
