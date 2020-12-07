import styled from 'styled-components';

export interface StyledTextProps {
  color?: string;
  fontSize?: number;
  fontWeight?: 'bold' | 'normal';
  textTransform?: 'capitalize' | 'lowercase' | 'uppercase' | 'none';
}

const StyledText = styled.span<StyledTextProps>`
  text-transform: ${({ textTransform }) => textTransform};
  color: ${({ color }) => color};
  font-size: ${({ fontSize = 13 }) => `${fontSize}px`};
  font-weight: ${({ fontWeight }) => fontWeight};
  line-height: 1.25;
  white-space: nowrap;
`;

export default StyledText;
