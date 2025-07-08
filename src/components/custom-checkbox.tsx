import React, {memo} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {widthScale} from '~styles/scaling-utils';
import CustomText from './custom-text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  text: string;
  onPress: () => void;
  isChecked: boolean;
  isDisable?: boolean;
  style?: StyleProp<ViewStyle>;
  colorTextNotCheck?: string;
}
const CustomCheckBox = (props: Props) => {
  const {
    onPress,
    text,
    isChecked,
    isDisable = false,
    style,
    colorTextNotCheck = colors.black,
  } = props;

  return (
    <TouchableOpacity disabled={isDisable} onPress={onPress} style={[styles.view, style]}>
      <View
        style={[
          {
            backgroundColor: isChecked ? colors.redSwitch : colors.white,
            borderWidth: isChecked ? 0 : widthScale(2),
          },
          styles.tick,
        ]}>
        <Icon name="check" size={widthScale(15)} color={colors.white} />
      </View>
      <CustomText
        size={FONT.CAPTION_7}
        forDriveMe
        string={text}
        textStyle={styles.text}
        family={FONT_FAMILY.SEMI_BOLD}
        color={isDisable ? colors.grayText : isChecked ? colors.black : colorTextNotCheck}
      />
    </TouchableOpacity>
  );
};

export default memo(CustomCheckBox);

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center', // 중앙 정렬을 위해 추가
  },
  tick: {
    borderRadius: widthScale(3),
    borderColor: colors.grayCheckBox,
    width: widthScale(20),
    height: widthScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: widthScale(7),
  },
});
