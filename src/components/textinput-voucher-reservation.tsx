import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import CustomText from './custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';

interface Props {
  title: string;
  valueInput: string;
  textMoney?: string;
  placeholder?: string;
  editable?: boolean;
  onChangeText: (text: string) => void;
}

const TextInputVoucherReservation = ({
  title,
  valueInput,
  textMoney,
  placeholder,
  editable,
  onChangeText,
}: Props) => {
  return (
    <View style={styles.view}>
      <View
        style={{
          width: widthScale(70),
        }}>
        <CustomText string={title} />
      </View>

      <TextInput
        placeholderTextColor={colors.grayText}
        editable={editable}
        value={valueInput}
        placeholder={placeholder}
        style={styles.textInput}
        keyboardType={'numeric'}
        onChangeText={onChangeText}
      />
      <CustomText
        string={textMoney || ''}
        textStyle={{
          textAlign: 'right',
          width: widthScale(110),
        }}
      />
    </View>
  );
};

export default TextInputVoucherReservation;

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: heightScale(20),
    minHeight: heightScale(50),
  },
  textInput: {
    borderRadius: widthScale(4),
    borderWidth: widthScale(1.5),
    borderColor: colors.gray,
    width: widthScale(170),
    padding: 0,
    paddingLeft: widthScale(6),
    minHeight: heightScale(50),
    color: colors.black,
  },
});
