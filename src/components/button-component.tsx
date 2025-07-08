import {Image, ImageSourcePropType, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {widthScale} from '~styles/scaling-utils';

const ButtonComnponent = ({
  icon,
  onPress,
}: {
  icon: ImageSourcePropType | undefined;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={icon} resizeMode="contain" style={styles.img} />
    </TouchableOpacity>
  );
};

export default ButtonComnponent;

const styles = StyleSheet.create({
  img: {
    width: widthScale(27),
    height: widthScale(27),
  },
});
