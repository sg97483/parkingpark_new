import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {DeviceEventEmitter, ScrollView, StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import InfoPriceRoute from '~components/commons/info-price-route';
import PageButton from '~components/commons/page-button';
import RouteBadge from '~components/commons/route-badge';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import LoadingComponent from '~components/loading-component';
import MyRouteEmpty from '~components/my-route/my-route-empty';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {EMIT_EVENT, FONT} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useGetMyDriverRoadQuery} from '~services/carpoolServices';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {useCheckAuthDriverAndPassengerMutation} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

const DriverRoute: React.FC = memo(() => {
  const {userID, CMemberID} = userHook();
  const navigation = useNavigation<UseRootStackNavigation>();

  const {data, refetch} = useGetMyDriverRoadQuery({memberId: userID!, id: CMemberID!});
  const [checkAuthDriverAndPassenger] = useCheckAuthDriverAndPassengerMutation();

  const isHaveStopOverIn = useMemo(
    (): boolean => (data?.stopOverPlaceIn && data?.soplatIn && data?.soplngIn ? true : false),
    [data],
  );

  const isHaveStopOverOut = useMemo(
    (): boolean =>
      data?.stopOverPlaceOut &&
      data?.soPriceOut &&
      data?.soPriceOut !== '0' &&
      data?.soplatOut &&
      data?.soplngOut
        ? true
        : false,
    [data],
  );

  const {data: directionIn, isLoading: isLoadingIn} = useGetDrivingDirectionQuery(
    {
      start: `${data?.splngIn},${data?.splatIn}`,
      end: `${data?.eplngIn},${data?.eplatIn}`,
    },
    {skip: !data},
  );

  const {data: directionOut, isLoading: isLoadingOut} = useGetDrivingDirectionQuery(
    {
      start: `${data?.splngOut},${data?.splatOut}`,
      end: `${data?.eplngOut},${data?.eplatOut}`,
    },
    {skip: !data},
  );

  const isLoading = useMemo(() => isLoadingIn && isLoadingOut, [isLoadingIn, isLoadingOut]);

  const isRouteRegistered = useMemo(
    (): boolean =>
      (data?.endPlaceIn?.length ?? 0) > 0 &&
      (data?.endPlaceOut?.length ?? 0) > 0 &&
      (data?.startPlaceIn?.length ?? 0) > 0 &&
      (data?.startPlaceOut?.length ?? 0) > 0,
    [data],
  );

  const endTimeIn = useMemo(() => {
    if (directionIn && data) {
      return moment(data.startTimeIn, 'HH:mm')
        .add(directionIn?.duration, 'minutes')
        .format('HH:mm');
    }
    return '';
  }, [directionIn, data]);

  const endTimeOut = useMemo(() => {
    if (directionOut && data) {
      return moment(data.startTimeOut, 'HH:mm')
        .add(directionOut?.duration, 'minutes')
        .format('HH:mm');
    }
    return '';
  }, [directionOut, data]);

  // handle on click edit way to work
  const handleEditWayToWork = () => {
    navigation.navigate(ROUTE_KEY.DriverWayToWork4, {
      dataOldRoute: data,
      isEditMyRoute: true,
      hasAddressStop: isHaveStopOverIn,
    });
  };

  // handle on click edit way to home
  const handleEditWayToHome = () => {
    navigation.navigate(ROUTE_KEY.DriverWayToWork4, {
      dataOldRoute: data,
      isRoadOut: true,
      isEditMyRoute: true,
      hasAddressStop: isHaveStopOverOut,
    });
  };

  useEffect(() => {
    const reload = DeviceEventEmitter.addListener(EMIT_EVENT.RELOAD_ROUTE_DRIVER, () => {
      refetch();
    });
    return () => reload.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const registerWayDriver = () => {
    refetch();
    checkAuthDriverAndPassenger({
      id: CMemberID,
      memberId: userID,
    })
      .unwrap()
      .then(returnedAuthValue => {
        if (returnedAuthValue?.authDriver === 'R') {
          navigation.navigate(ROUTE_KEY.DriverRejectApproval);
          return;
        }

        if (returnedAuthValue?.authDriver === 'C') {
          navigation.navigate(ROUTE_KEY.DriverWaitingApproved);
          return;
        }

        if (returnedAuthValue.authDriver === 'Y' && !isRouteRegistered) {
          navigation.navigate(ROUTE_KEY.DriverCompleteApproval);
          return;
        }

        if (returnedAuthValue?.authDriver === 'N') {
          navigation.navigate(ROUTE_KEY.DriverRegister);
          return;
        }
      });
  };

  if (!isRouteRegistered) {
    return <MyRouteEmpty onPress={registerWayDriver} />;
  }

  return (
    <View style={styles.containerStyle}>
      <ScrollView contentContainerStyle={{paddingTop: PADDING1, height: '100%'}}>
        {/* Change style */}
        <PaddingHorizontalWrapper containerStyles={{marginBottom: PADDING1}} forDriveMe>
          <PageButton
            text="스타일 등록 변경하기"
            onPress={() => {
              navigation.navigate(ROUTE_KEY.DriverFavoriteRegistration, {isDriverRoute: true});
            }}
          />
        </PaddingHorizontalWrapper>

        {isLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <LoadingComponent />
          </View>
        ) : (
          <>
            {/* On the way to work */}
            <PaddingHorizontalWrapper forDriveMe>
              <HStack style={styles.headerWrapperStyle}>
                <RouteBadge />
                <CustomButton
                  onPress={handleEditWayToWork}
                  type="TERTIARY"
                  text="변경"
                  outLine
                  buttonHeight={38}
                  buttonStyle={styles.buttonStyle}
                  textSize={FONT.CAPTION_6}
                />
              </HStack>

              <RoutePlanner
                isParkingFrom={!!data?.startParkIdIn}
                isParking={!!data?.endParkIdIn}
                arriveAddress={data?.endPlaceIn || ''}
                startAddress={data?.startPlaceIn || ''}
                stopOverAddress={isHaveStopOverIn ? data?.stopOverPlaceIn : ''}
                timeArrive={endTimeIn}
                timeStart={data?.startTimeIn || ''}
              />

              <HStack style={styles.priceWrapperStyle}>
                <InfoPriceRoute
                  hideChevron
                  price={data?.priceIn ?? ''}
                  soPrice={isHaveStopOverIn ? data?.soPriceIn : ''}
                />
              </HStack>
            </PaddingHorizontalWrapper>

            <Divider style={{marginVertical: heightScale1(30)}} />

            {/* Way home */}
            <PaddingHorizontalWrapper forDriveMe>
              <HStack style={styles.headerWrapperStyle}>
                <RouteBadge type="WAY_HOME" />
                <CustomButton
                  onPress={handleEditWayToHome}
                  type="TERTIARY"
                  text="변경"
                  outLine
                  buttonHeight={38}
                  textSize={FONT.CAPTION_6}
                  buttonStyle={styles.buttonStyle}
                />
              </HStack>

              <RoutePlanner
                isParkingFrom={!!data?.startParkIdOut}
                isParking={!!data?.endParkIdOut}
                arriveAddress={data?.endPlaceOut || ''}
                startAddress={data?.startPlaceOut || ''}
                stopOverAddress={isHaveStopOverOut ? data?.stopOverPlaceOut : ''}
                timeArrive={endTimeOut}
                timeStart={data?.startTimeOut || ''}
              />

              <HStack style={styles.priceWrapperStyle}>
                <InfoPriceRoute
                  hideChevron
                  price={data?.priceOut ?? ''}
                  soPrice={isHaveStopOverOut ? data?.soPriceOut : ''}
                />
              </HStack>
            </PaddingHorizontalWrapper>

            <Divider style={{marginVertical: heightScale1(30)}} />
          </>
        )}
      </ScrollView>
    </View>
  );
});

export default DriverRoute;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerWrapperStyle: {
    justifyContent: 'space-between',
    marginBottom: PADDING1,
  },
  priceWrapperStyle: {
    marginTop: PADDING1,
    justifyContent: 'flex-end',
  },
  buttonStyle: {
    paddingHorizontal: widthScale1(10),
    minWidth: widthScale1(45),
  },
});
