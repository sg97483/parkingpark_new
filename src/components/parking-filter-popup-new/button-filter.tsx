import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import CustomText from '~components/custom-text';
import {FONT_FAMILY, FONT} from '~constants/enum';
import {widthScale, heightScale} from '~styles/scaling-utils';

interface Props {
  color: string;
  icon?: React.ReactElement;
  onPress: () => void;
  colorText: string;
  text: string;
  style?: ViewStyle;
  borderColor?: string; // borderColor 추가
}

const ButtonFilter = ({
  color,
  icon,
  onPress,
  colorText,
  text,
  style,
  borderColor, // borderColor 추가
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={[
        styles.view,
        style,
        {
          backgroundColor: color,
          borderColor: borderColor || 'transparent', // borderColor 적용
          borderWidth: borderColor ? 1 : 0, // 테두리 두께 추가
        },
      ]}>
      {icon}
      <CustomText string={text} color={colorText} family={FONT_FAMILY.BOLD} size={FONT.BODY} />
    </TouchableOpacity>
  );
};

export default memo(ButtonFilter);

const styles = StyleSheet.create({
  view: {
    width: widthScale(120),
    height: heightScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: widthScale(8),
  },
});
