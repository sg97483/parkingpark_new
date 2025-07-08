import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';

interface Props {
  text: string;
  colorText?: string;
}
const TextBorder = ({text, colorText}: Props) => {
  return (
    <View style={styles.view}>
      <Text style={[styles.text, {color: colorText || colors.grayText}]}>{text}</Text>
    </View>
  );
};

export default TextBorder;

const styles = StyleSheet.create({
  view: {
    padding: widthScale(3),
    paddingHorizontal: widthScale(10),
    borderRadius: widthScale(5),
    borderColor: colors.darkGray,
    borderWidth: widthScale(1),
    marginHorizontal: widthScale(10),
    paddingVertical: heightScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: widthScale(14),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
