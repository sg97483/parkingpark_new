import React, {memo, useMemo} from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

type ButtonType = 'LIGHT' | 'DARK';
type IconType = 'RELOAD' | 'DROPDOWN' | 'X';

interface Props {
  type?: ButtonType;
  text: string;
  iconRight?: boolean;
  iconLeft?: boolean;
  onPress: () => void;
  buttonStyles?: StyleProp<ViewStyle>;
  iconType?: IconType;
}

const CustomFilterButton: React.FC<Props> = memo(props => {
  const {
    text,
    type = 'LIGHT',
    iconRight,
    iconLeft,
    onPress,
    buttonStyles,
    iconType = 'DROPDOWN',
  } = props;

  // background color
  const backgroundColor = useMemo((): string => {
    switch (type) {
      case 'LIGHT':
        return colors.white;
      case 'DARK':
        return colors.heavyGray;
      default:
        return '';
    }
  }, [type]);

  // text color
  const textColor = useMemo((): string => {
    switch (type) {
      case 'LIGHT':
        return colors.lineCancel;
      case 'DARK':
        return colors.white;
      default:
        return '';
    }
  }, [type]);

  // border color
  const borderColor = useMemo((): string => {
    switch (type) {
      case 'LIGHT':
        return colors.disableButton;
      default:
        return '';
    }
  }, [type]);

  // render icon type
  const renderIcon = useMemo((): React.ReactNode => {
    switch (iconType) {
      case 'X':
        return (
          <Icons.IconX
            width={widthScale1(16)}
            height={heightScale1(16)}
            stroke={type === 'DARK' ? colors.white : ''}
          />
        );
      case 'DROPDOWN':
        return (
          <Icons.ChevronDown
            width={widthScale1(16)}
            height={heightScale1(16)}
            stroke={type === 'DARK' ? colors.white : colors.lineCancel}
          />
        );
      default:
        return (
          <Icons.Reset
            width={widthScale1(16)}
            height={heightScale1(16)}
            stroke={type === 'DARK' ? colors.white : ''}
          />
        );
    }
  }, [iconType, type]);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: type === 'DARK' ? 0 : 1,
        },
        buttonStyles,
      ]}>
      {iconLeft ? renderIcon : null}

      <CustomText
        string={text}
        family={FONT_FAMILY.MEDIUM}
        forDriveMe
        lineHeight={heightScale1(20)}
        color={textColor}
      />

      {iconRight ? renderIcon : null}
    </Pressable>
  );
});

export default CustomFilterButton;

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: widthScale1(14),
    paddingVertical: heightScale1(6),
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: heightScale1(32),
    gap: widthScale1(4),
  },
});
