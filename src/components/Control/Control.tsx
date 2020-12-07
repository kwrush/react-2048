import React, { FC } from 'react';
import Box from '../Box';
import Button from '../Button';
import Text from '../Text';

export interface ControlProps {
  rows: number;
  cols: number;
  onReset: () => void;
  onChangeRow: (newRow: number) => void;
  onChangeCol: (newCol: number) => void;
}

const Control: FC<ControlProps> = ({
  rows,
  cols,
  onReset,
  onChangeRow,
  onChangeCol,
}) => (
  <Box paddingBlock={16} justifyContent="space-between">
    <Button onClick={onReset}>New Game</Button>
    <Box>
      <Box paddingInline={2}>
        <Box paddingInline={2}>
          <Text textTransform="uppercase" fontSize={14}>
            rows:
          </Text>
        </Box>
        <Button mini onClick={() => onChangeRow(rows - 1)}>
          -
        </Button>
        <Box paddingInline={2}>
          <Text fontSize={16}>{rows}</Text>
        </Box>
        <Button mini onClick={() => onChangeRow(rows + 1)}>
          +
        </Button>
      </Box>
      <Box paddingInline={2}>
        <Box paddingInline={2}>
          <Text textTransform="uppercase" fontSize={14}>
            columns:
          </Text>
        </Box>
        <Button mini onClick={() => onChangeCol(cols - 1)}>
          -
        </Button>
        <Box paddingInline={2}>
          <Text fontSize={16}>{cols}</Text>
        </Box>
        <Button mini onClick={() => onChangeCol(cols + 1)}>
          +
        </Button>
      </Box>
    </Box>
  </Box>
);

export default Control;
