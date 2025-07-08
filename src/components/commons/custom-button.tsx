import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Animated,
  Easing,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {ICONS} from '~/assets/images-path';
import {Icons} from '~/assets/svgs';
import CustomText, {getFontSize} from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

export type ButtonType = 'PRIMARY' | 'SECONDARY' | 'TERTIARY';

interface Props {
  type?: ButtonType;
  text: string;
  onPress: (() => void) | undefined;
  onPressOut?: (() => void) | undefined;
  textSize?: FONT;
  outLine?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  leftIconReload?: boolean;
  rightIconReload?: boolean;
  buttonHeight?: number;
  onDisabledButtonPress?: () => void;
  iconType?: 'RELOAD' | 'PLUS' | 'SWITCH_ACCOUNT' | 'HEAD_PHONE' | 'CHEVRON';
  borderRadiusValue?: number;
}

const CustomButton: React.FC<Props> = memo(props => {
  const {
    text,
    type = 'PRIMARY',
    onPress,
    disabled,
    isLoading,
    outLine,
    textSize,
    buttonStyle,
    leftIconReload,
    rightIconReload,
    buttonHeight,
    onDisabledButtonPress,
    iconType = 'RELOAD',
    borderRadiusValue = 8,
    onPressOut,
  } = props;

  const [pressIn, setPressIn] = useState<boolean>(false);
  const spinValue = new Animated.Value(0);

  const handlePressIn = useCallback(() => {
    setPressIn(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setPressIn(false);
    onPressOut && onPressOut();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  });

  const PressedBackgroundColor = useMemo((): string => {
    switch (type) {
      case 'PRIMARY':
        return colors.primaryPressed;
      case 'SECONDARY':
        return colors.black;
      case 'TERTIARY':
        return colors.tertiaryPressedColor;
      default:
        return '';
    }
  }, [type]);

  const BackgroundColor = useMemo((): string => {
    switch (type) {
      case 'PRIMARY':
        return colors.redSwitch;
      case 'SECONDARY':
        return colors.heavyGray;
      case 'TERTIARY':
        return colors.policy;
      default:
        return '';
    }
  }, [type]);

  const DisabledBackgroundColor = useMemo((): string => {
    switch (type) {
      case 'PRIMARY':
        return colors.disableButton;
      case 'SECONDARY':
        return colors.disableButton;
      case 'TERTIARY':
        return colors.policy;
      default:
        return '';
    }
  }, [type]);

  const ButtonTextColor = useMemo(() => {
    if (outLine) {
      switch (type) {
        case 'PRIMARY':
          return pressIn
            ? colors.primaryPressed
            : disabled
              ? colors.disableButton
              : colors.redSwitch;
        case 'SECONDARY':
          return pressIn
            ? colors.menuTextColor
            : disabled
              ? colors.disableButton
              : colors.heavyGray;
        case 'TERTIARY':
          return pressIn ? colors.grayText2 : disabled ? colors.disableButton : colors.lineCancel;
        default:
          return '';
      }
    } else {
      switch (type) {
        case 'PRIMARY':
          return colors.white;
        case 'SECONDARY':
          return colors.white;
        case 'TERTIARY':
          return pressIn ? colors.grayText2 : colors.lineCancel;
        default:
          return '';
      }
    }
  }, [pressIn, type, outLine, disabled]);

  const BorderColor = useMemo(() => {
    switch (type) {
      case 'PRIMARY':
        return pressIn ? colors.primaryPressed : disabled ? colors.disableButton : colors.redSwitch;
      case 'SECONDARY':
        return pressIn ? colors.menuTextColor : disabled ? colors.disableButton : colors.heavyGray;
      case 'TERTIARY':
        return pressIn
          ? colors.disableButton
          : disabled
            ? colors.grayCheckBox
            : colors.disableButton;
      default:
        return '';
    }
  }, [type]);

  const LoadingIcon = useMemo((): ImageSourcePropType => {
    switch (type) {
      case 'PRIMARY':
        return outLine ? ICONS.loading_outline_primary : ICONS.loading_primary;
      case 'SECONDARY':
        return outLine ? ICONS.loading_outline_secodary : ICONS.loading_secodary;
      case 'TERTIARY':
        return outLine ? ICONS.loading_outline_tertiary : ICONS.loading_tertiary;
      default:
        return outLine ? ICONS.loading_outline_primary : ICONS.loading_primary;
    }
  }, [type, outLine]);

  const renderIcon = useMemo(() => {
    switch (iconType) {
      case 'RELOAD':
        return <Icons.Reset stroke={ButtonTextColor} />;

      case 'PLUS':
        return <Icons.Plus stroke={ButtonTextColor} />;

      case 'SWITCH_ACCOUNT':
        return <Icons.UserSwitch width={16} height={17} stroke={ButtonTextColor} />;

      case 'HEAD_PHONE':
        return <Icons.Headphone width={16} height={17} stroke={ButtonTextColor} />;

      case 'CHEVRON':
        return <Icons.ChevronRight width={16} height={17} stroke={ButtonTextColor} />;

      default:
        return <Icons.Reset stroke={ButtonTextColor} />;
    }
  }, [iconType, ButtonTextColor]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={onDisabledButtonPress ? false : disabled || isLoading}
      onPress={onDisabledButtonPress && disabled ? onDisabledButtonPress : onPress}
      style={[
        styles.containerStyle,
        {
          backgroundColor:
            onDisabledButtonPress && disabled
              ? DisabledBackgroundColor
              : outLine
                ? colors.white
                : pressIn
                  ? PressedBackgroundColor
                  : disabled
                    ? DisabledBackgroundColor
                    : BackgroundColor,
          borderWidth: outLine ? 1 : 0,
          borderColor: BorderColor,
          minHeight: buttonHeight ? heightScale1(buttonHeight) : heightScale1(48),
          borderRadius: scale1(borderRadiusValue),
        },
        buttonStyle,
      ]}>
      <HStack style={{gap: widthScale1(4)}}>
        {!isLoading && leftIconReload ? renderIcon : null}
        {isLoading ? (
          <Animated.Image
            source={LoadingIcon}
            style={[
              styles.loadingIconStyle,
              textSize
                ? {
                    width: fontSize1(getFontSize(textSize)),
                    height: fontSize1(getFontSize(textSize)),
                  }
                : {},
              {
                transform: [
                  {
                    rotate: spinValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        ) : (
          <CustomText
            forDriveMe
            size={textSize ? textSize : FONT.CAPTION_7}
            family={FONT_FAMILY.SEMI_BOLD}
            string={text ?? ''}
            color={ButtonTextColor}
          />
        )}
        {!isLoading && rightIconReload ? renderIcon : null}
      </HStack>
    </Pressable>
  );
});

export default CustomButton;

const styles = StyleSheet.create({
  containerStyle: {
    minWidth: widthScale1(58),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: widthScale1(16),
  },
  loadingIconStyle: {
    width: widthScale1(20),
    height: widthScale1(20),
  },
});
