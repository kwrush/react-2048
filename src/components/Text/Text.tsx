import React, { forwardRef, PropsWithChildren } from 'react';
import { StyledText, StyledTextProps } from './styled';

export type TextProps = StyledTextProps;

const Text = forwardRef<HTMLSpanElement, PropsWithChildren<TextProps>>(
  (props, ref) => <StyledText ref={ref} {...props} />,
);

export default Text;
