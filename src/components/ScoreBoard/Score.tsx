import React, { FC, useEffect, useRef } from 'react';
import Box from '../Box';
import Text from '../Text';
import StyledScore from './styled';

export interface ScoreProps {
  title: string;
  total: number;
}

const Score: FC<ScoreProps> = ({ total, title }) => {
  const totalRef = useRef(total);
  const score = total - totalRef.current;

  useEffect(() => {
    totalRef.current = total;
  }, [total, totalRef]);

  return (
    <Box
      marginInline={4}
      paddingBlock={8}
      paddingInline={16}
      minInlineSize={70}
      background="#bbada0"
      flexDirection="column"
      borderRadius={3}
      position="relative"
      justifyContent="center"
    >
      <Text textTransform="uppercase" fontWeight="bold" color="#eee4da">
        {title}
      </Text>
      <Text color="white" fontWeight="bold" fontSize={18}>
        {total}
      </Text>
      {score > 0 && (
        // Assign a different key to let React render the animation from beginning
        <StyledScore key={total.toFixed(0)}>
          <Text fontSize={18} fontWeight="bold">
            +{score}
          </Text>
        </StyledScore>
      )}
    </Box>
  );
};

export default Score;
