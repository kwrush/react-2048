import React, { FC } from 'react';
import { getTileColor } from '../../utils/common';
import { StyledTile, StyledTileProps } from './styled';
import StyledTileValue from './styled/StyledTileValue';

export interface TileProps extends StyledTileProps {
  isNew?: boolean;
  isMerging?: boolean;
  onMoveEnd: () => void;
  onMergeEnd: () => void;
}

const Tile: FC<TileProps> = ({
  value,
  x,
  y,
  width,
  height,
  isNew = false,
  isMerging = false,
  onMoveEnd,
  onMergeEnd,
}) => (
  <StyledTile
    value={value}
    x={x}
    y={y}
    width={width}
    height={height}
    onTransitionEnd={() => onMoveEnd()}
  >
    <StyledTileValue
      backgroundColor={getTileColor(value)}
      isNew={isNew}
      isMerging={isMerging}
      onAnimationEnd={() => onMergeEnd()}
    >
      {value}
    </StyledTileValue>
  </StyledTile>
);

export default Tile;
