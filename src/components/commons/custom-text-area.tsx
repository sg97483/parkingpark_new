import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {Pressable, StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface Props extends TextInputProps {
  title: string;
  value: string;
  errorMessage?: boolean;
  disabled?: boolean;
  maxLength?: number;
}

const CustomTextArea: React.FC<Props> = memo(props => {
  const {title = '', value = '', errorMessage, disabled, maxLength = 50, ...rest} = props;

  const inputRef = useRef<TextInput>(null);

  const [isPressIn, setIsPressIn] = useState<boolean>(false);

  const handleFocusInput = useCallback(() => {
    setIsPressIn(true);
  }, []);

  const onBlurInput = useCallback(() => {
    setIsPressIn(false);
  }, []);

  const borderColorValue = useMemo((): string => {
    if (isPressIn) {
      return colors.menuTextColor;
    } else {
      return colors.disableButton;
    }
  }, [isPressIn]);

  return (
    <View>
      {title?.length > 0 ? (
        <CustomText
          forDriveMe
          family={FONT_FAMILY.MEDIUM}
          string={title}
          color={colors.black}
          lineHeight={heightScale1(20)}
        />
      ) : null}

      <Pressable
        onPress={() => {
          inputRef.current?.focus();
        }}
        style={[
          styles.inputWrapperStyle,
          {
            borderColor: borderColorValue,
            backgroundColor: disabled ? colors.policy : colors.white,
          },
        ]}>
        <TextInput
          ref={inputRef}
          onBlur={onBlurInput}
          onFocus={handleFocusInput}
          multiline
          maxLength={maxLength}
          style={styles.inputStyle}
          placeholder={colors.disableButton}
          editable={!disabled}
          value={value}
          placeholderTextColor={colors.disableButton}
          {...rest}
        />
      </Pressable>

      <HStack style={styles.footerStyle}>
        {errorMessage && (
          <HStack style={{flexShrink: 1, gap: widthScale1(4)}}>
            <Icons.WarningCircle />
            <CustomText
              string="에러메세지"
              color={colors.rejectText}
              forDriveMe
              size={FONT.CAPTION}
              family={FONT_FAMILY.MEDIUM}
              textStyle={{flex: 1}}
              numberOfLines={1}
            />
          </HStack>
        )}

        <CustomText
          color={isPressIn ? colors.grayText2 : colors.disableButton}
          forDriveMe
          family={FONT_FAMILY.MEDIUM}
          string={`${value?.length || 0}/${maxLength}`}
          textStyle={{
            marginLeft: 'auto',
          }}
          lineHeight={heightScale1(20)}
        />
      </HStack>
    </View>
  );
});

export default CustomTextArea;

const styles = StyleSheet.create({
  inputWrapperStyle: {
    minHeight: heightScale1(110),
    borderWidth: 1,
    borderRadius: scale1(8),
    marginTop: heightScale1(10),
    marginBottom: heightScale1(4),
    paddingVertical: heightScale1(14),
    paddingHorizontal: widthScale1(16),
  },
  inputStyle: {
    fontSize: fontSize1(14),
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.menuTextColor,
    padding: 0,
    flex: 1,
    textAlignVertical: 'top',
    maxHeight: heightScale1(220),
  },
  footerStyle: {
    justifyContent: 'space-between',
    gap: widthScale1(8),
  },
});
