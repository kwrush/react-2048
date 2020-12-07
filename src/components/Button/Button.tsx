import React, { forwardRef, PropsWithChildren } from 'react';
import { StyledButton, StyledButtonProps } from './styled';

export interface ButtonProps extends StyledButtonProps {
  onClick: () => void;
}

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(
  (props, ref) => <StyledButton ref={ref} {...props} />,
);

export default Button;
