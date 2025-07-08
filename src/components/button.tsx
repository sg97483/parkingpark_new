import React, {ReactNode, memo} from 'react';
import {StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from './custom-text';

interface Props {
  color?: string;
  style?: StyleProp<ViewStyle>;
  text: string;
  onPress: () => void;
  borderColor?: string;
  textColor?: string;
  disable?: boolean;
  iconContent?: ReactNode;
  textStyle?: StyleProp<TextStyle>;
  forDriveMeText?: boolean;
}

const Button: React.FC<Props> = memo(props => {
  const {
    onPress,
    text,
    color = colors.primary,
    borderColor = colors.primary,
    style,
    textColor = colors.white,
    disable,
    iconContent,
    textStyle,
    forDriveMeText,
  } = props;
  return (
    <TouchableOpacity
      disabled={disable}
      style={[
        styles.container,
        {
          backgroundColor: disable ? colors.gray : color,
          borderColor: disable ? colors.gray : borderColor,
        },
        style,
      ]}
      onPress={onPress}>
      {iconContent || null}
      <CustomText
        forDriveMe={forDriveMeText}
        string={text}
        size={FONT.CAPTION_7}
        family={FONT_FAMILY.SEMI_BOLD}
        color={textColor}
        textStyle={textStyle}
      />
    </TouchableOpacity>
  );
});

export default Button;

const styles = StyleSheet.create({
  container: {
    minHeight: heightScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: widthScale(1),
  },
});
