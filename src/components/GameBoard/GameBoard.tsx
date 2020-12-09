import React, { forwardRef, PropsWithChildren } from 'react';
import { createCells } from '../../utils/common';
import Box from '../Box';
import { StyledCell, StyledGrid, StyledGridProps } from './styled';

export type GameBoardProps = StyledGridProps;

const GameBoard = forwardRef<HTMLDivElement, PropsWithChildren<GameBoardProps>>(
  ({ rows, cols, width, height, spacing, children }, ref) => {
    const cells = createCells(rows * cols);

    return (
      <Box position="relative" margin="s4" ref={ref}>
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
        </StyledGrid>
        <Box
          position="absolute"
          top={0}
          left={0}
          blockSize={`${height.toFixed(0)}px`}
          inlineSize={`${width.toFixed(0)}px`}
        >
          {children}
        </Box>
      </Box>
    );
  },
);

export default React.memo(GameBoard);
