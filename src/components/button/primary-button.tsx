import React, {memo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
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

const PrimaryButton: React.FC<Props> = memo(props => {
  const {buttonText, disabled, icon, onPress, isLoading, outlineButton, buttonStyle, textStyle} =
    props;

  const [isPressIn, setIsPressIn] = useState<boolean>(false);

  return (
    <Pressable
      disabled={disabled || isLoading}
      onPress={onPress}
      style={[
        styles.containerStyle,
        {
          backgroundColor: outlineButton
            ? colors.transparent
            : disabled
              ? colors.disableButton
              : colors.primary,
          borderColor: disabled ? colors.disableButton : colors.primary,
        },
        buttonStyle,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={outlineButton ? colors.primary : colors.white} />
      ) : (
        <HStack>
          {icon && <View style={styles.buttonWrapperStyle}>{icon}</View>}
          <Text
            style={[
              styles.buttonTextStyle,
              {
                color:
                  outlineButton && !disabled
                    ? colors.primary
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
    </Pressable>
  );
});

export {PrimaryButton};

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
