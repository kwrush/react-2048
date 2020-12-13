import React, { FC, useCallback, useEffect, useState } from 'react';
import { Color } from '../../themes/common';
import { StyledInput, StyledKnob, StyledSwitch } from './styled';
import Box from '../Box';
import Text from '../Text';

export interface SwitchProps {
  value: string;
  activeValue: string;
  inactiveValue: string;
  knobColor?: Color;
  activeColor?: Color;
  inactiveColor?: Color;
  title?: string;
  active?: boolean;
  onChange: (newValue: string) => void;
}

const Switch: FC<SwitchProps> = ({
  value,
  activeValue,
  inactiveValue,
  knobColor = 'foreground',
  activeColor = 'background',
  inactiveColor = 'background',
  title,
  active = false,
  onChange,
}) => {
  const [currentValue, setCurrentValue] = useState(
    active ? activeValue : value,
  );

  const handleSwitch = useCallback(() => {
    setCurrentValue((v) => (v === activeValue ? inactiveValue : activeValue));
  }, [activeValue, inactiveValue]);

  useEffect(() => {
    onChange(currentValue);
  }, [currentValue, onChange]);

  return (
    <Box onClick={handleSwitch}>
      {title && (
        <Box marginInlineEnd="s3">
          <Text color="primary" textTransform="capitalize" fontSize={16}>
            {title}
          </Text>
        </Box>
      )}
      <StyledSwitch>
        <StyledInput checked={currentValue === activeValue} />
        <StyledKnob
          active={currentValue === activeValue}
          knobColor={knobColor}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
        />
      </StyledSwitch>
    </Box>
  );
};

export default Switch;
