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
  <Box
    boxSizing="border-box"
    inlineSize="100%"
    paddingInline="s3"
    paddingBlock="s5"
    justifyContent="space-between"
  >
    <Button onClick={onReset}>
      <Text color="white" fontSize={16} textTransform="capitalize">
        new game
      </Text>
    </Button>
    <Box marginInlineStart="s5">
      <Box marginInlineEnd="s2">
        <Box marginInlineEnd="s1">
          <Text textTransform="uppercase" fontSize={14}>
            rows:
          </Text>
        </Box>
        <Button mini onClick={() => onChangeRow(rows - 1)}>
          -
        </Button>
        <Box marginInline="s1">
          <Text fontSize={16}>{rows}</Text>
        </Box>
        <Button mini onClick={() => onChangeRow(rows + 1)}>
          +
        </Button>
      </Box>
      <Box>
        <Box marginInlineEnd="s1">
          <Text textTransform="uppercase" fontSize={14}>
            columns:
          </Text>
        </Box>
        <Button mini onClick={() => onChangeCol(cols - 1)}>
          -
        </Button>
        <Box marginInline="s1">
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
