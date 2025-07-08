import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import CustomText from './custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {FONT, FONT_FAMILY} from '~constants/enum';

interface Props {
  title: string;
  content: string;
  style?: ViewStyle;
  onPress: () => void;
}

const ButtonCardReservation: React.FC<Props> = memo(props => {
  const {content, title, style, onPress} = props;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.view, style]}>
      <CustomText string={title} size={FONT.CAPTION} family={FONT_FAMILY.BOLD} />
      <CustomText string={content} size={FONT.CAPTION} family={FONT_FAMILY.BOLD} />
    </TouchableOpacity>
  );
});

export default ButtonCardReservation;

const styles = StyleSheet.create({
  view: {
    borderRadius: widthScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(15),
    backgroundColor: colors.card,
  },
});
