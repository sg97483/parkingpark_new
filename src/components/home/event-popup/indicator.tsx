import React, {memo, useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const Indicator = ({currentIndex, index}: {currentIndex: number; index: number}) => {
  const widthAnim = useRef(new Animated.Value(widthScale1(7))).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: currentIndex === index ? widthScale1(20) : widthScale1(7),
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, index]);

  return (
    <Animated.View
      key={index}
      style={[
        styles.indicatorStyle,
        {
          width: widthAnim,
          backgroundColor: currentIndex === index ? colors.white : colors.white40,
        },
      ]}
    />
  );
};

export default memo(Indicator);

const styles = StyleSheet.create({
  indicatorStyle: {
    height: heightScale1(7),
    minWidth: widthScale1(7),
    borderRadius: 999,
  },
});
