import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '~styles/colors';
import {heightScale, heightScale1} from '~styles/scaling-utils';

interface Props {
  style?: StyleProp<ViewStyle>;
  darkLine?: boolean;
  insetsVertical?: number;
}

const Divider: React.FC<Props> = memo(props => {
  const {style, darkLine = false, insetsVertical = 0} = props;
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: darkLine ? colors.darkGray : colors.policy,
          marginVertical: insetsVertical ? heightScale1(insetsVertical) : undefined,
        },
        style,
      ]}
    />
  );
});

export default Divider;

const styles = StyleSheet.create({
  container: {
    height: heightScale(1),
    width: '100%',
  },
});
