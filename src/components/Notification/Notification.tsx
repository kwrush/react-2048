import React, { FC } from 'react';
import { StyledBackdrop, StyledModal } from './styled';
import Button from '../Button';
import Box from '../Box';
import Text from '../Text';
import { GameStatus } from '../../hooks/useGameState';

export interface NotificationProps {
  gameStatus: GameStatus;
  onClose: () => void;
}

const Notification: FC<NotificationProps> = ({ gameStatus, onClose }) => {
  const win = gameStatus === 'win';
  const show = win || gameStatus === 'lose';
  return show ? (
    <StyledModal>
      <StyledBackdrop />
      <Box paddingBlock="s5">
        <Text fontSize={22}>
          {win ? 'You win! Continue?' : 'Oops...Game Over!'}
        </Text>
      </Box>
      <Button onClick={onClose}>{win ? 'Continue' : 'Retry'}</Button>
    </StyledModal>
  ) : null;
};

export default Notification;
