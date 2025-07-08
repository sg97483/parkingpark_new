import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {memo} from 'react';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import CustomText from './custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';

interface Props {
  title: string;
  placeholder?: string;
  value: string;
  onChangeText?: (value: string) => void;
  inputStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  keyBoardType?: KeyboardTypeOptions;
  contentMenuHidden?: boolean;
  length?: number;
  textInputStyle?: StyleProp<TextStyle>;
}

const CustomInput: React.FC<Props> = memo(props => {
  const {
    onChangeText,
    disabled,
    placeholder,
    title,
    value,
    inputStyle,
    keyBoardType,
    contentMenuHidden,
    length,
    textInputStyle,
  } = props;

  return (
    <View style={inputStyle}>
      <CustomText
        string={title}
        family={FONT_FAMILY.REGULAR}
        color={colors.black}
        size={FONT.CAPTION_6}
        style={{paddingBottom: heightScale1(10)}}
      />
      <TextInput
        style={[
          styles.textInput,
          value?.length > 0 ? {borderColor: colors.black} : {borderColor: colors.disableButton},
          textInputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.disableButton}
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyBoardType}
        contextMenuHidden={contentMenuHidden}
        maxLength={length}
      />
    </View>
  );
});

export default CustomInput;

const styles = StyleSheet.create({
  title: {},
  textInput: {
    paddingHorizontal: widthScale1(16),
    // paddingTop: heightScale1(15),
    // paddingBottom: heightScale1(13),
    borderWidth: 1,
    borderRadius: widthScale1(8),
    height: heightScale1(48),
  },
});
