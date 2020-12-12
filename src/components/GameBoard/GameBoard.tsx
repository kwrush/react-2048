import React, { FC, PropsWithChildren, useRef } from 'react';
import useArrowKeyPress from '../../hooks/useArrowKeyPress';
import useSwipe from '../../hooks/useSwipe';
import { createIndexArray } from '../../utils/common';
import { Vector } from '../../utils/constants';
import Box from '../Box';
import { StyledCell, StyledGrid, StyledGridProps } from './styled';

export type BoardSize = {
  width: number;
  height: number;
};

export interface GameBoardProps extends StyledGridProps {
  onMove: (dir: Vector) => void;
  onMovePending: () => void;
  onMergePending: () => void;
}

const GameBoard: FC<PropsWithChildren<GameBoardProps>> = ({
  rows,
  cols,
  width,
  height,
  spacing,
  onMove,
  onMovePending,
  onMergePending,
  children,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const cells = createIndexArray(rows * cols);

  useArrowKeyPress(onMove);
  useSwipe(boardRef, onMove);

  return (
    <Box position="relative" ref={boardRef}>
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
        onTransitionEnd={onMovePending}
        onAnimationEnd={onMergePending}
      >
        {children}
      </Box>
    </Box>
  );
};

export default React.memo(GameBoard);
