import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {ICONS} from '~/assets/images-path';
import {widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';

interface Props {
  isFocus?: boolean;
  text?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  radioStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
}
const RadioButton = ({
  isFocus = false,
  text = '',
  onPress,
  style,
  radioStyle,
  textStyle,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.view, style]}>
      <Image
        style={[styles.image, {tintColor: isFocus ? colors.red : colors.gray}, radioStyle]}
        source={isFocus ? ICONS.radio_button_yes : ICONS.radio_button_no}
      />
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  image: {
    width: widthScale(20),
    height: widthScale(20),
    marginRight: widthScale(7),
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
