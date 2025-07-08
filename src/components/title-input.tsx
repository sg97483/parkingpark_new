import React from 'react';
import {StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle} from 'react-native';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import CustomText from './custom-text';

interface Props {
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  placeholderTextColor?: string;
  isPass?: boolean;
}
const TitleInput = ({
  title,
  placeholder,
  onChangeText,
  value,
  style,
  inputStyle,
  titleStyle,
  placeholderTextColor,
  isPass,
}: Props) => {
  return (
    <View style={[styles.view, style]}>
      <CustomText string={title} family={FONT_FAMILY.REGULAR} textStyle={titleStyle} />
      <TextInput
        secureTextEntry={isPass}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
      />
    </View>
  );
};

export default TitleInput;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: heightScale(50),
    width: widthScale(250),
    padding: 0,
    textAlign: 'right',
    marginLeft: widthScale(10),
    paddingRight: widthScale(5),
    borderBottomColor: colors.black,
    borderBottomWidth: widthScale(1),
  },
});
