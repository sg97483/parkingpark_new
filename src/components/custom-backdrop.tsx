import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import React, {memo, useEffect, useMemo} from 'react';
import {BackHandler, StatusBar} from 'react-native';
import Animated, {Extrapolate, interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {colors} from '~styles/colors';

interface Props {
  onPressBackdrop?: () => void;
  transparentBackdrop?: boolean;
}

const CustomBackdrop = (props: Props & BottomSheetBackdropProps) => {
  const {animatedIndex, style, onPressBackdrop, transparentBackdrop} = props;

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolate.CLAMP),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {backgroundColor: transparentBackdrop ? colors.transparent : colors.modal},
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle],
  );

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onPressBackdrop && onPressBackdrop();
      return true;
    });
    return () => sub.remove();
  }, []);

  return (
    <>
      {!transparentBackdrop && (
        <StatusBar backgroundColor={colors.modalStatusBar} barStyle={'dark-content'} />
      )}
      <Animated.View onTouchEnd={onPressBackdrop} style={containerStyle} />
    </>
  );
};

export default memo(CustomBackdrop);
