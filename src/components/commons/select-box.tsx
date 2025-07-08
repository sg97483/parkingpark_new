import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TextInput,
  InteractionManager,
  Keyboard,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import HStack from '~components/h-stack';
import {Icons} from '~/assets/svgs';
import {fontSize1} from '~styles/typography';

interface Props {
  title: string;
  subTitle?: string;
  onPress?: () => void;
  placeholderText?: string;
  value?: string;
  errorMessage?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  isEdit?: boolean;
  onChangeText?: (text: string) => void;
}

const SelectBox: React.FC<Props> = memo(props => {
  const {
    title,
    containerStyle,
    onPress,
    subTitle,
    placeholderText = '',
    value,
    errorMessage,
    disabled,
    isEdit,
    onChangeText,
  } = props;

  const [pressIn, setPressIn] = useState<boolean>(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (isEdit) {
        inputRef.current?.focus();
      }
    });
  }, [isEdit]);

  const handlePressIn = useCallback(() => {
    setPressIn(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setPressIn(false);
    Keyboard.dismiss();
  }, [isEdit]);

  return (
    <View style={[styles.containerStyles, containerStyle]}>
      <View style={styles.titleWrapperStyle}>
        <CustomText
          lineHeight={heightScale1(20)}
          color={colors.black}
          string={title}
          forDriveMe
          family={FONT_FAMILY.MEDIUM}
        />
        {subTitle && (
          <CustomText
            lineHeight={heightScale1(20)}
            string={subTitle}
            forDriveMe
            color={colors.lineCancel}
          />
        )}
      </View>

      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressOut={handlePressOut}
        onPressIn={handlePressIn}>
        <HStack
          style={[
            styles.boxStyle,
            {
              borderColor: errorMessage
                ? colors.primary
                : pressIn
                  ? colors.menuTextColor
                  : colors.disableButton,
              backgroundColor: disabled ? colors.policy : colors.white,
            },
          ]}>
          {isEdit ? (
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              numberOfLines={1}
              style={styles.textInput}
              placeholderTextColor={colors.disableButton}
              placeholder={placeholderText}
              allowFontScaling={false}
            />
          ) : (
            <CustomText
              forDriveMe
              numberOfLines={1}
              textStyle={{flex: 1}}
              string={value ? value : placeholderText}
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_6}
              color={!value ? colors.disableButton : colors.menuTextColor}
            />
          )}

          <Icons.ChevronDown
            width={24}
            height={24}
            stroke={errorMessage ? colors.primary : colors.menuTextColor}
          />
        </HStack>

        {errorMessage && (
          <HStack style={styles.errorStyle}>
            <Icons.WarningCircle />
            <CustomText
              forDriveMe
              size={FONT.CAPTION}
              family={FONT_FAMILY.MEDIUM}
              lineHeight={heightScale1(18)}
              string="에러메세지"
              color={colors.rejectText}
            />
          </HStack>
        )}
      </Pressable>
    </View>
  );
});

export default SelectBox;

const styles = StyleSheet.create({
  containerStyles: {
    gap: heightScale1(10),
  },
  titleWrapperStyle: {
    gap: heightScale1(4),
  },
  boxStyle: {
    height: heightScale1(48),
    borderWidth: 1,
    paddingHorizontal: widthScale1(16),
    paddingVertical: heightScale1(15),
    borderRadius: scale1(8),
    justifyContent: 'space-between',
    gap: widthScale1(10),
  },
  errorStyle: {
    gap: widthScale1(4),
    marginTop: heightScale1(6),
  },
  textInput: {
    color: colors.menuTextColor,
    padding: 0,
    fontFamily: FONT_FAMILY.MEDIUM,
    flex: 1,
    fontSize: fontSize1(14),
    height: heightScale1(48),
  },
});
