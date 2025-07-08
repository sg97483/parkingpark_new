import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {Pressable, StyleProp, StyleSheet, Text, TextInput, ViewStyle} from 'react-native';
import HStack from '~components/h-stack';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  onPressKeyDone: () => void;
}

const PostcodeInsuranceInput: React.FC<Props> = memo(props => {
  const {value, onChange, containerStyle, onPressKeyDone} = props;

  const inputRef = useRef<TextInput>(null);
  const inputRef2 = useRef<TextInput>(null);
  const inputRef3 = useRef<TextInput>(null);

  const [value1, setValue1] = useState<string>(value?.slice(0, 2) || '');
  const [value2, setValue2] = useState<string>(value?.slice(2, 8) || '');
  const [value3, setValue3] = useState<string>(value?.slice(8, 10) || '');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    const text = value1 + value2 + value3;

    onChange(text);
  }, [value, value1, value2, value3]);

  // handle on press
  const onPress = useCallback(() => {
    setIsFocused(true);
    if (value?.length < 2 || !value) {
      inputRef.current?.focus();
    } else if (value?.length >= 2 && value?.length < 8) {
      inputRef2.current?.focus();
    } else if (value?.length >= 8 && value?.length <= 10) {
      inputRef3.current?.focus();
    }
  }, [value]);

  return (
    <Pressable
      style={[
        styles.container,
        containerStyle,
        isFocused ? {borderColor: colors.menuTextColor} : {},
      ]}
      onPress={onPress}>
      <HStack
        pointerEvents="none"
        style={{
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <TextInput
          style={[styles.textInput, {minWidth: widthScale1(18)}]}
          placeholder={value?.length > 0 ? '' : '00'}
          placeholderTextColor={colors.disableButton}
          ref={inputRef}
          value={value1}
          onChangeText={value => {
            setValue1(value);
            if (value?.length === 2) {
              inputRef2.current?.focus();
            }
          }}
          maxLength={2}
          keyboardType="number-pad"
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={onPressKeyDone}
        />
        <Text
          style={[
            value?.length >= 2
              ? styles.activeDash
              : value?.length < 2 && value?.length > 0
                ? {color: colors.white}
                : styles.dash,
            {
              paddingBottom: heightScale1(3),
            },
          ]}>
          -
        </Text>
        <TextInput
          style={[styles.textInput, {minWidth: widthScale1(56)}]}
          ref={inputRef2}
          placeholder={value?.length > 0 ? '' : '000000'}
          placeholderTextColor={colors.disableButton}
          maxLength={6}
          value={value2}
          onChangeText={val => {
            setValue2(val);
            if (val?.length === 6) {
              inputRef3.current?.focus();
            }
          }}
          keyboardType="number-pad"
          onKeyPress={({nativeEvent}) => {
            if (nativeEvent.key === 'Backspace' && value2?.length === 0) {
              inputRef.current?.focus();
              setValue1(value1?.slice(0, 1));
            }
          }}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={onPressKeyDone}
        />
        <Text
          style={[
            value?.length >= 8
              ? styles.activeDash
              : value?.length < 8 && value3?.length === 0 && value?.length > 0
                ? {color: colors.white}
                : styles.dash,
            {
              paddingBottom: heightScale1(3),
            },
          ]}>
          -
        </Text>
        <TextInput
          style={[styles.textInput, {minWidth: widthScale1(18)}]}
          ref={inputRef3}
          placeholder={value?.length > 0 ? '' : '00'}
          placeholderTextColor={colors.disableButton}
          maxLength={2}
          value={value3}
          keyboardType="number-pad"
          onChangeText={val => {
            setValue3(val);
          }}
          onKeyPress={({nativeEvent}) => {
            if (nativeEvent.key === 'Backspace' && value3?.length === 0) {
              inputRef2.current?.focus();
              setValue2(value2?.slice(0, 5));
            }
          }}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={onPressKeyDone}
        />
      </HStack>
    </Pressable>
  );
});

export default PostcodeInsuranceInput;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthScale1(16),

    borderWidth: 1,
    borderColor: colors.disableButton,
    borderRadius: widthScale1(8),
    minHeight: heightScale1(48),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    fontSize: widthScale1(14),
  },

  dash: {
    color: colors.disableButton,
    fontSize: widthScale1(14),
  },
  activeDash: {
    color: colors.black,
    fontSize: widthScale1(14),
  },
  activeText: {
    borderColor: colors.black,
  },
});
