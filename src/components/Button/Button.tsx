import React, { forwardRef, PropsWithChildren } from 'react';
import { StyledButton, StyledButtonProps } from './styled';

export interface ButtonProps extends StyledButtonProps {
  onClick: () => void;
}

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(
  ({ onClick, disable = false, ...rest }, ref) => (
    <StyledButton
      ref={ref}
      disable={disable}
      onClick={disable ? undefined : onClick}
      {...rest}
    />
  ),
);

export default Button;
