import {StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {LegacyRef} from 'react';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
interface Props {
  title: string;
  onPress?: () => void;
  isTextInput?: boolean;
  onChangeText?: (text: string) => void;
  refTextInput?: LegacyRef<TextInput>;
}
const SquareButton = ({title, onPress, isTextInput, onChangeText, refTextInput}: Props) => {
  return (
    <TouchableOpacity disabled={isTextInput} onPress={onPress} style={styles.view}>
      {isTextInput ? (
        <TextInput
          keyboardType={'numeric'}
          onBlur={() => {}}
          ref={refTextInput}
          style={[styles.title, {padding: 0}]}
          value={title}
          onChangeText={onChangeText}
        />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default SquareButton;

const styles = StyleSheet.create({
  title: {
    color: colors.black,
    fontSize: widthScale(30),
    textAlign: 'center',
  },
  view: {
    borderRadius: widthScale(5),
    borderWidth: widthScale(1),
    width: widthScale(70),
    height: heightScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray,
  },
});
