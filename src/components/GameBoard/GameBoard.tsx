import React, { forwardRef, PropsWithChildren } from 'react';
import { createCells } from '../../utils/common';
import Box from '../Box';
import { StyledCell, StyledGrid, StyledGridProps } from './styled';

export type GameBoardProps = StyledGridProps;

const GameBoard = forwardRef<HTMLDivElement, PropsWithChildren<GameBoardProps>>(
  ({ rows, cols, width, height, spacing, children }, ref) => {
    const cells = createCells(rows * cols);

    return (
      <Box paddingBlock={spacing} ref={ref}>
        <StyledGrid
          width={width}
          height={height}
          rows={rows}
          cols={cols}
          spacing={spacing}
        >
          {cells.map((c) => (
            <StyledCell key={c} />
          ))}
          {children}
        </StyledGrid>
      </Box>
    );
  },
);

export default React.memo(GameBoard);
