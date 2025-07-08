import {KeyboardTypeOptions, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {memo, useMemo} from 'react';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {formatNumber} from '~utils/index';

interface Props {
  onPress?: () => void;
  value: string | number;
  onChangeText?: ((text: string) => void) | undefined;
  title: string;
  placeholder?: string;
  isFormatNumber?: boolean;
  inputType?: KeyboardTypeOptions;
}
const TitleTextInput = ({
  onPress,
  placeholder,
  value,
  title,
  onChangeText,
  isFormatNumber,
  inputType,
}: Props) => {
  const newValue = useMemo(
    () => (value ? (isFormatNumber ? formatNumber(value.toString()) : value.toString()) : ''),
    [value],
  );

  return (
    <View style={styles.view}>
      <CustomText string={title} textStyle={styles.title} color={colors.black} />
      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.input}>
          <CustomText
            string={isFormatNumber ? newValue : (value || placeholder!).toString()}
            color={value ? colors.black : colors.gray}
          />
        </TouchableOpacity>
      ) : (
        <TextInput
          keyboardType={inputType || isFormatNumber ? 'numeric' : undefined}
          onChangeText={onChangeText}
          placeholder={placeholder}
          style={styles.input}
          value={newValue}
          placeholderTextColor={colors.grayText}
        />
      )}
    </View>
  );
};

export default memo(TitleTextInput);

const styles = StyleSheet.create({
  view: {
    marginHorizontal: widthScale(10),
    marginTop: heightScale(20),
  },
  input: {
    borderColor: colors.gray,
    borderWidth: widthScale(1),
    height: heightScale(55),
    justifyContent: 'center',
    paddingLeft: widthScale(5),
  },
  title: {
    marginBottom: heightScale(5),
  },
});
