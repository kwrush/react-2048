import styled from 'styled-components';
import { pop, scaleUp } from '../../../utils/animation';

export interface StyledTileValueProps {
  isMerging?: boolean;
  backgroundColor: string;
}

const StyledTileValue = styled.div<StyledTileValueProps>`
  width: 100%;
  height: 100%;
  font-size: inherit;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  border-radius: 3px;
  color: inherit;
  background-color: ${({ backgroundColor }) => backgroundColor};
  animation-name: ${({ isMerging }) => (isMerging ? pop : scaleUp)};
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
`;

export default StyledTileValue;
