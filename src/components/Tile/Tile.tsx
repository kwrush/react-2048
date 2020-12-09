import React, { FC } from 'react';
import { getTileColor } from '../../utils/common';
import { StyledTile, StyledTileProps } from './styled';
import StyledTileValue from './styled/StyledTileValue';

export interface TileProps extends StyledTileProps {
  isMerging?: boolean;
}

const Tile: FC<TileProps> = ({ value, x, y, width, height }) => {
  return (
    <StyledTile value={value} x={x} y={y} width={width} height={height}>
      <StyledTileValue backgroundColor={getTileColor(value)}>
        {value}
      </StyledTileValue>
    </StyledTile>
  );
};

export default Tile;
