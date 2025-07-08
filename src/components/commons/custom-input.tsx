import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Pressable, StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import MaskInput, {Mask} from 'react-native-mask-input';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface CustomInputProps extends TextInputProps {
  title?: string;
  subTitle?: string;
  errorText?: string;
  successText?: string;
  value: string;
  onChangeText?: (text: string) => void;
  isBottomSheet?: boolean;
  mask?: Mask | undefined;
}

export interface CustomInputRefs {
  focusInput: () => void;
}

const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const {
    title,
    subTitle,
    errorText,
    successText,
    onChangeText,
    value,
    style,
    isBottomSheet,
    mask,
    ...rest
  } = props;
  const inputRef = useRef<TextInput>(null);

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const focusInput = useCallback(() => {
    inputRef?.current?.focus();
  }, []);

  useImperativeHandle(ref, () => ({focusInput}), []);

  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  const onClearText = () => {
    onChangeText && onChangeText('');
  };

  const borderColor = useMemo(() => {
    if (errorText) {
      return colors.rejectText;
    }
    if (successText) {
      return colors.success;
    }
    if (isFocused) {
      return colors.menuTextColor;
    }
    return colors.disableButton;
  }, [isFocused, successText, errorText]);

  const backgroundColor = useMemo(() => {
    if (rest?.editable === false) {
      return colors.policy;
    }
    return colors.white;
  }, [rest?.editable]);

  return (
    <View style={[{gap: heightScale1(10), flex: 1}, style]}>
      <View style={{gap: heightScale1(4)}}>
        {title ? (
          <CustomText
            string={title}
            family={FONT_FAMILY.MEDIUM}
            color={colors.black}
            lineHeight={fontSize1(20)}
            forDriveMe
          />
        ) : null}
        {subTitle ? (
          <CustomText
            string={subTitle}
            family={FONT_FAMILY.REGULAR}
            color={colors.lineCancel}
            lineHeight={fontSize1(20)}
            forDriveMe
          />
        ) : null}
      </View>

      <Pressable
        onPress={() => {
          rest.editable && inputRef.current?.focus();
        }}
        style={{gap: heightScale1(6)}}>
        <HStack
          style={[
            styles.inputContainer,
            {borderColor: borderColor, backgroundColor: backgroundColor},
          ]}>
          {isBottomSheet ? (
            <BottomSheetTextInput
              ref={inputRef as any}
              style={styles.input}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholderTextColor={colors.disableButton}
              onChangeText={onChangeText}
              value={value}
              {...rest}
            />
          ) : mask ? (
            <MaskInput
              ref={inputRef as any}
              style={styles.input}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholderTextColor={colors.disableButton}
              onChangeText={(masked, unmasked) => {
                onChangeText && onChangeText(unmasked);
              }}
              value={value}
              mask={mask}
              {...rest}
            />
          ) : (
            <TextInput
              ref={inputRef}
              style={styles.input}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholderTextColor={colors.disableButton}
              onChangeText={onChangeText}
              value={value}
              {...rest}
            />
          )}

          {isFocused && value ? (
            <Pressable onPress={onClearText} hitSlop={16}>
              <Icons.CancelCircle />
            </Pressable>
          ) : null}
        </HStack>
        {errorText ? (
          <HStack style={{gap: widthScale1(4)}}>
            <Icons.WarningCircle />
            <CustomText
              string={errorText}
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION}
              color={colors.rejectText}
              lineHeight={fontSize1(18)}
            />
          </HStack>
        ) : null}
        {successText && !errorText ? (
          <HStack style={{gap: widthScale1(4)}}>
            <Icons.Tick />
            <CustomText
              string={successText}
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION}
              color={colors.success}
              lineHeight={fontSize1(18)}
            />
          </HStack>
        ) : null}
      </Pressable>
    </View>
  );
});

export default CustomInput;

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: scale1(1),
    borderRadius: scale1(8),
    paddingHorizontal: widthScale1(16),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: widthScale1(10),
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.menuTextColor,
    minHeight: heightScale1(48),
  },
});
