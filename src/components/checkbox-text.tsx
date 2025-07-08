import React from 'react';
import {StyleProp, StyleSheet, TextStyle, TouchableOpacity} from 'react-native';
import Checkbox from './checkbox';
import {colors} from '~styles/colors';
import {widthScale} from '~styles/scaling-utils';
import CustomText from './custom-text';
import {FONT_FAMILY} from '~constants/enum';

interface Props {
  text: string;
  onPress: () => void;
  isChecked: boolean;
  textStyle_?: StyleProp<TextStyle>;
  size?: any;
  family?: any;
  isBold?: boolean;
}

const CheckboxText = ({text, onPress, isChecked, textStyle_, isBold, ...rest}: Props) => {
  return (
    <TouchableOpacity style={styles.view} onPress={onPress}>
      <Checkbox
        onPress={onPress}
        isChecked={isChecked}
        checkBackground={isChecked ? colors.red : undefined}
        checkedColor={colors.white}
      />
      <CustomText
        family={isBold ? FONT_FAMILY.BOLD : undefined}
        {...rest}
        textStyle={[styles.text, textStyle_]}
        string={text}
      />
    </TouchableOpacity>
  );
};

export default CheckboxText;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: widthScale(10),
  },
});
