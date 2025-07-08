import React, {
  forwardRef,
  memo,
  Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import {Pressable, StyleProp, StyleSheet, TextInput, TextInputProps, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import MinusCircle from '~/assets/svgs/MinusCircle';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {WIDTH} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

type InputTypes =
  | 'DEFAULT'
  | 'DELETE_TEXT'
  | 'ADD_BUTTON'
  | 'MINUS_CIRCLE'
  | 'DELETE_AND_MINUS_CIRCLE'
  | 'DELETE_TEXT_AND_ADD_BUTTON';
type BorderColorTypes = 'WHITE' | 'DISABLED' | 'MENU_TEXT_COLOR';

interface Props extends TextInputProps {
  type?: InputTypes;
  value: string;
  disabled?: boolean;
  onChangeText: (value: string) => void;
  borderColorType?: BorderColorTypes;
  style?: StyleProp<ViewStyle>;
  onPressMinus?: () => void;
  onPressAdd?: () => void;
  onPress?: () => void;
  onDeleteText?: () => void;
}

const CustomPositionMainSearch = forwardRef((props: Props, ref: Ref<TextInput>) => {
  const {
    type = 'DELETE_TEXT',
    borderColorType = 'DISABLED',
    value,
    onPressMinus,
    onDeleteText,
    onPressAdd,
    disabled,
    onChangeText,
    onPress,
    style,
    onFocus,
    onBlur,
    onSubmitEditing,
    ...rest
  } = props;

  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => inputRef.current as any, []);

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const borderColor = useMemo((): string => {
    switch (borderColorType) {
      case 'DISABLED':
        return colors.disableButton;
      case 'MENU_TEXT_COLOR':
        return colors.menuTextColor;
      default:
        return '';
    }
  }, [borderColorType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus(); // 입력 필드에 포커스를 설정하여 키보드를 띄웁니다.
      } else {
      }
    }, 300); // 약간의 지연 시간 후에 포커스를 설정 (시간을 300ms 정도로 늘려볼 수 있음)

    return () => clearTimeout(timer); // 타이머 정리
  }, []);

  // handle delete text
  const handleDeleteText = useCallback(() => {
    onChangeText('');
    if (onDeleteText) {
      onDeleteText();
    }
  }, [onChangeText, onDeleteText]);

  const renderIconRight = useCallback(() => {
    switch (type) {
      case 'DELETE_TEXT':
        return (
          <>
            {value?.length > 0 && isFocused ? (
              <Pressable onPress={handleDeleteText} hitSlop={20}>
                <Icons.DeleteText />
              </Pressable>
            ) : null}
          </>
        );
      case 'MINUS_CIRCLE':
        return (
          <Pressable onPress={onPressMinus}>
            <MinusCircle />
          </Pressable>
        );
      case 'ADD_BUTTON':
        return (
          <Pressable onPress={onPressAdd} style={styles.buttonAdd}>
            <Icons.Plus
              width={widthScale1(16)}
              height={heightScale1(16)}
              stroke={colors.lineCancel}
            />
            <CustomText
              string="경유"
              color={colors.lineCancel}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_2}
              lineHeight={fontSize1(15)}
              forDriveMe
            />
          </Pressable>
        );
      case 'DELETE_AND_MINUS_CIRCLE':
        return (
          <HStack style={{gap: widthScale1(5)}}>
            {value?.length > 0 && isFocused ? (
              <Pressable onPress={handleDeleteText} hitSlop={20}>
                <Icons.DeleteText />
              </Pressable>
            ) : null}

            <Pressable onPress={onPressMinus}>
              <MinusCircle />
            </Pressable>
          </HStack>
        );
      case 'DELETE_TEXT_AND_ADD_BUTTON':
        return (
          <HStack style={{gap: widthScale1(5)}}>
            {value?.length > 0 && isFocused ? (
              <Pressable onPress={handleDeleteText} hitSlop={20}>
                <Icons.DeleteText />
              </Pressable>
            ) : null}
            <Pressable onPress={onPressAdd} style={styles.buttonAdd}>
              <Icons.Plus
                width={widthScale1(16)}
                height={heightScale1(16)}
                stroke={colors.lineCancel}
              />
              <CustomText
                string="경유"
                color={colors.lineCancel}
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION_2}
                lineHeight={fontSize1(15)}
                forDriveMe
              />
            </Pressable>
          </HStack>
        );
      default:
        return null;
    }
  }, [type, value, isFocused, handleDeleteText, onPressMinus, onPressAdd]);

  return (
    <Pressable
      style={[
        styles.container,
        {
          borderColor: isFocused ? colors.menuTextColor : borderColor,
          borderWidth: borderColorType === 'WHITE' ? 0 : 1,
        },
        style,
      ]}
      onPress={() => {
        console.log('Pressable clicked, focusing input...');
        if (onPress) {
          onPress();
        }
        inputRef.current?.focus();
      }}
      disabled={disabled}>
      <TextInput
        ref={inputRef}
        {...rest}
        value={value}
        onChangeText={onChangeText}
        style={{
          width: type === 'DELETE_TEXT_AND_ADD_BUTTON' ? '70%' : '80%',
          color: colors.menuTextColor,
          fontFamily: FONT_FAMILY.MEDIUM,
          fontSize: fontSize1(14),
        }}
        onBlur={e => {
          //console.log('Input blurred');
          setIsFocused(false);
          onBlur?.(e);
        }}
        onFocus={e => {
          //console.log('Input focused');
          setIsFocused(true);
          onFocus?.(e);
        }}
        placeholderTextColor={colors.disableButton}
        onPressIn={() => {
          //console.log('Input pressed');
          if (onPress) {
            onPress();
          }
        }}
        onSubmitEditing={e => {
          setIsFocused(false);
          onSubmitEditing?.(e);
        }}
      />
      {renderIconRight()}
    </Pressable>
  );
});

export default memo(CustomPositionMainSearch);

const styles = StyleSheet.create({
  container: {
    minHeight: heightScale1(50),
    paddingHorizontal: widthScale1(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: widthScale1(8),
    width: WIDTH - widthScale1(65),
    borderColor: colors.disableButton,
  },
  buttonAdd: {
    flexDirection: 'row',
    borderColor: colors.disableButton,
    borderWidth: 1,
    borderRadius: widthScale1(6),
    height: heightScale1(30),
    gap: widthScale1(2),
    alignItems: 'center',
    paddingHorizontal: widthScale1(10),
  },
});
