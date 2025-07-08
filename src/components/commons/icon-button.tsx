import React, {memo} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from 'react-native';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {widthScale1} from '~styles/scaling-utils';

interface Props {
  icon: React.ReactNode;
  size?: number;
  onPress?: () => void;
  position?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  buttonStyle?: StyleProp<ViewStyle>;
  badgeNum?: number;
  isLoading?: boolean;
}

const IconButton: React.FC<Props & TouchableHighlightProps> = memo(props => {
  const {icon, size, onPress, position, buttonStyle, badgeNum, isLoading} = props;

  return (
    <View>
      <TouchableHighlight
        style={[
          styles.containerStyle,
          {
            width: size ? widthScale1(size) : widthScale1(40),
            height: size ? widthScale1(size) : widthScale1(40),
          },
          position
            ? {
                position: 'absolute',
                zIndex: 1,
                ...position,
              }
            : {},
          buttonStyle,
        ]}
        onPress={onPress}
        underlayColor={colors.tertiaryPressedColor}
        {...props}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: size ? widthScale1(size) : widthScale1(40),
            height: size ? widthScale1(size) : widthScale1(40),
          }}>
          {isLoading ? <ActivityIndicator size={'small'} /> : icon}
          {badgeNum && badgeNum > 0 ? (
            <View
              style={{
                backgroundColor: 'red',
                position: 'absolute',
                top: 0,
                right: -((badgeNum?.toString().length / 2) * widthScale1(4)),
                borderRadius: 999,
                justifyContent: 'center',
                alignItems: 'center',
                aspectRatio: 1,
                paddingHorizontal: widthScale1(4),
                minHeight: widthScale1(16),
                minWidth: widthScale1(16),
                maxWidth: widthScale1(32),
              }}>
              <CustomText
                string={badgeNum > 99 ? 'N' : badgeNum.toString()}
                forDriveMe
                size={FONT.CAPTION_4}
                family={FONT_FAMILY.SEMI_BOLD}
                color={colors.white}
                numberOfLines={1}
              />
            </View>
          ) : null}
        </View>
      </TouchableHighlight>
    </View>
  );
});

export default IconButton;

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 999,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 12,
    shadowOpacity: 0.1,
    elevation: 5,
  },
});
