import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import {TextInput} from 'react-native-gesture-handler';
import {FONT_FAMILY} from '~constants/enum';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {PADDING} from '~constants/constant';

interface Props {
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  isNumPad?: boolean;
}

const MenuInput: React.FC<Props> = memo(props => {
  const {onChangeText, placeholder, title, value, isNumPad = false} = props;

  return (
    <HStack style={styles.container}>
      <CustomText string={title} family={FONT_FAMILY.SEMI_BOLD} textStyle={styles.titleWrapper} />
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          keyboardType={isNumPad ? 'number-pad' : undefined}
          placeholderTextColor={colors.grayText}
        />
      </View>
    </HStack>
  );
});

export default MenuInput;

const styles = StyleSheet.create({
  container: {
    marginLeft: PADDING,
    minHeight: heightScale(50),
  },
  titleWrapper: {
    minWidth: widthScale(120),
  },
  inputWrapper: {
    flex: 1,
    borderBottomWidth: widthScale(0.5),
    borderBottomColor: colors.darkGray,
  },
  input: {
    textAlign: 'right',
    fontSize: 14,
    fontFamily: FONT_FAMILY.REGULAR,
    flex: 1,
  },
});
