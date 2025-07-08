import React, {memo, useRef} from 'react';
import {Pressable, StyleSheet, TextInput, TextInputProps} from 'react-native';
import Search from '~/assets/svgs/Search';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface Props extends TextInputProps {
  onPress?: () => void;
}

const CustomSearchInput: React.FC<Props> = memo(props => {
  const {onPress, ...rest} = props;

  const inputRef = useRef<TextInput>(null);

  return (
    <Pressable
      style={styles.inputContainer}
      onPress={() => {
        if (onPress) {
          onPress();
        }
        inputRef.current?.focus();
      }}>
      <Search />
      <TextInput
        ref={inputRef}
        style={styles.inputStyle}
        placeholderTextColor={colors.lineCancel}
        {...rest}
      />
    </Pressable>
  );
});

export default CustomSearchInput;

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: widthScale1(16),
    backgroundColor: colors.policy,
    borderRadius: widthScale1(8),
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: heightScale1(48),
  },
  inputStyle: {
    flex: 1,
    marginLeft: widthScale1(10),
    fontSize: fontSize1(15),
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.menuTextColor,
  },
});
