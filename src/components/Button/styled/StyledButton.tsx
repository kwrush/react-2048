import styled, { css } from 'styled-components';

export interface StyledButtonProps {
  mini?: boolean;
}

const getMiniProps = () => css`
  width: 22px;
  height: 22px;
  font-size: 12px;
  line-height: 22px;
  padding: 0;
`;

const StyledButton = styled.button<StyledButtonProps>`
  background: #776e65;
  outline: none;
  border: none;
  border-radius: 3px;
  color: white;
  padding: 8px 16px;
  line-height: 2;
  margin: 0;
  box-sizing: border-box;
  ${({ mini }) => mini && getMiniProps};
  white-space: nowrap;
`;

export default StyledButton;
