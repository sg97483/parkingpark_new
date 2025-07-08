import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import React, {memo, useMemo} from 'react';
import {widthScale1} from '~styles/scaling-utils';
import {colors} from '~styles/colors';

interface Props {
  type?: 'START' | 'STOPOVER' | 'ARRIVE';
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
  transparent?: boolean;
}

const Point: React.FC<Props> = memo(props => {
  const {type = 'START', onLayout, transparent = false} = props;

  const backgroundColorValue = useMemo((): string => {
    switch (type) {
      case 'START':
        return colors.white;

      case 'STOPOVER':
        return colors.lineInput;

      case 'ARRIVE':
        return colors.heavyGray;

      default:
        return '';
    }
  }, [type]);

  const borderColorValue = useMemo((): string => {
    switch (type) {
      case 'START':
        return colors.heavyGray;

      case 'STOPOVER':
        return colors.lineInput;

      case 'ARRIVE':
        return colors.heavyGray;

      default:
        return '';
    }
  }, [type]);

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.containerStyle,
        {
          backgroundColor: transparent ? colors.transparent : backgroundColorValue,
          borderColor: transparent ? colors.transparent : borderColorValue,
        },
      ]}
    />
  );
});

export default Point;

const styles = StyleSheet.create({
  containerStyle: {
    width: widthScale1(9),
    height: widthScale1(9),
    borderRadius: 999,
    borderWidth: 1,
    borderCurve: 'continuous',
  },
});
