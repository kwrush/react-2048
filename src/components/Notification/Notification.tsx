import React, { FC, useCallback, useEffect, useState } from 'react';
import { StyledBackdrop, StyledModal } from './styled';
import Button from '../Button';
import Box from '../Box';

export interface NotificationProps {
  win?: boolean;
  onClose: () => void;
}

const Notification: FC<NotificationProps> = ({ win, onClose }) => {
  const [open, setOpen] = useState(win != null);

  useEffect(() => {
    setOpen(win != null);
  }, [win, setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose();
  }, [onClose]);

  return open ? (
    <StyledModal>
      <StyledBackdrop />
      <Box fontSize={22} paddingBlock={16}>
        {win ? 'You win! Continue?' : 'Oops...Game Over!'}
      </Box>
      <Button onClick={handleClose}>{win ? 'Continue' : 'Retry'}</Button>
    </StyledModal>
  ) : null;
};

export default Notification;
