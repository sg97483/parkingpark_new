import React, {memo} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {widthScale} from '~styles/scaling-utils';

interface Props {
  isFocus: boolean;
  text: string;
  price: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}
const CustomRadioButton = (props: Props) => {
  const {isFocus, text, price, style, onPress} = props;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress} style={styles.view}>
        {isFocus ? <Icons.Radio /> : <Icons.RadioNoCheck />}
        <CustomText
          size={FONT.CAPTION_7}
          color={isFocus ? colors.black : colors.grayText}
          textStyle={styles.text}
          string={text}
          family={FONT_FAMILY.SEMI_BOLD}
        />
      </TouchableOpacity>
      <CustomText
        size={FONT.CAPTION_7}
        color={isFocus ? colors.black : colors.grayText}
        textStyle={styles.text}
        string={price}
        family={FONT_FAMILY.SEMI_BOLD}
      />
    </View>
  );
};

export default memo(CustomRadioButton);
const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    marginLeft: widthScale(5),
  },
});
