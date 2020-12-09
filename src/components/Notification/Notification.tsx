import React, { FC, useCallback, useEffect, useState } from 'react';
import { StyledBackdrop, StyledModal } from './styled';
import Button from '../Button';
import Box from '../Box';
import Text from '../Text';

export interface NotificationProps {
  win?: boolean;
  onClose: () => void;
}

const Notification: FC<NotificationProps> = ({ win, onClose }) => {
  const [open, setOpen] = useState(win != null);

  useEffect(() => {
    console.log(win != null);
    setOpen(win != null);
  }, [win, setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose();
  }, [onClose]);

  return open ? (
    <StyledModal>
      <StyledBackdrop />
      <Box paddingBlock="s5">
        <Text fontSize={22}>
          {win ? 'You win! Continue?' : 'Oops...Game Over!'}
        </Text>
      </Box>
      <Button onClick={handleClose}>{win ? 'Continue' : 'Retry'}</Button>
    </StyledModal>
  ) : null;
};

export default Notification;
