import {Image, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import React from 'react';
import {ICONS} from '~/assets/images-path';
import {widthScale} from '~styles/scaling-utils';
import CustomText from './custom-text';
import {colors} from '~styles/colors';

interface Props {
  text: string;
  style?: ViewStyle;
  onPress: () => void;
  isChecked: boolean;
}

const ButtonPolicy = ({text, style, onPress, isChecked}: Props) => {
  return (
    <TouchableOpacity style={[styles.view, style]} onPress={onPress}>
      <View style={styles.viewText}>
        <Image
          source={ICONS.btn_gray_unchecked}
          style={[styles.icon, {tintColor: isChecked ? colors.redButton : undefined}]}
          resizeMode={'contain'}
        />
        <CustomText string={text} />
      </View>
      <Image source={ICONS.btn_next_arrow_gray} style={styles.icon} resizeMode={'contain'} />
    </TouchableOpacity>
  );
};

export default ButtonPolicy;

const styles = StyleSheet.create({
  viewText: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: widthScale(15),
  },
  icon: {
    width: widthScale(20),
    height: widthScale(20),
    marginRight: widthScale(20),
    marginLeft: widthScale(30),
  },
});
