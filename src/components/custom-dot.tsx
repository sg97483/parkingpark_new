import React, {memo} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {colors} from '~styles/colors';
import {scale} from '~styles/scaling-utils';

interface CustomDotProps extends ViewProps {
  size?: number;
  color?: string;
}

const CustomDot: React.FC<CustomDotProps> = memo(props => {
  const {size, color, ...rest} = props;
  return (
    <View
      style={StyleSheet.flatten([
        {
          height: size || scale(10),
          backgroundColor: color || colors.primary,
          aspectRatio: 1,
          borderRadius: 99,
        },
        rest.style,
      ])}
    />
  );
});

export default CustomDot;
