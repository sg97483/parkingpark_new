import {Image, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import {ICONS} from '~/assets/images-path';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from './custom-text';
import {FONT} from '~constants/enum';
import {colors} from '~styles/colors';

interface Props {
  isChecked: boolean;
  style?: ViewStyle;
  text: string;
  onPress: () => void;
}

const ButtonAgree = ({isChecked, style, text, onPress}: Props) => {
  return (
    <TouchableOpacity style={[styles.view, style]} onPress={onPress}>
      <Image
        source={isChecked ? ICONS.btn_round_checked : ICONS.btn_round_unchecked}
        style={styles.icon}
        resizeMode={'contain'}
      />
      <CustomText string={text} size={FONT.SUB_HEAD} />
    </TouchableOpacity>
  );
};

export default memo(ButtonAgree);

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: widthScale(10),
    borderWidth: widthScale(1),
    padding: widthScale(10),
    borderColor: colors.redButton,
    paddingVertical: heightScale(20),
  },
  icon: {
    width: widthScale(30),
    height: widthScale(30),
    marginRight: widthScale(15),
  },
});
