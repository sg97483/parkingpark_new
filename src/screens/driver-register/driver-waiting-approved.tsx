import {CommonActions} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {IMAGES} from '~/assets/images-path';
import CustomButton from '~components/commons/custom-button';
import LineButton from '~components/commons/line-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {changeCarpoolMode} from '~reducers/userReducer';
import {
  useGetMyDriverRoadQuery,
  useGetMyRiderRoadQuery,
  useReadMyCarpoolInfoQuery,
} from '~services/carpoolServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const DriverWaitingApproved = (props: RootStackScreenProps<'DriverWaitingApproved'>) => {
  const {navigation} = props;

  const {CMemberID, userID} = userHook();

  const dispatch = useAppDispatch();

  const {data: driverRoad} = useGetMyDriverRoadQuery({id: CMemberID!, memberId: userID!});

  const {data: businessCardInfo} = useReadMyCarpoolInfoQuery({memberId: userID as number});

  const {data: passengerRoad} = useGetMyRiderRoadQuery(
    {
      memberId: userID as number,
      id: CMemberID as number,
    },
    {skip: !CMemberID || !userID, refetchOnFocus: true},
  );

  const isRegisterRouteWork = useMemo(() => {
    return passengerRoad?.startPlaceIn && passengerRoad?.startPlaceOut ? true : false;
  }, [passengerRoad]);

  const isRegisterRouteHome = useMemo(() => {
    return passengerRoad?.endPlaceIn && passengerRoad?.endPlaceOut ? true : false;
  }, [passengerRoad]);

  const haveRoadHome = useMemo(
    () =>
      !driverRoad?.startPlaceOut &&
      !driverRoad?.endPlaceOut &&
      !!driverRoad?.startPlaceIn &&
      !!driverRoad?.endPlaceIn,
    [driverRoad],
  );

  const haveRoadDriver = useMemo(
    () =>
      !!driverRoad?.startPlaceIn &&
      !!driverRoad?.endPlaceIn &&
      !!driverRoad?.startPlaceOut &&
      !!driverRoad?.endPlaceOut,

    [driverRoad],
  );

  const changeModePassenger = () => {
    if (!isRegisterRouteWork) {
      navigation.navigate(ROUTE_KEY.DriverCommunicationRegistration, {isPassenger: true});
      return;
    }

    if (!isRegisterRouteHome) {
      navigation.navigate(ROUTE_KEY.WayToWorkRegistration1, {isReturnRoute: true});
      return;
    }

    requestAnimationFrame(() => {
      dispatch(changeCarpoolMode('PASSENGER'));
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: ROUTE_KEY.ParkingParkHome, params: {selectedTab: 2}}],
        }),
      );
      console.log('ParkingParkHome_selectedTab_1');
    });
  };

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader
        hideBack
        rightContent={
          <LineButton
            text="닫기"
            onPress={() => navigation.navigate(ROUTE_KEY.ParkingParkHome, {selectedTab: 1})}
          />
        }
      />
      <View style={styles.container}>
        <Image
          source={IMAGES.waiting_approved}
          style={{height: heightScale1(120), width: widthScale1(100)}}
          resizeMode="contain"
        />
        <CustomText
          string={'드라이버 승인 대기중입니다.\n승인을 기다려 주세요.'}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_8}
          textStyle={{marginTop: heightScale1(30), textAlign: 'center'}}
          color={colors.black}
          lineHeight={fontSize1(28)}
          forDriveMe
        />
        <CustomText
          string={'승인을 기다리는 동안 출퇴근길 경로를\n미리 등록해보세요!'}
          family={FONT_FAMILY.MEDIUM}
          size={FONT.CAPTION_7}
          textStyle={{marginTop: heightScale1(10), textAlign: 'center'}}
          color={colors.grayText}
          lineHeight={fontSize1(22)}
          forDriveMe
        />
      </View>

      <PaddingHorizontalWrapper containerStyles={{marginBottom: PADDING1 / 2}} forDriveMe>
        <CustomButton
          text={haveRoadDriver ? '탑승객 모드로 둘러보기' : '경로 등록하기'}
          onPress={() => {
            if (haveRoadDriver) {
              changeModePassenger();
            } else {
              if (haveRoadHome) {
                navigation.navigate(ROUTE_KEY.DriverWayToWork1, {
                  isReturnRoute: true,
                  previousRoute: driverRoad as any,
                });
                return;
              }
              navigation.navigate(ROUTE_KEY.DriverWayToWork1);
            }
          }}
          buttonHeight={58}
        />

        {!haveRoadDriver ? (
          <CustomButton
            type="TERTIARY"
            text={strings.driver_register.customer_mode}
            onPress={changeModePassenger}
            buttonStyle={{
              marginTop: heightScale1(10),
              backgroundColor: colors.white,
              borderColor: colors.disableButton,
              borderWidth: 1,
            }}
            buttonHeight={58}
          />
        ) : null}
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default DriverWaitingApproved;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});
