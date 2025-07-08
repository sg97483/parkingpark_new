import React, {memo} from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import CustomCheckbox from '~components/commons/custom-checkbox';
import {PADDING1} from '~constants/constant';
import {colors} from '~styles/colors';
import {heightScale1, widthScale, widthScale1} from '~styles/scaling-utils';

interface Props {
  text: string;
  isChecked?: boolean;
  onPress?: () => void;
  disable?: boolean;
  style?: StyleProp<ViewStyle>;
}
const CheckboxBorder = (props: Props) => {
  const {isChecked, text, disable, onPress, style} = props;

  return (
    <Pressable
      onPress={onPress}
      disabled={disable}
      style={[
        styles.view,
        {borderColor: isChecked ? colors.redSwitch : colors.grayCheckBox},
        style,
      ]}>
      <CustomCheckbox isChecked={isChecked} onPress={onPress} text={text} disablePressColor />
    </Pressable>
  );
};

export default memo(CheckboxBorder);

const styles = StyleSheet.create({
  view: {
    borderWidth: 1.2,
    paddingVertical: heightScale1(16),
    paddingHorizontal: PADDING1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tick: {
    borderRadius: widthScale(3),
    borderColor: colors.grayCheckBox,
    width: widthScale1(20),
    height: widthScale1(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: widthScale1(7),
  },
});
