import {useNavigation} from '@react-navigation/native';
import React, {memo, useMemo} from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icons} from '~/assets/svgs';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const AnimatedPressable = Animated.createAnimatedComponent(TouchableHighlight);

interface Props {
  scrollYValue: SharedValue<number>;
  title?: string;
  handleBack?: () => void;
  rightContent?: React.ReactNode;
}

const AnimatedHeader: React.FC<Props> = memo(props => {
  const {scrollYValue, title = '', handleBack, rightContent} = props;

  const insetTop = useSafeAreaInsets().top;
  const HEADER_HEIGHT = useMemo(() => heightScale1(48) + insetTop, [insetTop]);
  const MAX_SCROLL_HEIGHT = heightScale1(200);
  const TRANSLATE_X_VALUE = widthScale1(10);
  const navigation = useNavigation();

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollYValue.value,
        [0, MAX_SCROLL_HEIGHT],
        [colors.transparent, colors.white],
      ),
    };
  });

  const headerTextOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollYValue.value, [0, MAX_SCROLL_HEIGHT], [0, 1]),
    };
  });

  // 👇 애니메이션 스타일을 두 개로 분리했습니다.
  // 1. 그림자 컨테이너의 애니메이션 (움직임, elevation)
  const shadowContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      elevation: interpolate(scrollYValue.value, [0, PADDING1, PADDING1 + 1], [5, 0, 0]),
      transform: [
        {
          translateX: interpolate(
            scrollYValue.value,
            [0, MAX_SCROLL_HEIGHT, MAX_SCROLL_HEIGHT + 1],
            [0, -TRANSLATE_X_VALUE, -TRANSLATE_X_VALUE],
          ),
        },
        {
          translateY: interpolate(
            scrollYValue.value,
            [0, MAX_SCROLL_HEIGHT, MAX_SCROLL_HEIGHT + 1],
            [10, 0, 0],
          ),
        },
      ],
    };
  });

  // 2. 실제 버튼의 배경색 애니메이션
  const buttonContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollYValue.value,
        [0, MAX_SCROLL_HEIGHT / 2],
        [colors.white, colors.transparent],
      ),
    };
  });

  return (
    <Animated.View
      style={[
        styles.containerStyle,
        {
          height: HEADER_HEIGHT,
        },
        containerAnimatedStyle,
      ]}>
      <HStack style={styles.contentStyle}>
        {/* 👇 뒤로가기 버튼의 구조를 수정했습니다. */}
        <Animated.View style={[styles.backButtonShadow, shadowContainerAnimatedStyle]}>
          <AnimatedPressable
            onPress={() => {
              handleBack?.();
              navigation.goBack();
            }}
            hitSlop={40}
            underlayColor={colors.policy}
            style={[styles.backButtonStyle, buttonContentAnimatedStyle]}>
            <Icons.ChevronLeft />
          </AnimatedPressable>
        </Animated.View>

        <Animated.Text style={[styles.headerTextStyle, headerTextOpacityStyle]}>
          {title}
        </Animated.Text>

        {rightContent && (
          <Animated.View style={[styles.rightContentStyle, headerTextOpacityStyle]}>
            {rightContent}
          </Animated.View>
        )}
      </HStack>
    </Animated.View>
  );
});

export default AnimatedHeader;

const styles = StyleSheet.create({
  containerStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 999,
    paddingHorizontal: PADDING1,
  },
  contentStyle: {
    height: heightScale1(48),
    marginTop: 'auto',
  },
  headerTextStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: fontSize1(16),
    fontFamily: FONT_FAMILY.MEDIUM,
    color: colors.menuTextColor,
  },
  // 그림자만 담당하는 외부 컨테이너 스타일
  backButtonShadow: {
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 12,
    shadowOpacity: 0.1,
  },
  // 실제 버튼 모양을 담당하는 내부 스타일
  backButtonStyle: {
    width: widthScale1(40),
    height: widthScale1(40),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    overflow: 'hidden', // 배경색이 모서리를 벗어나지 않도록 설정
  },
  rightContentStyle: {
    position: 'absolute',
    right: 0,
  },
});
