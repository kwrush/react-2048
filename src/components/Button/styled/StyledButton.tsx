import styled, { css } from 'styled-components';

export interface StyledButtonProps {
  disable?: boolean;
  mini?: boolean;
}

const getMiniProps = () => css`
  width: 24px;
  height: 24px;
  font-size: 12px;
  line-height: 24px;
  padding: 0;
`;

const StyledButton = styled.button<StyledButtonProps>`
  background: #776e65;
  outline: none;
  border: none;
  border-radius: 3px;
  color: white;
  padding: 8px 16px;
  line-height: 1.75;
  margin: 0;
  box-sizing: border-box;
  white-space: nowrap;
  ${({ mini }) => mini && getMiniProps};
  opacity: ${({ disable }) => disable && 0.7};
  cursor: ${({ disable }) => (disable ? 'not-allowed' : 'pointer')};
`;

export default StyledButton;
