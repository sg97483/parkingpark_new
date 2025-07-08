import React, {useState} from 'react';
import {Pressable, StyleSheet, TouchableHighlight} from 'react-native';
import {Icons} from '~/assets/svgs';
import Animated, {
  FadeInDown,
  ZoomOutEasyDown,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {IS_ANDROID} from '~constants/constant';
import {Portal} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '~store/storeHooks';
import CustomText from './custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {UseRootStackNavigation} from '~navigators/stack'; // UseRootStackNavigation import 확인
import {ROUTE_KEY} from '~navigators/router';
import {useGetMyDailyRouteCommuteQuery} from '~services/passengerServices';
import {userHook} from '~hooks/userHook';
import {colors} from '~styles/colors';
// import {ImageSourcePropType} from 'react-native'; // 사용되지 않으므로 제거 가능
// import {ICONS as ButtonLoadingIcons} from '~/assets/images-path'; // 사용되지 않으므로 제거 가능
// 로딩 아이콘 경로 수정

// 👇 RootState 타입을 스토어 파일에서 가져옵니다. (경로는 실제 파일 위치에 맞게 조정해주세요)
import {RootState} from '~store/store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface CustomFABProps {
  position?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  haveAReservationIsRunning?: boolean;
  renderActions?: React.ReactNode;
}

const BUTTON_SIZE = widthScale1(40);
const GAP = heightScale1(20);

const CustomFAB: React.FC<CustomFABProps> = props => {
  const {position = {right: heightScale1(20)}, haveAReservationIsRunning, renderActions} = props;

  // 👇 state에 RootState 타입 적용
  const bottomTabHeight = useAppSelector(
    (state: RootState) => state.termAndConditionReducer?.bottomTabHeight,
  );
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<UseRootStackNavigation>();

  const [isVisible, setIsVisible] = useState(false);
  const visibleAnimation = useSharedValue(0);

  const {userID} = userHook();
  const {data: dataDailyRoute} = useGetMyDailyRouteCommuteQuery(
    {c_memberId: userID as number}, // userID가 null일 수 있으므로 타입 단언 또는 null 체크 필요
    {skip: !userID},
  );

  const bottomHeight =
    (bottomTabHeight ?? 0) +
    (IS_ANDROID ? insets.bottom ?? 0 : 0) +
    heightScale1(20) +
    (haveAReservationIsRunning ? BUTTON_SIZE + GAP : 0);

  const mainFabWrapperAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: interpolate(visibleAnimation.value, [0, 1], [0, 45]) + 'deg',
      },
    ],
  }));

  const mainFabContentAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      visibleAnimation.value,
      [0, 1],
      [colors.primary, colors.white],
    ),
  }));

  const onPressMainButton = () => {
    setIsVisible(!isVisible);
    visibleAnimation.value = withTiming(isVisible ? 0 : 1, {duration: 250});
  };

  const registerPassengerDaily = () => {
    navigation.navigate(ROUTE_KEY.PassengerDailyRouteRegistration);
  };

  const renderMainButton = () => {
    return (
      <Animated.View
        style={[
          styles.mainFabShadowWrapper,
          {bottom: bottomHeight},
          position,
          mainFabWrapperAnimatedStyle,
        ]}>
        <Animated.View style={[styles.mainFabContentWrapper, mainFabContentAnimatedStyle]}>
          <TouchableHighlight
            style={styles.mainButtonPressableArea}
            underlayColor={isVisible ? colors.tertiaryPressedColor : colors.primaryPressed}
            onPress={onPressMainButton}>
            <Icons.Plus stroke={isVisible ? colors.black : colors.white} />
          </TouchableHighlight>
        </Animated.View>
      </Animated.View>
    );
  };

  const renderBackdrop = () => (
    <Pressable onPress={onPressMainButton} style={styles.containerBackdrop} />
  );

  const renderDefaultActions = () => {
    if (renderActions) {
      return renderActions;
    }

    return (
      <>
        <Animated.View
          entering={FadeInDown.delay(80)}
          exiting={ZoomOutEasyDown.delay(80).duration(120)}
          style={[
            styles.containerAction,
            {
              right: widthScale1(20),
              bottom: bottomHeight + (BUTTON_SIZE + GAP) * 2,
            },
          ]}>
          <Pressable
            onPress={() => {
              onPressMainButton();
              navigation.navigate(ROUTE_KEY.CarpoolRequestRegistrationList);
            }}>
            <CustomText
              forDriveMe
              string="요청리스트"
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_6}
              color={colors.black}
            />
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(0)}
          exiting={ZoomOutEasyDown.delay(0).duration(80)}
          style={[
            styles.containerAction,
            {
              right: widthScale1(20),
              bottom: bottomHeight + BUTTON_SIZE + GAP,
            },
          ]}>
          <Pressable style={styles.addAction} onPress={registerPassengerDaily}>
            <Icons.Plus stroke={colors.black} />
            <CustomText
              forDriveMe
              string="카풀요청"
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_6}
              color={colors.black}
            />
          </Pressable>
        </Animated.View>
      </>
    );
  };

  return (
    <Portal>
      <Animated.View pointerEvents="box-none" style={styles.container}>
        {isVisible && renderBackdrop()}
        {isVisible && renderDefaultActions()}
        {renderMainButton()}
      </Animated.View>
    </Portal>
  );
};

export default React.memo(CustomFAB);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  mainFabShadowWrapper: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainFabContentWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonPressableArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BUTTON_SIZE / 2,
  },
  containerBackdrop: {
    backgroundColor: colors.black,
    opacity: 0.6,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 2,
  },
  containerAction: {
    position: 'absolute',
    zIndex: 3,
    height: BUTTON_SIZE,
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: widthScale1(16),
    paddingVertical: widthScale1(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BUTTON_SIZE / 2,
  },
  addAction: {
    gap: widthScale1(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
