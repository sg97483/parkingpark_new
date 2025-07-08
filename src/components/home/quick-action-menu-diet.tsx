import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import React, {memo, useMemo, useRef} from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {showMessage} from 'react-native-flash-message';
import {ICONS} from '~/assets/images-path';
import HStack from '~components/h-stack';
import {PADDING1, WIDTH} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {useCheckRoute} from '~hooks/carpoolHook';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useCheckAuthDriverAndPassengerMutation} from '~services/userServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const MAX_POINT =
  PADDING1 * 2 + heightScale1(10) + heightScale1(108 * 3) + heightScale1(12 * 2) + 3;

const QuickActionMenuDiet: React.FC = memo(() => {
  const text = strings.quick_action_memu;
  const navigation: UseRootStackNavigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {CMemberID, userID} = userHook();
  const dispatch = useAppDispatch();
  const [checkAuthDriverAndPassenger] = useCheckAuthDriverAndPassengerMutation();

  const {isAgreeTerms} = useCheckRoute();

  const snapPoints = useMemo(() => [heightScale1(25), MAX_POINT], []);

  const handleDriveMePress = async () => {
    try {
      if (!userID || !CMemberID) {
        showMessage({message: strings?.general_text?.login_first});
        navigation.navigate(ROUTE_KEY.Login);
        return;
      }

      const result = await checkAuthDriverAndPassenger({
        id: CMemberID,
        memberId: userID,
      }).unwrap();

      if (!isAgreeTerms) {
        navigation.navigate(ROUTE_KEY.DiverAgreeActivity, {isPassenger: true});
        return;
      }

      if (result.authDriver === 'Y') {
        navigation.navigate(ROUTE_KEY.DriverCompleteApproval);
      } else if (result.authDriver === 'C') {
        navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
      } else if (result.authDriver === 'N') {
        navigation.navigate(ROUTE_KEY.DriverRegister);
      }
    } catch (error) {
      showMessage({message: 'Error during driver and passenger authentication.'});
      console.error(error);
    }
  };

  return (
    <BottomSheet
      enablePanDownToClose={false}
      ref={bottomSheetRef}
      index={0}
      handleComponent={() => null}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={0}
          appearsOnIndex={1}
          pressBehavior={'none'}
        />
      )}
      snapPoints={snapPoints}>
      <BottomSheetView style={styles.contentContainer}>
        <StatusBar backgroundColor={colors.transparent} />

        <View style={styles.indicatorStyle} />

        {/* 👇 [Drive Me] 버튼 구조 수정 */}
        <View style={styles.buttonShadow}>
          <Pressable style={styles.buttonStyle} onPress={handleDriveMePress}>
            <HStack style={styles.iconWrapperStyle}>
              <View style={styles.titleWrapperStyle}>
                <Text style={styles.titleTextStyle}>{text.give_me_a_drive}</Text>
                <Text style={styles.subTitleTextStyle}>
                  {text.make_commuting_more_convenient_with_carpooling}
                </Text>
              </View>
              <FastImage
                source={ICONS.group_marker_3d}
                style={styles.markerIconStyle}
                resizeMode="contain"
              />
            </HStack>
          </Pressable>
        </View>

        <HStack
          style={{
            flexWrap: 'wrap',
          }}>
          {/* 👇 [Airport Parking] 버튼 구조 수정 */}
          <View style={styles.menuShadow}>
            <Pressable onPress={() => navigation.navigate(ROUTE_KEY.AirportParking)}>
              <HStack style={styles.menuWrapperStyle}>
                <View>
                  <Text style={styles.titleTextStyle}>{text.airport_parking}</Text>
                  <Text style={styles.subTitleTextStyle}>{text.parking_when_traveling_easily}</Text>
                </View>
                <FastImage source={ICONS.plane_3d} style={styles.iconStyle} resizeMode="stretch" />
              </HStack>
            </Pressable>
          </View>

          {/* 👇 [Valet Parking] 버튼 구조 수정 */}
          <View style={[styles.menuShadow, {marginLeft: widthScale1(12)}]}>
            <Pressable onPress={() => navigation.navigate(ROUTE_KEY.ValetParkingAtIncheon)}>
              <HStack style={styles.menuWrapperStyle}>
                <View>
                  <Text style={styles.titleTextStyle}>{text.valet_parking}</Text>
                  <Text style={styles.subTitleTextStyle}>
                    {text.worry_about_parking_when_traveling}
                  </Text>
                </View>
                <FastImage source={ICONS.hand_3d} style={styles.iconStyle} resizeMode="stretch" />
              </HStack>
            </Pressable>
          </View>

          {/* 👇 [Parking Sharing] 버튼 구조 수정 */}
          <View style={styles.menuShadow}>
            <Pressable onPress={() => navigation.navigate(ROUTE_KEY.RegisterParkingShared)}>
              <HStack style={styles.menuWrapperStyle}>
                <View>
                  <Text style={styles.titleTextStyle}>{text.parking_sharing}</Text>
                  <Text style={styles.subTitleTextStyle}>
                    {text.share_your_parking_lot_and_make_money}
                  </Text>
                </View>
                <FastImage source={ICONS.marker_3d} style={styles.iconStyle} resizeMode="stretch" />
              </HStack>
            </Pressable>
          </View>

          {/* 👇 [Monthly parking direct transaction] 버튼 구조 수정 */}
          <View style={[styles.menuShadow, {marginLeft: widthScale1(12)}]}>
            <Pressable onPress={() => navigation.navigate(ROUTE_KEY.MonthlyParkingDirectMain)}>
              <HStack style={styles.menuWrapperStyle}>
                <View>
                  <Text style={styles.titleTextStyle}>{text.monthly_parking_direct}</Text>
                  <Text style={styles.subTitleTextStyle}>
                    {text.parking_lot_is_also_sold_directly}
                  </Text>
                </View>
              </HStack>
            </Pressable>
          </View>
        </HStack>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default QuickActionMenuDiet;

// QuickActionMenuDiet.tsx 파일 내의 styles 정의 부분만 수정합니다.
// ... (컴포넌트의 나머지 코드는 동일)

// QuickActionMenuDiet.tsx 파일 내의 styles 정의 부분만 수정합니다.
// ... (컴포넌트의 나머지 코드는 동일)

const styles = StyleSheet.create({
  indicatorStyle: {
    height: heightScale1(5),
    width: widthScale1(36),
    borderRadius: 999,
    backgroundColor: colors.indicatorColor,
    alignSelf: 'center',
    marginTop: heightScale1(10),
    marginBottom: PADDING1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: PADDING1,
    // backgroundColor: colors.white, // BottomSheetView가 배경을 담당하므로 여기서 필요 없을 수 있습니다.
    // 만약 BottomSheet 배경이 투명이거나 다른 색이라
    // 이 컨테이너에 흰색 배경이 필요하다면 추가하세요.
  },
  iconWrapperStyle: {
    justifyContent: 'space-between',
    padding: widthScale1(18),
  },
  markerIconStyle: {
    width: widthScale1(89),
    height: heightScale1(56),
  },
  iconStyle: {
    width: widthScale1(34),
    height: widthScale1(34),
    alignSelf: 'flex-start',
  },
  // 그림자를 담당하는 스타일
  buttonShadow: {
    marginBottom: heightScale1(3),
    shadowColor: colors.shadowColor,
    // backgroundColor: colors.white, // 👈 제거!
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 10,
    borderRadius: scale1(16), // 그림자가 둥근 모서리를 따르도록 추가
  },
  // 실제 버튼의 모양을 담당하는 스타일
  buttonStyle: {
    backgroundColor: colors.white,
    borderRadius: scale1(16),
    minHeight: heightScale1(108),
    justifyContent: 'center',
    overflow: 'hidden',
  },
  titleWrapperStyle: {
    flex: 1,
  },
  titleTextStyle: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(20),
    color: colors.menuTextColor,
    lineHeight: heightScale1(28),
  },
  subTitleTextStyle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: fontSize1(13),
    color: colors.grayText2,
    marginTop: heightScale1(8),
    lineHeight: heightScale1(18),
  },
  // 작은 메뉴 버튼들의 그림자를 담당하는 스타일
  menuShadow: {
    marginTop: heightScale1(12),
    width: (WIDTH - PADDING1 * 2 - widthScale1(12)) / 2 - 1,
    shadowColor: colors.shadowColor,
    shadowOffset: {width: 2, height: 2},
    // backgroundColor: colors.white, // 👈 제거!
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 10,
    borderRadius: scale1(16), // 그림자가 둥근 모서리를 따르도록 추가
  },
  // 작은 메뉴 버튼들의 모양을 담당하는 스타일
  menuWrapperStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: scale1(16),
    padding: widthScale1(18),
    minHeight: heightScale1(108),
    overflow: 'hidden',
  },
});
