import styled, { css } from 'styled-components';
import { scaleUp, pop } from '../../../utils/animation';
import { getTileColor, getTileFontSize } from '../../../utils/common';

export interface StyledTileProps {
  width: number;
  height: number;
  x: number;
  y: number;
  isNew: boolean;
  merging: boolean;
  value: number;
}

const getCommonProps = ({
  width,
  height,
  value,
  isNew,
  merging,
}: StyledTileProps) => css`
  width: ${width}px;
  height: ${height}px;
  font-size: ${getTileFontSize(width, height, value)}px;
  background-color: ${getTileColor(value)};
  animation-name: ${isNew ? scaleUp : merging ? pop : ''};
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
`;

const StyledTile = styled.div<StyledTileProps>`
  position: absolute;
  display: flex;
  font-weight: bold;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.785, 0.115, 0.27, 0.895);
  border-radius: 3px;
  color: white;
  transform: ${({ x, y }) => `translate(${x}px,${y}px)`};
  ${getCommonProps}
`;

export default StyledTile;
