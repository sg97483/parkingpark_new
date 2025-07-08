import {Image, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import CustomText from './custom-text';
import {ICONS} from '~/assets/images-path';
import {widthScale} from '~styles/scaling-utils';
import {FONT_FAMILY} from '~constants/enum';

interface Props {
  text: string;
  isChecked: boolean;
  style?: ViewStyle;
  onPress: () => void;
}
const ButtonAccept = ({text, isChecked, style, onPress}: Props) => {
  return (
    <TouchableOpacity style={[styles.view, style]} onPress={onPress}>
      <Image
        style={styles.icon}
        source={isChecked ? ICONS.btn_round_checked : ICONS.btn_round_unchecked}
      />
      <CustomText string={text} family={FONT_FAMILY.SEMI_BOLD} />
    </TouchableOpacity>
  );
};

export default memo(ButtonAccept);

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: widthScale(20),
    height: widthScale(20),
    marginRight: widthScale(10),
  },
});
