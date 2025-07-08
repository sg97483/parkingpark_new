import React, {memo, useMemo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  type?: 'WAY_WORK' | 'WAY_HOME';
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const RouteBadge: React.FC<Props> = memo(props => {
  const {type = 'WAY_WORK', disabled = false, containerStyle} = props;

  const backgroundColorValue = useMemo((): string => {
    if (disabled) {
      switch (type) {
        case 'WAY_WORK':
          return colors.disableButton;

        case 'WAY_HOME':
          return colors.colorStatus;

        default:
          return '';
      }
    }

    switch (type) {
      case 'WAY_WORK':
        return colors.black2;

      case 'WAY_HOME':
        return colors.colorStatus;

      default:
        return '';
    }
  }, [type, disabled]);

  const textColorValue = useMemo((): string => {
    if (disabled) {
      switch (type) {
        case 'WAY_WORK':
          return colors.white;

        case 'WAY_HOME':
          return colors.disableButton;

        default:
          return '';
      }
    }

    switch (type) {
      case 'WAY_WORK':
        return colors.white;

      case 'WAY_HOME':
        return colors.menuTextColor;

      default:
        return '';
    }
  }, [type, disabled]);

  return (
    <View
      style={[
        styles.containerStyle,
        {
          backgroundColor: backgroundColorValue,
        },
        containerStyle,
      ]}>
      <CustomText
        forDriveMe
        size={FONT.CAPTION_4}
        family={FONT_FAMILY.SEMI_BOLD}
        string={type === 'WAY_WORK' ? '출근길' : '퇴근길'}
        lineHeight={heightScale1(15)}
        color={textColorValue}
      />
    </View>
  );
});

export default RouteBadge;

const styles = StyleSheet.create({
  containerStyle: {
    minWidth: widthScale1(45),
    minHeight: heightScale1(27),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale1(4),
    paddingVertical: heightScale1(6),
    paddingHorizontal: widthScale1(8),
  },
});
