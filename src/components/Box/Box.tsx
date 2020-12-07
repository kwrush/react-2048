import React, { forwardRef, PropsWithChildren } from 'react';
import { StyledBox, StyledBoxProps } from './styled';

export type BoxProps = StyledBoxProps;

const Box = forwardRef<HTMLDivElement, PropsWithChildren<BoxProps>>(
  (props, ref) => <StyledBox ref={ref} {...props} />,
);

export default Box;
