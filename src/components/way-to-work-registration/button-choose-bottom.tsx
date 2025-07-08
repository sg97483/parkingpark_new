import React, {memo} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import ChevronDown from '~/assets/svgs/ChevronDown';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  text?: string;
  onPress?: () => void;
  placeholder?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
}
const ButtonChooseBottom = (props: Props) => {
  const {onPress, text, placeholder, borderColor, style} = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.view, {borderColor: borderColor || colors.disableButton}, style]}>
      <CustomText
        color={text ? colors.black : colors.disableButton}
        string={text || placeholder!}
        forDriveMe
      />
      <ChevronDown width={widthScale1(24)} height={widthScale1(24)} />
    </TouchableOpacity>
  );
};

export default memo(ButtonChooseBottom);
const styles = StyleSheet.create({
  view: {
    height: heightScale1(50),
    paddingHorizontal: widthScale1(16),
    borderRadius: scale1(8),
    borderWidth: 1,
    marginTop: heightScale1(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
