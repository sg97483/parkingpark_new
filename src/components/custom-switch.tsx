import {StyleSheet, Animated, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import {widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
interface Props {
  onPress?: () => void;
  isOn: boolean;
  isDisable?: boolean;
}

const CustomSwitch = ({onPress, isOn, isDisable = false}: Props) => {
  const thumbPosition = React.useRef(new Animated.Value(widthScale(2))).current;

  useEffect(() => {
    handleSwitch(isOn);
  }, [isOn]);

  const handleSwitch = (isCheck: boolean) => {
    const toValue = isCheck ? widthScale(26) : widthScale(2);
    Animated.timing(thumbPosition, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisable}
      style={[{backgroundColor: isOn ? colors.redSwitch : colors.grayWhite2}, styles.view]}>
      <Animated.View
        style={[{transform: [{translateX: thumbPosition}]}, styles.shadowColor, styles.viewBorder]}
      />
    </Pressable>
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({
  view: {
    width: widthScale(54),
    borderRadius: widthScale(20),
    height: widthScale(30),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  viewBorder: {
    backgroundColor: 'white',
    width: widthScale(26),
    height: widthScale(26),
    borderRadius: widthScale(100),
  },
  shadowColor: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
  },
});
