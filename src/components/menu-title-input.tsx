import {KeyboardTypeOptions, StyleSheet, TextInput, View} from 'react-native';
import React, {memo} from 'react';
import HStack from './h-stack';
import CustomText from './custom-text';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {FONT_FAMILY} from '~constants/enum';

interface Props {
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
}

const MenuTitleInput: React.FC<Props> = memo(props => {
  const {onChangeText, placeholder, title, value, keyboardType = 'default'} = props;

  return (
    <HStack>
      <CustomText
        string={title}
        family={FONT_FAMILY.BOLD}
        textStyle={styles.titleText}
        numberOfLines={1}
      />
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          style={styles.input}
          placeholderTextColor={colors.grayText}
        />
      </View>
    </HStack>
  );
});

export default MenuTitleInput;

const styles = StyleSheet.create({
  inputWrapper: {
    flex: 1,
    borderBottomWidth: widthScale(1),
    minHeight: heightScale(45),
    borderBottomColor: colors.gray,
  },
  titleText: {
    width: widthScale(80),
    marginRight: widthScale(10),
  },
  input: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: 14,
    flex: 1,
  },
});
