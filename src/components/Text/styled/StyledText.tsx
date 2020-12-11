import styled, { css } from 'styled-components';

export interface StyledTextProps {
  as?: 'p' | 'span';
  color?: string;
  fontSize?: number;
  fontWeight?: 'bold' | 'normal';
  textTransform?: 'capitalize' | 'lowercase' | 'uppercase' | 'none';
}

const getFontStyle = ({
  as,
  textTransform,
  color,
  fontSize = 14,
  fontWeight,
}: StyledTextProps) => css`
  margin: ${as === 'p' && 0};
  line-height: ${as === 'p' ? 2 : 1.5};
  text-transform: ${textTransform};
  color: ${color};
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
`;

const StyledText = styled.span<StyledTextProps>`
  line-height: 1.25;
  white-space: nowrap;
  ${getFontStyle}
`;

export default StyledText;
