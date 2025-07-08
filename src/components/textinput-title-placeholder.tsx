import {KeyboardTypeOptions, StyleSheet, TextInput, TextProps, View} from 'react-native';
import React, {memo} from 'react';
import CustomText from './custom-text';
import {colors} from '~styles/colors';
import {heightScale} from '~styles/scaling-utils';
import {IS_ANDROID} from '~constants/constant';
interface Props {
  title: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
}
const TextInputTitlePlaceholder = ({
  title,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
}: Props & TextProps) => {
  return (
    <View style={styles.view}>
      <CustomText string={title} color={colors.grayText} />
      <TextInput
        onChangeText={onChangeText}
        numberOfLines={1}
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.grayText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default memo(TextInputTitlePlaceholder);
const styles = StyleSheet.create({
  view: {
    borderBottomColor: colors.grayText,
    borderBottomWidth: 0.6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: heightScale(IS_ANDROID ? 60 : 55),
  },
  input: {
    textAlign: 'right',
    width: '75%',
    height: '100%',
  },
});
