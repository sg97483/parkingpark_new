import React, {memo} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import HStack from '~components/h-stack';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface Props {
  icon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  buttonText: string;
  outlineButton?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const SecondaryButton: React.FC<Props> = memo(props => {
  const {buttonText, disabled, icon, onPress, isLoading, outlineButton, buttonStyle, textStyle} =
    props;

  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.containerStyle,
        {
          backgroundColor: outlineButton
            ? colors.transparent
            : disabled
              ? colors.disableButton
              : colors.black,
          borderColor: disabled ? colors.disableButton : colors.black,
        },
        buttonStyle,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={outlineButton ? colors.black : colors.white} />
      ) : (
        <HStack>
          {icon && <View style={styles.buttonWrapperStyle}>{icon}</View>}
          <Text
            style={[
              styles.buttonTextStyle,
              {
                color:
                  outlineButton && !disabled
                    ? colors.black
                    : disabled
                      ? colors.disableButton
                      : colors.white,
              },
              textStyle,
            ]}>
            {buttonText}
          </Text>
        </HStack>
      )}
    </TouchableOpacity>
  );
});

export {SecondaryButton};

const styles = StyleSheet.create({
  containerStyle: {
    height: heightScale1(58),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonWrapperStyle: {
    marginRight: widthScale1(4),
  },
  buttonTextStyle: {
    fontSize: fontSize1(16),
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    color: colors.white,
  },
});
