import styled from 'styled-components';

export interface StyledBoxProps {
  position?: 'relative' | 'absoulte' | 'fixed' | 'static';
  paddingInline?: number;
  paddingBlock?: number;
  marginInline?: number;
  marginBlock?: number;
  flexDirection?: 'row' | 'column';
  justifyContent?:
    | 'start'
    | 'center'
    | 'space-between'
    | 'space-evenly'
    | 'space-around';
  inlineSize?: number;
  blockSize?: number;
  minInlineSize?: number;
  minBlockSize?: number;
  background?: string;
  borderRadius?: number;
}

const StyledBox = styled.div<StyledBoxProps>`
  display: flex;
  box-sizing: border-box;
  position: ${({ position }) => position};
  width: ${({ inlineSize }) => inlineSize && `${inlineSize}px`};
  height: ${({ blockSize }) => blockSize && `${blockSize}px`};
  min-width: ${({ minInlineSize }) => minInlineSize && `${minInlineSize}px`};
  min-height: ${({ minBlockSize }) => minBlockSize && `${minBlockSize}px`};
  padding-top: ${({ paddingBlock }) => paddingBlock && `${paddingBlock}px`};
  padding-bottom: ${({ paddingBlock }) => paddingBlock && `${paddingBlock}px`};
  padding-left: ${({ paddingInline }) => paddingInline && `${paddingInline}px`};
  padding-right: ${({ paddingInline }) =>
    paddingInline && `${paddingInline}px`};
  margin-top: ${({ marginBlock }) => marginBlock && `${marginBlock}px`};
  margin-bottom: ${({ marginBlock }) => marginBlock && `${marginBlock}px`};
  margin-left: ${({ marginInline }) => marginInline && `${marginInline}px`};
  margin-right: ${({ marginInline }) => marginInline && `${marginInline}px`};
  flex-direction: ${({ flexDirection = 'row' }) => flexDirection};
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent};
  background: ${({ background }) => background};
  border-radius: ${({ borderRadius }) => borderRadius && `${borderRadius}px`};
`;

export default StyledBox;
