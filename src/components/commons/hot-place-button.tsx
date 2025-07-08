import React, {ReactNode} from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import HStack from '~components/h-stack';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface HotPlaceButtonProps {
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  position?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  zIndex?: number;
  elevation?: number;
  text: string;
  icon?: ReactNode;
  type?: 'white' | 'black' | 'gray' | 'light-blue';
  iconPosition?: 'left' | 'right' | 'none';
  iconSize?: number;
  iconContainerStyle?: StyleProp<ViewStyle>;
}

const HotPlaceButton = React.memo(
  ({
    text = '텍스트',
    icon = null,
    iconPosition = 'left',
    iconSize = 16,
    type = 'white',
    position = undefined,
    zIndex = 999,
    elevation = 5,
    onPress = () => {},
    iconContainerStyle,
  }: HotPlaceButtonProps) => {
    const colorStyle: {
      default: ColorValue;
      pressed: ColorValue;
      textColor: ColorValue;
    } = React.useMemo(() => {
      let defaultColor, pressedColor, textColor;
      switch (type) {
        case 'black':
          defaultColor = colors.heavyGray;
          pressedColor = colors.grayRating;
          textColor = colors.white;
          break;
        case 'gray':
          defaultColor = colors.policy;
          pressedColor = colors.tertiaryPressedColor;
          textColor = colors.lineCancel;
          break;
        case 'light-blue':
          defaultColor = colors.successBackdrop;
          pressedColor = '#E2F3FF';
          textColor = colors.success;
          break;
        default:
          defaultColor = colors.white;
          pressedColor = colors.tertiaryPressedColor;
          textColor = colors.black;
          break;
      }
      return {
        default: defaultColor,
        pressed: pressedColor,
        textColor,
      };
    }, [type]);

    const renderContent = React.useMemo(() => {
      const renderText = () => (
        <Text
          style={[
            styles.buttonTextStyle,
            {color: colorStyle.textColor},
            {marginLeft: iconPosition === 'left' ? widthScale1(6) : 0},
            {marginRight: iconPosition === 'right' ? widthScale1(6) : 0},
          ]}>
          {text}
        </Text>
      );

      const renderIcon = () =>
        icon
          ? React.cloneElement(icon as any, {
              stroke: colorStyle.textColor,
              width: widthScale1(iconSize),
              height: widthScale1(iconSize),
            })
          : null;

      if (iconPosition === 'left') {
        return (
          <>
            {renderIcon()}
            {renderText()}
          </>
        );
      } else if (iconPosition === 'right') {
        return (
          <>
            {renderText()}
            {renderIcon()}
          </>
        );
      }

      return renderText();
    }, [colorStyle, text, iconPosition, icon, iconSize]);

    return (
      // 👇 이 부분이 수정되었습니다.
      <View
        style={[
          styles.shadowContainer,
          position ? {...position, position: 'absolute'} : {},
          {zIndex, elevation},
        ]}>
        <TouchableHighlight
          onPress={onPress}
          underlayColor={colorStyle.pressed}
          style={[styles.buttonContent, {backgroundColor: colorStyle.default}, iconContainerStyle]}>
          <HStack>{renderContent}</HStack>
        </TouchableHighlight>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  // 그림자와 위치를 담당하는 외부 컨테이너
  shadowContainer: {
    shadowColor: colors.shadowColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  // 실제 버튼의 모양과 내용을 담당하는 내부 컨테이너
  buttonContent: {
    paddingHorizontal: widthScale1(16),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: heightScale1(40),
    borderWidth: 1, // 테두리 스타일은 내용물에 직접 적용
    borderColor: '#C1C1C1',
  },
  buttonTextStyle: {
    color: colors.white,
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: fontSize1(14),
    marginLeft: widthScale1(6),
    lineHeight: heightScale1(19.6),
  },
});

export default HotPlaceButton;
