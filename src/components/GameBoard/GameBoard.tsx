import React, { FC, ReactElement } from 'react';
import { calcGridSpacing, createCells } from '../../utils/common';
import { GRID_SIZE } from '../../utils/constants';
import StyledCell from './StyledCell';
import StyledGrid from './StyledGrid';

export interface GridProps {
  rows: number;
  cols: number;
  children: ReactElement;
}

const GameBoard: FC<GridProps> = ({ rows, cols, children }) => {
  const spacing = calcGridSpacing(GRID_SIZE, Math.max(rows, cols));
  const cells = createCells(rows * cols);

  return (
    <StyledGrid
      width={GRID_SIZE}
      height={GRID_SIZE}
      rows={rows}
      cols={cols}
      spacing={spacing}
    >
      {cells.map((c) => (
        <StyledCell key={c} />
      ))}
      {children}
    </StyledGrid>
  );
};

export default React.memo(GameBoard);
