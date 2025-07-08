import React, {memo} from 'react';
import {StyleProp, StyleSheet, TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, heightScale1, scale, widthScale} from '~styles/scaling-utils';

interface Props {
  title: string;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  colorPlaceholder?: string;
  value?: string;
  onChangeText?: (_: string) => void;
}
const TextInputTitle = (props: Props) => {
  const {placeholder, title, style, onPress, colorPlaceholder, onChangeText, value} = props;

  return (
    <View style={style}>
      <CustomText size={FONT.CAPTION_6} string={title} />
      {onPress ? (
        <TouchableOpacity
          onPress={onPress}
          style={[styles.button, value ? {borderColor: colors.menuTextColor} : {}]}>
          <CustomText
            color={colorPlaceholder || colors.grayText}
            size={FONT.CAPTION_6}
            string={placeholder}
          />
          <Icons.Bottom />
        </TouchableOpacity>
      ) : (
        <TextInput
          onChangeText={onChangeText}
          value={value}
          placeholderTextColor={colors.grayText}
          style={[styles.input, value ? {borderColor: colors.menuTextColor} : {}]}
          placeholder={placeholder}
        />
      )}
    </View>
  );
};

export default memo(TextInputTitle);
const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    borderColor: '#C1C1C1',
    borderWidth: 1.1,
    padding: 0,
    height: heightScale1(48),
    paddingHorizontal: widthScale(16),
    marginTop: heightScale(10),
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: scale(14),
  },
  button: {
    borderRadius: 8,
    borderColor: '#C1C1C1',
    borderWidth: 1.1,
    height: heightScale1(48),
    paddingHorizontal: widthScale(16),
    marginTop: heightScale(10),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
