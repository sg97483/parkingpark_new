import {debounce} from 'lodash';
import React, {memo, useImperativeHandle, useLayoutEffect, useRef, useState} from 'react';
import {Animated, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import CustomText from '~components/custom-text';
import {width} from '~constants/constant';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import ToastMessageController from './toast-message-controller';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
}

export interface ToastMessageRefs {
  show: (message: string) => void;
}

const ToastMessage = memo(({containerStyle}: Props) => {
  const popAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const toastMessageRef = useRef<ToastMessageRefs>();

  const show = debounce((message: string) => {
    setIsVisible(true);
    setMessage(message);
    popIn();
  }, 200);

  useLayoutEffect(() => {
    ToastMessageController.setToastMessageRef(toastMessageRef);
  }, []);

  useImperativeHandle(toastMessageRef, () => ({
    show: show,
  }));

  const popIn = () => {
    Animated.timing(popAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => popOut());
  };

  const popOut = () => {
    setTimeout(() => {
      Animated.timing(popAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setIsVisible(false);
    }, 2000);
  };

  if (!isVisible) {
    return <></>;
  }

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: popAnim,
        },
        containerStyle,
      ]}>
      <CustomText
        string={message}
        color={colors.white}
        forDriveMe
        textStyle={{
          textAlign: 'center',
        }}
        lineHeight={heightScale1(20)}
      />
    </Animated.View>
  );
});

export default ToastMessage;

const styles = StyleSheet.create({
  toastContainer: {
    minHeight: heightScale1(48),
    width: widthScale1(310),
    backgroundColor: 'rgba(51, 51, 51, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale1(8),
    position: 'absolute',
    left: (width - widthScale1(310)) / 2,
    bottom: heightScale1(160),
    paddingHorizontal: widthScale1(16),
    paddingVertical: heightScale1(14),
  },
});
