import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ICONS} from '~/assets/images-path';
import {Icons} from '~/assets/svgs';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import CustomText from './custom-text';
import HStack from './h-stack';

interface Props {
  text?: string;
  hideBack?: boolean;
  rightContent?: React.ReactNode;
  headerTextStyle?: TextStyle;
  contentHeaderStyle?: StyleProp<ViewStyle>;
  isIconBackX?: boolean;
  onPressIconBackX?: () => void;
  leftIconBack?: React.ReactNode;
  onPressBack?: () => void;
  showVerifyMark?: boolean;
  onHeaderTextPress?: () => void;
}

const CustomHeader: React.FC<Props> = memo(props => {
  const navigation = useNavigation();

  const {
    text,
    hideBack = false,
    rightContent,
    headerTextStyle,
    contentHeaderStyle,
    isIconBackX,
    onPressBack,
    onPressIconBackX,
    showVerifyMark,
    onHeaderTextPress,
  } = props;

  return (
    <HStack style={styles.container}>
      {!hideBack ? (
        <Pressable
          onPress={() => {
            if (onPressBack) {
              onPressBack();
            } else {
              navigation.canGoBack() && navigation.goBack();
            }
          }}
          hitSlop={30}
          style={styles.backIconWrapper}>
          <Icons.ChevronLeft />
        </Pressable>
      ) : isIconBackX ? (
        <TouchableOpacity onPress={onPressIconBackX} style={styles.backIconWrapper}>
          <Image source={ICONS.icons_exit_black} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
      ) : null}

      <View style={[styles.headerContainer, contentHeaderStyle]}>
        <HStack>
          <Pressable
            onPress={() => {
              onHeaderTextPress && onHeaderTextPress();
            }}>
            <CustomText
              string={text!}
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_7}
              forDriveMe
              textStyle={[styles.header, headerTextStyle]}
              numberOfLines={1}
            />
          </Pressable>

          {showVerifyMark ? <Icons.VerificationMark style={{marginLeft: widthScale1(4)}} /> : null}
        </HStack>
      </View>

      {rightContent ? <View style={styles.rightContent}>{rightContent}</View> : null}
    </HStack>
  );
});

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    minHeight: heightScale1(48),
    marginHorizontal: widthScale1(22),
  },
  backIconWrapper: {
    zIndex: 999,
  },
  backIcon: {
    width: widthScale1(24),
    height: heightScale1(24),
    tintColor: colors.grayRating,
  },
  header: {
    color: colors.black,
    textAlign: 'center',
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  rightContent: {
    position: 'absolute',
    right: 0,
  },
});
