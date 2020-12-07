import React, { FC } from 'react';
import Box from '../Box';
import Score from './Score';

export interface ScoreBoardProps {
  best: number;
  total: number;
}

const ScoreBoard: FC<ScoreBoardProps> = ({ best, total }) => {
  return (
    <Box justifyContent="center">
      <Score total={total} title="score" />
      <Score total={best} title="best" />
    </Box>
  );
};

export default ScoreBoard;
